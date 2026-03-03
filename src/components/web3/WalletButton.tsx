import { createThirdwebClient } from 'thirdweb';
import { ConnectButton } from 'thirdweb/react';

const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || 'fallback-client-id',
});

export function WalletButton() {
  return (
    <ConnectButton
      client={client}
      connectButton={{
        label: 'Become a Merchant',
        className: '!bg-accent-green !hover:bg-accent-green-hover !text-white !rounded-full !px-6 !py-2 !font-medium',
      }}
      detailsButton={{
        className: '!bg-accent-green !text-white !rounded-full !px-4 !py-2 !font-medium',
      }}
      switchButton={{ label: 'Switch Network' }}
    />
  );
}
