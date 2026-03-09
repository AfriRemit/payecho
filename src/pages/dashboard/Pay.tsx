import { motion } from 'framer-motion';
import { AmountSection } from '../../components/payment/AmountSection';
import { ConfirmPaymentModal } from '../../components/payment/ConfirmPaymentModal';
import { PaymentSuccessModal } from '../../components/payment/PaymentSuccessModal';
import { PayPageHeader } from '../../components/payment/PayPageHeader';
import { PayScanHint } from '../../components/payment/PayScanHint';
import { PaymentMethodSelector } from '../../components/payment/PaymentMethodSelector';
import { WalletPayPanel } from '../../components/payment/WalletPayPanel';
import { LocalPaymentPanel } from '../../components/payment/LocalPaymentPanel';
import { PayPageFooter } from '../../components/payment/PayPageFooter';
import { usePayWithWallet } from '../../components/payment/usePayWithWallet';

const isMobile =
  typeof navigator !== 'undefined' &&
  /Android|iPhone|iPad|iPod|webOS|Mobi|BlackBerry|IEMobile/i.test(navigator.userAgent);

export default function PayPage() {
  const {
    parsed,
    mode,
    amount,
    vault,
    merchant,
    setOverrideAmount,
    setManualMerchantAddress,
    paymentMethod,
    setPaymentMethod,
    confirmOpen,
    setConfirmOpen,
    successOpen,
    setSuccessOpen,
    walletMenuOpen,
    setWalletMenuOpen,
    walletMenuRef,
    walletAddress,
    usdcBalance,
    hasInsufficientBalance,
    needsSwitch,
    isConnectPending,
    isSwitchPending,
    disconnect,
    ZERO_ADDRESS,
    handleRequestPay,
    handleConfirmPay,
    handleConnectWallet,
  } = usePayWithWallet();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto px-4 py-6 sm:px-6 sm:py-8"
    >
      <div className="bg-secondary rounded-2xl border border-white/10 overflow-hidden">
        <PayPageHeader
          parsed={parsed}
          walletMenuOpen={walletMenuOpen}
          onToggleWalletMenu={() => setWalletMenuOpen((o) => !o)}
          walletMenuRef={walletMenuRef}
          walletAddress={walletAddress}
          isConnectPending={isConnectPending}
          onConnect={handleConnectWallet}
          onDisconnect={() => {
            disconnect();
            setWalletMenuOpen(false);
          }}
        />

        {!parsed && isMobile && <PayScanHint />}

        <AmountSection
          mode={mode}
          amount={amount}
          vault={vault}
          merchant={merchant}
          onChangeAmount={setOverrideAmount}
          vaultEditable={false}
          merchantEditable={true}
          onMerchantChange={setManualMerchantAddress}
        />

        <div className="px-6 pb-6 space-y-4">
          <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />

          {paymentMethod === 'wallet' ? (
            <WalletPayPanel
              walletAddress={walletAddress}
              usdcBalance={usdcBalance}
              hasInsufficientBalance={hasInsufficientBalance}
              amount={amount}
              vault={vault}
              needsSwitch={needsSwitch}
              isConnectPending={isConnectPending}
              isSwitchPending={isSwitchPending}
              zeroAddress={ZERO_ADDRESS}
              onConnect={handleConnectWallet}
              onPay={handleRequestPay}
            />
          ) : (
            <LocalPaymentPanel />
          )}
        </div>

        <PayPageFooter />
      </div>

      <ConfirmPaymentModal
        open={confirmOpen}
        amount={amount}
        merchant={merchant}
        onConfirm={handleConfirmPay}
        onCancel={() => setConfirmOpen(false)}
      />

      <PaymentSuccessModal open={successOpen} amount={amount} onClose={() => setSuccessOpen(false)} />
    </motion.div>
  );
}
