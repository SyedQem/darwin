'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

type ToastProps = {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
  onClose: () => void;
};

export default function Toast({ message, type, visible, onClose }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="toast-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={`toast-panel ${type === 'success' ? 'toast-success' : 'toast-error'}`}>
            <span className="toast-accent" />
            <span className="toast-icon">
              {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            </span>
            <p className="text-sm text-white/90">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
