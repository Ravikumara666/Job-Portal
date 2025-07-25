// components/ToastMessage.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  X,
} from 'lucide-react';

const iconMap = {
  success: <CheckCircle className="text-green-500 w-6 h-6" />,
  danger: <XCircle className="text-red-500 w-6 h-6" />,
  warning: <AlertTriangle className="text-yellow-500 w-6 h-6" />,
  info: <Info className="text-blue-500 w-6 h-6" />,
};

export default function ToastMessage({ message, type = 'success', onClose }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed top-5 right-5 z-[1055] shadow-xl rounded-xl backdrop-blur-lg bg-red/10 border border-white/30 p-4 min-w-[280px] max-w-sm text-white"
        >
          <div className="flex items-center gap-3">
            <div>{iconMap[type] || iconMap.success}</div>
            <div className="flex-1 text-sm font-medium">{message}</div>
            <button
              onClick={onClose}
              className="hover:scale-110 transition-transform"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
