import { useState } from 'react';
import { motion } from 'framer-motion';
import { SavingsPanel } from '../../components/merchant/SavingsPanel';

export default function Savings() {
  const [savingsBps, setSavingsBps] = useState(1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">Savings</h1>
        <p className="text-secondary text-sm mt-1">
          Configure % split (enforced at contract). Default: 80% liquid · 10% savings · 5% emergency · 5% tax.
        </p>
      </div>

      <SavingsPanel
        savingsBps={savingsBps}
        onSavingsChange={setSavingsBps}
        liquidBalance="0.00"
        savingsBalance="0.00"
        emergencyBalance="0.00"
        taxBalance="0.00"
      />
    </motion.div>
  );
}
