import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { Connection, PublicKey } from 'https://esm.sh/@solana/web3.js@1.98.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      presale_id, 
      wallet_address, 
      amount_lamports, 
      tx_signature,
      referral_code 
    } = await req.json();

    console.log('Recording deposit:', { presale_id, wallet_address, amount_lamports, tx_signature });

    // Validate inputs
    if (!presale_id || !wallet_address || !amount_lamports || !tx_signature) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate amount is positive and reasonable
    if (amount_lamports <= 0 || amount_lamports > 1e15) {
      return new Response(
        JSON.stringify({ error: 'Invalid deposit amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate wallet address format
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(wallet_address)) {
      return new Response(
        JSON.stringify({ error: 'Invalid wallet address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if transaction already processed (prevent replay attacks)
    const { data: existingTx } = await supabase
      .from('processed_transactions')
      .select('signature')
      .eq('signature', tx_signature)
      .maybeSingle();

    if (existingTx) {
      console.log('Transaction already processed:', tx_signature);
      return new Response(
        JSON.stringify({ error: 'Transaction already processed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify transaction on Solana blockchain
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    
    let txInfo;
    try {
      txInfo = await connection.getTransaction(tx_signature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0
      });
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return new Response(
        JSON.stringify({ error: 'Could not verify transaction on blockchain' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!txInfo || !txInfo.meta) {
      return new Response(
        JSON.stringify({ error: 'Transaction not found on blockchain' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify transaction is from the correct wallet
    const signers = txInfo.transaction.message.staticAccountKeys || [];
    const fromPubkey = signers[0]?.toString();
    
    if (fromPubkey !== wallet_address) {
      return new Response(
        JSON.stringify({ error: 'Transaction signer does not match wallet address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify actual transaction amount
    const preBalance = txInfo.meta.preBalances[0];
    const postBalance = txInfo.meta.postBalances[0];
    const actualAmount = preBalance - postBalance - 5000; // Subtract transaction fee (~5000 lamports)
    
    // Allow some tolerance for fees (within 10000 lamports)
    if (Math.abs(actualAmount - amount_lamports) > 10000) {
      console.error('Amount mismatch:', { actualAmount, claimed: amount_lamports });
      return new Response(
        JSON.stringify({ 
          error: 'Transaction amount does not match claimed amount',
          actual: actualAmount,
          claimed: amount_lamports
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get presale and verify destination
    const { data: presale, error: presaleError } = await supabase
      .from('presales')
      .select('talent_id')
      .eq('id', presale_id)
      .single();

    if (presaleError || !presale) {
      return new Response(
        JSON.stringify({ error: 'Presale not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get talent wallet address
    const { data: talent, error: talentError } = await supabase
      .from('talents')
      .select('wallet_address')
      .eq('id', presale.talent_id)
      .single();

    if (talentError || !talent || !talent.wallet_address) {
      return new Response(
        JSON.stringify({ error: 'Talent wallet not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify transaction sent to correct destination
    const recipientKey = signers[1]?.toString();
    if (recipientKey !== talent.wallet_address) {
      console.error('Destination mismatch:', { recipient: recipientKey, expected: talent.wallet_address });
      return new Response(
        JSON.stringify({ error: 'Transaction destination does not match talent wallet' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Record transaction as processed (prevent replay)
    const { error: txRecordError } = await supabase
      .from('processed_transactions')
      .insert({
        signature: tx_signature,
        presale_id,
        wallet_address,
        amount_lamports
      });

    if (txRecordError) {
      console.error('Error recording transaction:', txRecordError);
      throw txRecordError;
    }

    // Get or create user position
    const { data: existingPosition } = await supabase
      .from('user_positions')
      .select('*')
      .eq('presale_id', presale_id)
      .eq('wallet_address', wallet_address)
      .maybeSingle();

    if (existingPosition) {
      // Update existing position
      const newDepositedAmount = BigInt(existingPosition.deposited_lamports) + BigInt(amount_lamports);
      
      const { error: updateError } = await supabase
        .from('user_positions')
        .update({
          deposited_lamports: newDepositedAmount.toString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingPosition.id);

      if (updateError) {
        console.error('Error updating position:', updateError);
        throw updateError;
      }
    } else {
      // Create new position
      const { error: insertError } = await supabase
        .from('user_positions')
        .insert({
          presale_id,
          wallet_address,
          deposited_lamports: amount_lamports,
          referral_code: referral_code || null,
        });

      if (insertError) {
        console.error('Error creating position:', insertError);
        throw insertError;
      }
    }

    // Update presale raised amount
    const { data: presaleData } = await supabase
      .from('presales')
      .select('raised_lamports')
      .eq('id', presale_id)
      .single();

    if (presaleData) {
      const newRaisedAmount = BigInt(presaleData.raised_lamports || 0) + BigInt(amount_lamports);
      
      const { error: updatePresaleError } = await supabase
        .from('presales')
        .update({
          raised_lamports: newRaisedAmount.toString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', presale_id);

      if (updatePresaleError) {
        console.error('Error updating presale:', updatePresaleError);
        throw updatePresaleError;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Deposit recorded successfully',
        tx_signature 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in record-presale-deposit:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
