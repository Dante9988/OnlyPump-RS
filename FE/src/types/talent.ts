// OnlyPump Platform Types

export type TalentStatus = "Rising" | "Breakout" | "A-List";

export interface TalentProgress {
  auditions: number;
  roles: number;
  majorCredits: string[];
  awards?: string[];
  milestonePct: number; // 0-100
}

export interface TalentSocials {
  x?: string;
  ig?: string;
  yt?: string;
  tiktok?: string;
}

export interface Talent {
  id: string;
  handle: string;
  name: string;
  avatar_url?: string;
  banner_url?: string;
  logline?: string;
  tags: string[];
  socials: TalentSocials;
  progress: TalentProgress;
  presale_id?: string;
  status: TalentStatus;
  wallet_address?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PresaleVesting {
  cliffTs: number;
  endTs: number;
}

export interface Presale {
  id: string;
  talent_id: string;
  mint?: string;
  start_ts: number;
  end_ts: number;
  soft_cap_lamports: number;
  hard_cap_lamports: number;
  raised_lamports: number;
  min_deposit_lamports: number;
  max_deposit_lamports: number;
  is_finalized: boolean;
  token_acquired: string;
  vesting: PresaleVesting;
  whitelist_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserPosition {
  id: string;
  presale_id: string;
  wallet_address: string;
  deposited_lamports: number;
  pro_rata_share: string;
  unlocked_tokens: string;
  claimed_tokens: string;
  referral_code?: string;
  created_at?: string;
  updated_at?: string;
}
