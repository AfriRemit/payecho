import { motion } from 'framer-motion';
import { LoanPanel } from '../../components/merchant/LoanPanel';
import { MerchantNFT } from '../../components/merchant/MerchantNFT';

export default function Lending() {
  const isEligible = false;
  const daysActive = 0;
  const creditScore = 0;
  const avgMonthlyRevenue = 0;
  const currentTier = 'Seed';
  const maxLoanUsdc = isEligible && avgMonthlyRevenue > 0 ? avgMonthlyRevenue : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">Lending</h1>
        <p className="text-secondary text-sm mt-1">
          Revenue-based USDC loans. 15% of each payment auto-deducted until repaid.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LoanPanel
          isEligible={isEligible}
          daysActive={daysActive}
          creditScore={creditScore}
          avgMonthlyRevenue={avgMonthlyRevenue}
          currentTier={currentTier}
          maxLoanUsdc={maxLoanUsdc}
        />
        <MerchantNFT tier={currentTier} score={creditScore} nextTierScore={300} />
      </div>
    </motion.div>
  );
}
