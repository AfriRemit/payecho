import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
  WalletAdvancedAddressDetails,
  WalletAdvancedTokenHoldings,
  WalletAdvancedTransactionActions,
  WalletAdvancedWalletActions,
} from '@coinbase/onchainkit/wallet';

export function WalletButton() {
  return (
    <Wallet>
      <ConnectWallet
        className="!bg-accent-green hover:!bg-accent-green-hover !text-white !rounded-full !px-6 !py-2 !font-medium"
        disconnectedLabel="Become a Merchant"
      />
      <WalletDropdown>
        <WalletAdvancedWalletActions />
        <WalletAdvancedAddressDetails />
        <WalletAdvancedTransactionActions />
        <WalletAdvancedTokenHoldings />
        <WalletDropdownDisconnect />
      </WalletDropdown>
    </Wallet>
  );
}
