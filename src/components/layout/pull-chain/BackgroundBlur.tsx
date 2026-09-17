import { motion } from 'framer-motion';

interface BackgroundBlurProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BackgroundBlur({ isOpen, onClose }: BackgroundBlurProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      onClick={onClose}
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md pointer-events-auto"
      style={{
        background: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%)'}}
    />
  );
}
