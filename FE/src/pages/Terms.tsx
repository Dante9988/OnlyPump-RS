import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/layout/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4 gradient-text">Terms of Presale</h1>
          <p className="text-xl text-muted-foreground">
            Please read these terms carefully before participating in any presales
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/40">
          <CardHeader>
            <CardTitle>OnlyPump.me Presale Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: September 2024</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Service Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                OnlyPump.me operates as a platform connecting content creators with fans through token-based presales. 
                We facilitate presale pools where fans contribute USDC, which is then used to purchase creator tokens 
                on Pump.fun in bundled transactions for fair distribution.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">2. Presale Mechanics</h2>
              <div className="text-muted-foreground space-y-2">
                <p>• Fans contribute USDC to creator presale pools</p>
                <p>• Minimum contribution: $5 USDC per presale</p>
                <p>• Maximum contribution: $500 USDC per wallet per presale</p>
                <p>• Funds are held in multisig escrow until presale completion</p>
                <p>• Upon completion, funds are used for bundled token purchase on Pump.fun</p>
                <p>• Tokens are distributed pro-rata based on contribution amounts</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">3. Risk Acknowledgment</h2>
              <p className="text-muted-foreground leading-relaxed">
                Participants acknowledge that token investments carry significant risks including total loss of funds, 
                price volatility, and no guarantee of returns. Tokens are purchased on third-party platforms (Pump.fun) 
                and their value is subject to market forces beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Platform Responsibilities</h2>
              <div className="text-muted-foreground space-y-2">
                <p>• Secure handling of presale funds in multisig escrow</p>
                <p>• Execution of bundled purchases on Pump.fun</p>
                <p>• Pro-rata token distribution to participant wallets</p>
                <p>• Provision of on-chain transaction receipts</p>
                <p>• Platform maintenance and security</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">5. User Responsibilities</h2>
              <div className="text-muted-foreground space-y-2">
                <p>• Provide accurate Solana wallet addresses</p>
                <p>• Understand risks associated with token investments</p>
                <p>• Comply with applicable laws and regulations</p>
                <p>• Secure their own wallet and private keys</p>
                <p>• Only invest amounts they can afford to lose</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Fees and Costs</h2>
              <p className="text-muted-foreground leading-relaxed">
                OnlyPump.me charges a 10% platform fee on creator donations and burn events. Presale participation 
                does not incur additional fees beyond Solana network transaction costs for token distribution.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                OnlyPump.me shall not be liable for any losses arising from token price fluctuations, market conditions, 
                technical failures, or third-party platform issues. Our liability is limited to the fees paid to use 
                our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Dispute Resolution</h2>
              <p className="text-muted-foreground leading-relaxed">
                Disputes shall be resolved through binding arbitration in accordance with applicable jurisdiction. 
                Users waive rights to class action lawsuits and agree to individual arbitration proceedings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">9. Modifications</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms may be updated periodically. Continued use of the platform after modifications constitutes 
                acceptance of the updated terms. Major changes will be communicated to users in advance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">10. Contact Information</h2>
              <div className="text-muted-foreground space-y-2">
                <p>For questions about these terms:</p>
                <p>• Telegram: <a href="https://t.me/DenManuGPT" className="text-primary hover:underline">@DenManuGPT</a></p>
                <p>• Twitter: <a href="https://x.com/denmanu1989" className="text-primary hover:underline">@denmanu1989</a></p>
              </div>
            </section>

            <div className="mt-8 p-4 bg-muted/20 rounded-lg border border-border/40">
              <p className="text-sm text-muted-foreground">
                By participating in presales on OnlyPump.me, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Presale. If you do not agree with these terms, 
                please do not use our service.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;