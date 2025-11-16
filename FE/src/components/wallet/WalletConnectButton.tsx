import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export const WalletConnectButton = () => {
  return (
    <div className="flex items-center">
      <WalletMultiButton className="!bg-primary !text-primary-foreground !border !border-primary/40 hover:!bg-primary/90 !h-9 !px-3 !text-xs md:!h-9 md:!px-4 md:!text-sm" />
    </div>
  );
};

export default WalletConnectButton;


