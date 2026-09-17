import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowUp,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Rocket,
  Bot,
  GraduationCap,
  Coins,
  Zap,
  MapPin,
  Sun,
  CloudSun,
  Moon,
  SquarePen,
  ChevronDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LadoAvatar from './LadoAvatar';
import {
  ChatMessage,
  PREDEFINED_QUESTIONS,
  QuickQuestion,
  getTimeBasedGreeting,
  getLadoResponse,
} from './ladoKnowledge';

interface LadoChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LadoChatModal({ isOpen, onClose }: LadoChatModalProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Time-based welcome context
  const timeInfo = getTimeBasedGreeting();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleStartNewChat = () => {
    setMessages([]);
    setInputVal('');
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedback((prev) => ({
      ...prev,
      [id]: prev[id] === type ? undefined! : type,
    }));
  };

  const handleSendQuickQuestion = (q: QuickQuestion) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q.queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const ladoMsg: ChatMessage = {
        id: `lado-${Date.now()}`,
        sender: 'lado',
        text: q.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionText: q.actionText,
        actionHref: q.actionHref,
      };
      setMessages((prev) => [...prev, ladoMsg]);
    }, 450);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputVal.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const response = getLadoResponse(query);
      const ladoMsg: ChatMessage = {
        id: `lado-${Date.now()}`,
        sender: 'lado',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionText: response.actionText,
        actionHref: response.actionHref,
      };
      setMessages((prev) => [...prev, ladoMsg]);
    }, 500);
  };

  const handleActionClick = (href: string) => {
    onClose();
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      navigate(href);
    }
  };

  const renderQuickIcon = (iconName: QuickQuestion['iconName']) => {
    switch (iconName) {
      case 'rocket':
        return <Rocket size={17} className="text-[#38BDF8]" />;
      case 'bot':
        return <Bot size={17} className="text-[#A78BFA]" />;
      case 'graduation-cap':
        return <GraduationCap size={17} className="text-[#34D399]" />;
      case 'coins':
        return <Coins size={17} className="text-[#FBBF24]" />;
      case 'zap':
        return <Zap size={17} className="text-[#F472B6]" />;
      case 'map-pin':
        return <MapPin size={17} className="text-[#60A5FA]" />;
      default:
        return <Sparkles size={17} className="text-[#38BDF8]" />;
    }
  };

  const renderTimeIcon = (icon: 'sun' | 'cloud-sun' | 'moon' | 'sparkles') => {
    switch (icon) {
      case 'sun':
        return <Sun size={14} className="text-amber-400" />;
      case 'cloud-sun':
        return <CloudSun size={14} className="text-sky-400" />;
      case 'moon':
        return <Moon size={14} className="text-indigo-400" />;
      case 'sparkles':
      default:
        return <Sparkles size={14} className="text-cyan-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 25, scale: 0.94 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-24 right-4 sm:right-8 z-50 w-[95vw] sm:w-[420px] md:w-[440px] h-[600px] max-h-[84vh] rounded-[26px] overflow-hidden flex flex-col shadow-[0_24px_70px_rgba(0,0,0,0.9),0_0_50px_rgba(0,198,255,0.2)] border border-white/15 bg-[#0D1117] text-white font-sans"
        >
          {/* Subtle Ambient Radial Accents */}
          <div className="absolute -top-24 -left-24 w-52 h-52 bg-[#0052FF]/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-[#00C6FF]/15 rounded-full blur-[80px] pointer-events-none" />

          {/* ── Top Header (ChatGPT Style) ── */}
          <div className="relative z-10 px-4 py-3.5 border-b border-white/10 bg-[#161B22]/90 backdrop-blur-md flex items-center justify-between">
            {/* Model Selector Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all cursor-default group">
              <LadoAvatar size="sm" isInteractive={false} />
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs tracking-tight text-white flex items-center gap-1.5">
                  Lado
                  <span className="text-[10px] text-slate-400 font-normal">4.5</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
                <ChevronDown size={12} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
              </div>
            </div>

            {/* Header Right Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleStartNewChat}
                title="New chat"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <SquarePen size={15} />
              </button>
              <button
                onClick={onClose}
                title="Close"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* ── Chat Messages Body ── */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 relative z-10 scrollbar-thin scrollbar-thumb-white/10">
            
            {/* ChatGPT Empty State (Shown before any conversation) */}
            {messages.length === 0 && (
              <div className="h-full flex flex-col justify-between py-2">
                
                {/* Hero Mascot & Welcome Prompt */}
                <div className="flex flex-col items-center text-center mt-2">
                  <div className="mb-3">
                    <LadoAvatar size="lg" isInteractive={false} isFloating={true} />
                  </div>

                  {/* Time Badge with Lucide Icon (No emojis) */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-slate-300 mb-2">
                    {renderTimeIcon(timeInfo.icon)}
                    <span>{timeInfo.greeting.split('.')[0]}</span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    What can I help you build today?
                  </h2>
                  <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                    Ask about custom software, AI automation pipelines, Academy internships, or project estimates.
                  </p>
                </div>

                {/* 2x2 GPT Suggestion Prompt Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                  {PREDEFINED_QUESTIONS.slice(0, 4).map((q) => (
                    <button
                      key={q.id}
                      onClick={() => handleSendQuickQuestion(q)}
                      className="p-3 rounded-xl border border-white/10 bg-[#161B22]/70 hover:bg-[#1C2129] hover:border-[#00C6FF]/50 text-left transition-all duration-200 group cursor-pointer flex flex-col justify-between min-h-[82px] shadow-sm"
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="p-1.5 rounded-lg bg-white/[0.05] group-hover:bg-white/10 transition-colors">
                          {renderQuickIcon(q.iconName)}
                        </span>
                        <span className="text-slate-600 group-hover:text-[#00C6FF] transition-colors text-xs">
                          <ArrowUp size={13} className="rotate-45" />
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-slate-200 group-hover:text-white transition-colors">
                          {q.title}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {q.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

              </div>
            )}

            {/* Conversation Stream (GPT Style) */}
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group/msg`}
                >
                  {/* Message Card */}
                  <div
                    className={`rounded-2xl px-4 py-3 leading-relaxed text-[13px] sm:text-[13.5px] max-w-[88%] transition-all ${
                      isUser
                        ? 'bg-[#1D68FE] text-white rounded-tr-sm shadow-[0_4px_18px_rgba(29,104,254,0.35)] font-normal'
                        : 'bg-[#161B22] border border-white/10 text-slate-200 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    {/* Bot header inside message */}
                    {!isUser && (
                      <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-white/10 text-[11px] text-[#38BDF8] font-semibold">
                        <LadoAvatar size="sm" isInteractive={false} />
                        <span>Lado Assistant</span>
                      </div>
                    )}

                    <div className="whitespace-pre-line leading-relaxed">
                      {msg.text}
                    </div>

                    {/* Action button if response has one */}
                    {msg.actionText && msg.actionHref && (
                      <div className="mt-3 pt-2.5 border-t border-white/10">
                        <button
                          onClick={() => handleActionClick(msg.actionHref!)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#1F242C] hover:bg-[#282E38] text-white border border-white/15 hover:border-[#00C6FF]/60 active:scale-95 transition-all cursor-pointer shadow-sm"
                        >
                          <span>{msg.actionText}</span>
                          <ExternalLink size={12} className="text-[#38BDF8]" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* GPT Action Toolbar under message (Copy & Reactions) */}
                  {!isUser && (
                    <div className="flex items-center gap-2 mt-1.5 px-1 opacity-70 group-hover/msg:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        title="Copy response"
                        className="text-slate-400 hover:text-white text-xs flex items-center gap-1 py-0.5 px-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check size={12} className="text-emerald-400" />
                            <span className="text-[10px] text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span className="text-[10px]">Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleFeedback(msg.id, 'up')}
                        title="Helpful"
                        className={`text-xs p-1 rounded hover:bg-white/5 transition-colors cursor-pointer ${
                          feedback[msg.id] === 'up' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <ThumbsUp size={11} />
                      </button>

                      <button
                        onClick={() => handleFeedback(msg.id, 'down')}
                        title="Not helpful"
                        className={`text-xs p-1 rounded hover:bg-white/5 transition-colors cursor-pointer ${
                          feedback[msg.id] === 'down' ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <ThumbsDown size={11} />
                      </button>

                      <span className="text-[10px] text-slate-500 ml-auto">
                        {msg.timestamp}
                      </span>
                    </div>
                  )}

                  {isUser && (
                    <span className="text-[10px] text-slate-500 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#161B22] border border-white/10 w-fit text-slate-300">
                <LadoAvatar size="sm" isInteractive={false} />
                <div className="flex items-center gap-1 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" style={{ animationDelay: '200ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Bottom Input Bar (ChatGPT Style) ── */}
          <div className="p-3 border-t border-white/10 bg-[#161B22]/95 backdrop-blur-md relative z-10">
            <form
              onSubmit={handleFormSubmit}
              className="relative flex items-center rounded-2xl bg-[#0D1117] border border-white/15 focus-within:border-[#00C6FF]/70 focus-within:shadow-[0_0_20px_rgba(0,198,255,0.2)] transition-all p-1.5"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Message Lado..."
                className="flex-1 bg-transparent px-3 py-2 text-white placeholder:text-slate-500 text-xs sm:text-[13.5px] focus:outline-none"
              />

              {/* Signature Up-Arrow Circular Send Button (Like ChatGPT) */}
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                title="Send message"
                className="w-8 h-8 rounded-xl bg-white text-black hover:bg-slate-200 disabled:opacity-30 disabled:bg-white/20 disabled:text-white/40 flex items-center justify-center shrink-0 transition-all cursor-pointer"
              >
                <ArrowUp size={16} strokeWidth={2.5} />
              </button>
            </form>

            <div className="text-[10px] text-center text-slate-500 mt-2 font-normal">
              Lado provides information regarding Atideto software, services, and Academy.
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
