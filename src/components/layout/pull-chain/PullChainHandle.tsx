import React from 'react';
import { motion } from 'framer-motion';

interface PullChainHandleProps {
  theme: string;
  isDragging: boolean;
  pullAmount: number;
  rotation: number;
}

export default function PullChainHandle({
  theme,
  isDragging,
  pullAmount,
  rotation}: PullChainHandleProps) {
  // Return different design tokens based on the current page theme
  const getThemeStyles = () => {
    switch (theme) {
      case 'services':
        return {
          container: 'border-purple-500/50 bg-gradient-to-br from-purple-900/60 to-purple-950/80 shadow-[0_0_15px_rgba(168,85,247,0.5)]',
          glow: 'bg-purple-500/20 blur-md',
          glowColor: 'rgba(168,85,247,0.6)',
          textColor: 'text-purple-300 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]',
          connectorColor: 'bg-purple-800'};
      case 'academy':
        return {
          container: 'border-emerald-500/50 bg-gradient-to-br from-emerald-950/80 to-emerald-900/60 shadow-[0_0_15px_rgba(16,185,129,0.5)]',
          glow: 'bg-emerald-500/20 blur-md',
          glowColor: 'rgba(16,185,129,0.6)',
          textColor: 'text-emerald-300 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]',
          connectorColor: 'bg-emerald-800'};
      case 'about':
        return {
          container: 'border-amber-600/60 bg-gradient-to-br from-amber-700/80 to-yellow-800/80 shadow-[0_0_20px_rgba(217,119,6,0.5)]',
          glow: 'bg-amber-500/20 blur-md',
          glowColor: 'rgba(217,119,6,0.6)',
          textColor: 'text-amber-200 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]',
          connectorColor: 'bg-amber-900'};
      case 'client-connect':
        return {
          container: 'border-red-500/50 bg-gradient-to-br from-red-950/80 to-rose-900/70 shadow-[0_0_15px_rgba(239,68,68,0.5)]',
          glow: 'bg-red-500/20 blur-md',
          glowColor: 'rgba(239,68,68,0.6)',
          textColor: 'text-rose-300 drop-shadow-[0_0_8px_rgba(252,165,165,0.8)]',
          connectorColor: 'bg-red-900'};
      case 'home':
      default:
        return {
          container: 'border-blue-500/40 bg-gradient-to-br from-[#0c0f2b]/80 to-[#161a3f]/80 shadow-[0_0_15px_rgba(47,47,228,0.4)]',
          glow: 'bg-blue-500/20 blur-md',
          glowColor: 'rgba(47,47,228,0.5)',
          textColor: 'text-blue-300 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]',
          connectorColor: 'bg-gray-700'};
    }
  };

  const styles = getThemeStyles();

  return (
    <motion.div
      className="absolute z-50 flex flex-col items-center select-none"
      style={{
        left: 'calc(100% - 70px)',
        transform: `translateX(-50%) translateY(${120 + pullAmount}px) rotate(${rotation}deg)`,
        cursor: isDragging ? 'grabbing' : 'grab'}}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Top connector piece */}
      <div className={`w-3 h-4 rounded-t-sm ${styles.connectorColor} shadow-inner -mb-1`} />

      {/* Main Handle */}
      <div
        className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center relative overflow-hidden backdrop-blur-md transition-all duration-300 ${styles.container}`}
      >
        {/* Dynamic Light Beam */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse" />

        {/* Ambient Glow */}
        <div className={`absolute -inset-1 rounded-2xl opacity-75 ${styles.glow}`} />

        {/* Internal Glow Effect */}
        <div
          className="absolute inset-0.5 rounded-[14px] bg-gradient-to-b from-white/10 to-transparent"
          style={{
            boxShadow: `inset 0 1px 3px rgba(255,255,255,0.3), inset 0 -2px 10px ${styles.glowColor}`}}
        />

        {/* Handle Logo Text */}
        <span className={`text-2xl font-black relative z-10 select-none ${styles.textColor}`}>
          A
        </span>
      </div>

      {/* Pulse ring when hovered/idle */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.7, 0.3]}}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut'}}
        className="absolute w-20 h-20 rounded-full border pointer-events-none -top-1"
        style={{
          borderColor: styles.glowColor,
          top: '3px'}}
      />
    </motion.div>
  );
}
