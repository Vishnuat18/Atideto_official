import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Orbit, User, ClipboardList, MessageSquare, ShieldCheck,
  Sparkles, CheckCircle2, Lock, ArrowUpRight
} from 'lucide-react';

export default function ProjectIntakeWindow() {
  const [activeTab, setActiveTab] = useState(0);

  const sidebarItems = [
    { id: 'user', icon: User, label: 'Intake' },
    { id: 'tasks', icon: ClipboardList, label: 'Tasks' },
    { id: 'comms', icon: MessageSquare, label: 'Comms' },
    { id: 'security', icon: ShieldCheck, label: 'Security' },
  ];

  return (
    <div className="relative w-full max-w-[560px] mx-auto select-none">
      {/* Outer Floating Container with 3D shadow & subtle float */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* Main Floating Window Shell */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative rounded-[28px] border border-[#D5E0F2] dark:border-white/10 bg-[#EDF3FC]/90 dark:bg-[#0B1120]/90 p-3.5 md:p-4 shadow-[0_32px_74px_-20px_rgba(15,23,42,0.18)] dark:shadow-[0_32px_80px_-24px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300"
        >
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#D8E3F5] dark:border-white/10 mb-3.5">
            {/* Window Dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] shadow-sm inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] shadow-sm inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] shadow-sm inline-block" />
            </div>

            {/* Path / URL Pill */}
            <div className="flex items-center justify-center px-6 py-1 rounded-lg border border-[#D5E0F2] dark:border-white/10 bg-[#E2ECFA]/70 dark:bg-white/5 text-[#475569] dark:text-slate-400 text-[11px] font-medium tracking-wide">
              atideto / project intake
            </div>

            {/* Secure Badge */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0F172A] dark:text-white">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D26A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D26A]" />
              </span>
              Secure
            </div>
          </div>

          {/* Inner Grid Window Body */}
          <div className="grid grid-cols-[54px_1fr] gap-3 md:gap-4 min-h-[390px]">
            {/* Left Rail Sidebar */}
            <div className="flex flex-col items-center gap-3.5 py-2.5 px-1.5 rounded-2xl bg-[#E4EDFA]/60 dark:bg-white/5 border border-[#D5E0F2]/60 dark:border-white/5">
              {/* Brand Logo Orbit */}
              <div className="w-8 h-8 rounded-xl bg-[#2F2FE4]/10 dark:bg-[#2F2FE4]/20 flex items-center justify-center text-[#2F2FE4] dark:text-indigo-400 mb-2">
                <Orbit size={18} className="animate-spin-slow" />
              </div>

              {/* Rail Navigation Icons */}
              {sidebarItems.map((item, idx) => {
                const isActive = activeTab === idx;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(idx)}
                    className={`relative w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? 'bg-[#2F2FE4] text-white shadow-lg shadow-[#2F2FE4]/30 scale-105'
                        : 'text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-[#D5E0F2]/50 dark:hover:bg-white/10'
                    }`}
                  >
                    <Icon size={16} />
                  </button>
                );
              })}
            </div>

            {/* Main Window Dashboard View */}
            <div className="flex flex-col gap-3.5">
              {/* Main Intake Overview Heading */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider block">
                    Intake overview
                  </span>
                  <h3 className="text-lg md:text-xl font-extrabold text-[#0F172A] dark:text-white tracking-tight mt-0.5">
                    Your project in motion
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-xl border border-[#D5E0F2] dark:border-white/10 bg-white/60 dark:bg-white/5 flex items-center justify-center text-[#64748B] dark:text-slate-400">
                  <Sparkles size={16} />
                </div>
              </div>

              {/* Metric Cards Row 1 */}
              <div className="grid grid-cols-2 gap-3">
                {/* Proposal Card */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="p-3.5 rounded-2xl border border-[#D8E3F5] dark:border-white/10 bg-white/80 dark:bg-slate-900/60 shadow-sm"
                >
                  <span className="text-xs font-semibold text-[#64748B] dark:text-slate-400 block mb-1">
                    Proposal
                  </span>
                  <div className="text-2xl md:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
                    24h
                  </div>
                  <span className="text-[11px] font-bold text-[#00D26A] mt-1 flex items-center gap-1">
                    response time
                  </span>
                </motion.div>

                {/* Review Card */}
                <motion.div
                  whileHover={{ y: -2 }}
                  className="p-3.5 rounded-2xl border border-[#D8E3F5] dark:border-white/10 bg-white/80 dark:bg-slate-900/60 shadow-sm"
                >
                  <span className="text-xs font-semibold text-[#64748B] dark:text-slate-400 block mb-1">
                    Review
                  </span>
                  <div className="text-2xl md:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
                    98%
                  </div>
                  <span className="text-[11px] font-bold text-[#00D26A] mt-1 flex items-center gap-1">
                    on-time start
                  </span>
                </motion.div>
              </div>

              {/* Comms Channels Card with Animated Line Chart */}
              <motion.div
                whileHover={{ y: -2 }}
                className="p-3.5 rounded-2xl border border-[#D8E3F5] dark:border-white/10 bg-white/80 dark:bg-slate-900/60 shadow-sm flex items-end justify-between overflow-hidden"
              >
                <div>
                  <span className="text-xs font-semibold text-[#64748B] dark:text-slate-400 block mb-1">
                    Comms channels
                  </span>
                  <div className="text-2xl md:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
                    4
                  </div>
                </div>

                {/* Smooth Animated SVG Line Graph */}
                <div className="relative w-36 h-12">
                  <svg viewBox="0 0 160 50" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2EA8FF" />
                        <stop offset="50%" stopColor="#2F2FE4" />
                        <stop offset="100%" stopColor="#00D26A" />
                      </linearGradient>
                    </defs>

                    {/* Animated Line Path */}
                    <motion.path
                      d="M 5 40 C 25 38, 35 24, 55 26 C 75 28, 85 14, 105 18 C 125 22, 135 8, 155 10"
                      fill="none"
                      stroke="url(#lineGrad)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2.2, ease: 'easeOut', repeat: Infinity, repeatDelay: 1.5 }}
                    />

                    {/* End Glowing Pulse Circle */}
                    <motion.circle
                      cx="155"
                      cy="10"
                      r="4"
                      fill="#00D26A"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1.2, 0.5] }}
                      transition={{ duration: 2.2, ease: 'easeOut', repeat: Infinity, repeatDelay: 1.5 }}
                    />
                  </svg>
                </div>
              </motion.div>

              {/* Project Signals Card */}
              <div className="p-3.5 rounded-2xl border border-[#D8E3F5] dark:border-white/10 bg-white/80 dark:bg-slate-900/60 shadow-sm flex flex-col gap-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#E2ECFA] dark:border-white/5">
                  <span className="text-xs font-bold text-[#64748B] dark:text-slate-400">
                    Project signals
                  </span>
                  <span className="text-[10px] font-medium text-[#94A3B8]">
                    Updated now
                  </span>
                </div>

                {/* Status List */}
                <div className="space-y-2 text-xs">
                  {/* Item 1: Requirements Captured */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00D26A]" />
                      <span className="text-[#475569] dark:text-slate-300 font-medium">
                        Requirements captured
                      </span>
                    </div>
                    <span className="font-bold text-[#0F172A] dark:text-white">
                      Completed
                    </span>
                  </div>

                  {/* Item 2: Proposal Drafting (Active Pulsing) */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2EA8FF] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2EA8FF]" />
                      </span>
                      <span className="text-[#475569] dark:text-slate-300 font-medium">
                        Proposal drafting
                      </span>
                    </div>
                    <span className="font-bold text-[#0F172A] dark:text-white">
                      In progress
                    </span>
                  </div>

                  {/* Item 3: Discovery Call */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#CBD5E1] dark:bg-slate-600" />
                      <span className="text-[#94A3B8] dark:text-slate-400 font-medium">
                        Discovery call
                      </span>
                    </div>
                    <span className="font-bold text-[#0F172A] dark:text-white">
                      Queued
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Top-Right NDA Badge */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-4 -right-4 md:-right-6 z-20 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-[#D5E0F2] dark:border-white/10 shadow-[0_16px_36px_-10px_rgba(15,23,42,0.16)] backdrop-blur-xl"
        >
          <div className="w-7 h-7 rounded-xl bg-[#2F2FE4]/10 text-[#2F2FE4] flex items-center justify-center shrink-0">
            <ShieldCheck size={16} />
          </div>
          <div className="text-[11px] leading-tight">
            <span className="text-[#64748B] dark:text-slate-400 font-medium block">
              NDA protected
            </span>
            <strong className="text-[#0F172A] dark:text-white font-bold block">
              on request
            </strong>
          </div>
        </motion.div>

        {/* Floating Bottom-Left Reply Fast Badge */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-5 -left-4 md:-left-6 z-20 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-[#D5E0F2] dark:border-white/10 shadow-[0_16px_36px_-10px_rgba(15,23,42,0.16)] backdrop-blur-xl"
        >
          {/* Avatar Stack */}
          <div className="flex -space-x-1.5 overflow-hidden shrink-0">
            <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2F2FE4] text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
              A
            </div>
            <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#0EA5E9] text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
              T
            </div>
            <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2563EB] text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
              +
            </div>
          </div>
          <div className="text-[11px] leading-tight">
            <span className="text-[#64748B] dark:text-slate-400 font-medium block">
              We reply fast
            </span>
            <strong className="text-[#0F172A] dark:text-white font-bold block">
              within 24h
            </strong>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
