import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface XPToastProps {
  amount: number;
  show: boolean;
  onHide: () => void;
}

export default function XPToast({ amount, show, onHide }: XPToastProps) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onHide, 2500);
      return () => clearTimeout(t);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl px-6 py-3 shadow-2xl font-black text-xl flex items-center gap-2"
        >
          <motion.span
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 0.5 }}
          >
            ⭐
          </motion.span>
          +{amount} XP!
        </motion.div>
      )}
    </AnimatePresence>
  );
}
