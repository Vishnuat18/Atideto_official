import React, { useState } from 'react';
import { useTheme, FONT_PAIRS } from '@/context/ThemeContext';
import { Type, Sparkles, Check, X, SlidersHorizontal } from 'lucide-react';

export default function EditorialFontSwitcher() {
  const { fontPair, setFontPair, activeFontPair } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-24 right-6 z-40 hidden md:block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Editorial Typography Pairings"
          className="group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-[#121218]/90 hover:bg-[#1A1A24] text-white border border-white/15 hover:border-[#2F2FE4]/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <div className="relative flex items-center justify-center size-7 rounded-full bg-[#2F2FE4]/20 text-[#38BDF8] border border-[#2F2FE4]/30 group-hover:bg-[#2F2FE4] group-hover:text-white transition-colors">
            <Type className="size-4" />
          </div>
          <div className="text-left">
            <div className="text-[10px] tracking-widest uppercase text-muted-foreground font-semibold flex items-center gap-1">
              <span>Typography</span>
              <span className="inline-block size-1.5 rounded-full bg-[#00D26A] animate-pulse" />
            </div>
            <div className="text-xs font-semibold text-white/90 truncate max-w-[120px]">
              {activeFontPair.name}
            </div>
          </div>
          <SlidersHorizontal className="size-3.5 text-muted-foreground group-hover:text-white transition-colors ml-1" />
        </button>
      </div>

      {/* Font Selection Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#0c0c12] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0066FF]/15 border border-[#0066FF]/30 text-[#38BDF8] text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="size-3" />
                  <span>8 Modern Tech & Digital Agency Font Pairings</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-heading">
                  Digital Agency Typography System
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Select any contemporary typeface combination to transform the entire website's headers, badges, and interface copy.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Font Pairings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6">
              {FONT_PAIRS.map((pair) => {
                const isSelected = fontPair === pair.id;
                return (
                  <button
                    key={pair.id}
                    onClick={() => {
                      setFontPair(pair.id);
                    }}
                    className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer relative group ${
                      isSelected
                        ? 'bg-[#0066FF]/20 border-[#0066FF] shadow-[0_0_24px_rgba(0,102,255,0.3)]'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Pair 0{pair.id} · {pair.category}
                      </span>
                      {isSelected && (
                        <div className="flex items-center gap-1 text-[11px] text-[#00D26A] font-semibold">
                          <Check className="size-3.5" />
                          <span>Active</span>
                        </div>
                      )}
                    </div>

                    {/* Headline Font Preview */}
                    <div
                      className="text-lg sm:text-xl font-bold text-white tracking-tight mb-1"
                      style={{
                        fontFamily: `${pair.heading}, sans-serif`
                      }}
                    >
                      {pair.heading}
                    </div>

                    {/* Body Font Preview */}
                    <div
                      className="text-xs text-slate-300 font-normal"
                      style={{
                        fontFamily: `${pair.body}, sans-serif`
                      }}
                    >
                      {pair.body.toUpperCase()} — {pair.tagline}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer / Apply info */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <div>
                Currently active: <strong className="text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{activeFontPair.heading}</strong> +{' '}
                <strong className="text-white">{activeFontPair.body}</strong>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#0052FF] to-[#0066FF] hover:from-[#0047E0] hover:to-[#005AEB] text-white font-medium shadow-[0_2px_12px_rgba(0,102,255,0.4)] transition-all cursor-pointer"
              >
                Apply To Entire Site
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
