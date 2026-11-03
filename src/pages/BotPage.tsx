import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  MoreHorizontal,
  Paperclip,
  ArrowUp,
  SquarePen,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  ArrowUpRight,
  FileText,
  Calendar,
  Coins,
  Sun,
  CloudSun,
  Moon,
  Trash2,
  ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/seo/SEO';
import LadoAvatar from '@/components/lado/LadoAvatar';
import {
  ChatMessage,
  PREDEFINED_QUESTIONS,
  QuickQuestion,
  getTimeBasedGreeting,
  getLadoResponse,
} from '@/components/lado/ladoKnowledge';

export default function BotPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [showMenu, setShowMenu] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showPillsDuringChat, setShowPillsDuringChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const timeInfo = getTimeBasedGreeting();

  const topThreePills: QuickQuestion[] = [
    PREDEFINED_QUESTIONS[0],
    PREDEFINED_QUESTIONS[1],
    PREDEFINED_QUESTIONS[2],
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleStartNewChat = () => {
    setMessages([]);
    setInputVal('');
    setShowMenu(false);
    setShowAttachMenu(false);
    setShowPillsDuringChat(false);
    setTimeout(() => inputRef.current?.focus(), 150);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyWholeChat = () => {
    if (messages.length === 0) return;
    const transcript = messages
      .map((m) => `${m.sender === 'user' ? 'You' : 'Lado'}: ${m.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(transcript);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedback((prev) => ({
      ...prev,
      [id]: prev[id] === type ? undefined! : type,
    }));
  };

  const handleSendQuickQuestion = (q: QuickQuestion) => {
    setShowAttachMenu(false);
    setShowMenu(false);
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
    setShowAttachMenu(false);

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
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      navigate(href);
    }
  };

  const renderTimeIcon = (icon: 'sun' | 'cloud-sun' | 'moon' | 'sparkles') => {
    switch (icon) {
      case 'sun':
        return <Sun size={14} className="text-amber-400" />;
      case 'cloud-sun':
        return <CloudSun size={14} className="text-sky-400" />;
      case 'moon':
        return <Moon size={14} className="text-[#38BDF8]" />;
      case 'sparkles':
      default:
        return <Sparkles size={14} className="text-cyan-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-white font-sans flex flex-col pt-16 sm:pt-20 selection:bg-[#0052FF]/30">
      <SEO
        title="Lado AI Assistant | Atideto"
        description="Interact with Lado, Atideto's intelligent AI Assistant for custom software consulting, project estimates, and Academy guidance."
        url="https://atideto.in/bot"
      />

      {/* Blueprint grid subtle background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 30%, rgba(0, 82, 255, 0.08) 0%, rgba(7, 10, 17, 0) 70%),
            linear-gradient(to right, rgba(46, 168, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(46, 168, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 48px 48px, 48px 48px'
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto w-full px-3 sm:px-6 flex-1 flex flex-col h-[calc(100vh-80px)] py-3 sm:py-4">
        
        {/* ── 1. Top Header Bar (← Lado ...) ── */}
        <header className="flex items-center justify-between px-4 sm:px-5 py-3 rounded-2xl bg-[#0D121D]/90 border border-white/10 backdrop-blur-xl mb-3 shadow-lg">
          {/* Left: Back Arrow */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            title="Go back"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
          >
            <ArrowLeft size={19} />
          </button>

          {/* Center: Lado Title + Status */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5">
              <span
                className="font-bold text-base sm:text-lg text-white font-heading tracking-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Lado
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
            </div>
            <span className="text-[10.5px] text-slate-400 font-sans font-normal">
              Atideto AI Assistant
            </span>
          </div>

          {/* Right: Three Dots Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              aria-label="Options"
              title="More options"
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
            >
              <MoreHorizontal size={20} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-[#161B26] border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.7)] py-1.5 z-40 font-sans text-xs"
                >
                  <button
                    type="button"
                    onClick={handleStartNewChat}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-slate-200 hover:text-white hover:bg-white/[0.08] transition-colors text-left cursor-pointer"
                  >
                    <SquarePen size={15} className="text-[#38BDF8]" />
                    <span>New conversation</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyWholeChat}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-slate-200 hover:text-white hover:bg-white/[0.08] transition-colors text-left cursor-pointer"
                  >
                    {copiedAll ? (
                      <>
                        <Check size={15} className="text-emerald-400" />
                        <span className="text-emerald-400">Copied to clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy size={15} className="text-emerald-400" />
                        <span>Copy conversation</span>
                      </>
                    )}
                  </button>

                  <div className="my-1 border-t border-white/10" />

                  <button
                    type="button"
                    onClick={() => {
                      setMessages([]);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                  >
                    <Trash2 size={15} />
                    <span>Clear chat history</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* ── 2. Chat Messages Body ── */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 rounded-2xl bg-[#0B0F17]/90 border border-white/10 backdrop-blur-md space-y-5 shadow-2xl relative mb-3 scrollbar-thin scrollbar-thumb-white/10">
          
          {/* Empty State Hero */}
          {messages.length === 0 && (
            <div className="h-full flex flex-col justify-center items-center text-center py-6">
              <div className="mb-4">
                <LadoAvatar size="xl" isInteractive={false} isFloating={true} />
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs text-slate-300 mb-3 shadow-sm">
                {renderTimeIcon(timeInfo.icon)}
                <span>{timeInfo.greeting.split('.')[0]}</span>
              </div>

              <h2
                className="text-xl sm:text-2xl font-bold text-white tracking-tight max-w-lg font-heading leading-snug mb-2"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                What can I help you build today?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed font-sans font-normal">
                Ask about custom software engineering, AI agent pipelines, mobile app development, or Atideto Academy courses.
              </p>
            </div>
          )}

          {/* Conversation Stream */}
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group/msg animate-in fade-in duration-200`}
              >
                <div
                  className={`rounded-2xl px-5 py-3.5 leading-relaxed text-xs sm:text-sm max-w-[85%] sm:max-w-[78%] transition-all ${
                    isUser
                      ? 'bg-[#0052FF] text-white rounded-tr-sm shadow-[0_4px_20px_rgba(0,82,255,0.35)]'
                      : 'bg-[#141A26] border border-white/15 text-slate-100 rounded-tl-sm shadow-md'
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10 text-xs text-[#38BDF8] font-semibold">
                      <LadoAvatar size="sm" isInteractive={false} />
                      <span>Lado</span>
                    </div>
                  )}

                  <div className="whitespace-pre-line leading-relaxed font-normal font-sans">
                    {msg.text}
                  </div>

                  {msg.actionText && msg.actionHref && (
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => handleActionClick(msg.actionHref!)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#0052FF] hover:bg-[#0042CC] text-white shadow-[0_0_15px_rgba(0,82,255,0.4)] active:scale-95 transition-all cursor-pointer font-heading"
                      >
                        <span>{msg.actionText}</span>
                        <ExternalLink size={13} />
                      </button>
                    </div>
                  )}
                </div>

                {!isUser && (
                  <div className="flex items-center gap-3 mt-1.5 px-1 text-slate-400 opacity-80 group-hover/msg:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="text-xs flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check size={13} className="text-emerald-400" />
                          <span className="text-[11px] text-emerald-400 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span className="text-[11px]">Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleFeedback(msg.id, 'up')}
                      className={`hover:text-white transition-colors cursor-pointer ${
                        feedback[msg.id] === 'up' ? 'text-emerald-400' : ''
                      }`}
                    >
                      <ThumbsUp size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleFeedback(msg.id, 'down')}
                      className={`hover:text-white transition-colors cursor-pointer ${
                        feedback[msg.id] === 'down' ? 'text-rose-400' : ''
                      }`}
                    >
                      <ThumbsDown size={13} />
                    </button>

                    <span className="text-[11px] text-slate-500 ml-auto">
                      {msg.timestamp}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#141A26] border border-white/10 w-fit text-slate-300">
              <LadoAvatar size="sm" isInteractive={false} />
              <div className="flex items-center gap-1.5 py-1">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" style={{ animationDelay: '200ms' }} />
                <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── 3. Bottom Action Area (3 Pills Stack + ChatGPT Input Bar) ── */}
        <div className="p-3 sm:p-4 rounded-2xl bg-[#0D121D] border border-white/15 shadow-xl relative z-20">
          
          {/* Quick Suggestions toggle for active conversations */}
          {messages.length > 0 && (
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setShowPillsDuringChat((prev) => !prev)}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-[#38BDF8] transition-colors cursor-pointer"
              >
                <Sparkles size={11} className="text-[#38BDF8]" />
                <span>{showPillsDuringChat ? 'Hide suggestions' : 'Suggested prompts'}</span>
                <ChevronUp
                  size={12}
                  className={`transition-transform duration-200 ${
                    showPillsDuringChat ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
          )}

          {/* ── 3 STACKED PROMPT PILLS (Directly above input bar as sketched) ── */}
          {(messages.length === 0 || showPillsDuringChat) && (
            <div className="space-y-1.5 sm:space-y-2 mb-3">
              {topThreePills.map((q, idx) => {
                const pillLabels = [
                  'What software & mobile apps can Atideto build?',
                  'How can AI automate our business workflows?',
                  'Tell me about Academy tech training & internships'
                ];

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => handleSendQuickQuestion(q)}
                    className="w-full py-2 px-4 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#0052FF]/60 text-left text-xs sm:text-[13px] text-slate-200 hover:text-white transition-all flex items-center justify-between group cursor-pointer shadow-sm active:scale-[0.99]"
                  >
                    <span className="truncate pr-2 font-medium font-sans">
                      {pillLabels[idx] || q.title}
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="text-slate-400 group-hover:text-[#38BDF8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* ── ChatGPT-Style Input Bar with Attachment on Left & Send on Right ── */}
          <div className="relative">
            <form
              onSubmit={handleFormSubmit}
              className="relative flex items-center rounded-2xl sm:rounded-full bg-[#141A26] border border-white/15 focus-within:border-[#0052FF] focus-within:shadow-[0_0_20px_rgba(0,82,255,0.25)] transition-all px-2.5 py-1.5 shadow-lg"
            >
              {/* Attachment Icon on Left (Paperclip) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAttachMenu((prev) => !prev)}
                  title="Quick actions / Attach"
                  aria-label="Attach or action"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                >
                  <Paperclip size={16} />
                </button>

                {/* Attachment Quick Popover */}
                <AnimatePresence>
                  {showAttachMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: -8 }}
                      exit={{ opacity: 0, scale: 0.95, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 bottom-full mb-1 w-56 rounded-2xl bg-[#161B26] border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.7)] p-2 z-40 text-xs font-sans"
                    >
                      <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 px-2 py-1">
                        Quick Actions
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAttachMenu(false);
                          navigate('/requirement-gathering');
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/[0.08] text-left transition-colors cursor-pointer"
                      >
                        <FileText size={14} className="text-[#38BDF8]" />
                        <span>Submit project requirements</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAttachMenu(false);
                          navigate('/client-connect');
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/[0.08] text-left transition-colors cursor-pointer"
                      >
                        <Calendar size={14} className="text-[#34D399]" />
                        <span>Schedule strategy call</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAttachMenu(false);
                          setInputVal('Can you provide an estimate for building a mobile app or web platform?');
                          inputRef.current?.focus();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/[0.08] text-left transition-colors cursor-pointer"
                      >
                        <Coins size={14} className="text-amber-400" />
                        <span>Request project quote</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input Field */}
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Message Lado..."
                className="flex-1 bg-transparent px-3 py-2 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none"
              />

              {/* Send Button on Right (ArrowUp Circle like ChatGPT) */}
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                title="Send message"
                className="w-8 h-8 rounded-full bg-white text-black hover:bg-slate-200 disabled:opacity-25 disabled:bg-white/20 disabled:text-white/40 flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <ArrowUp size={16} strokeWidth={2.5} />
              </button>
            </form>

            {/* Disclaimer */}
            <div className="text-[10px] text-center text-slate-500 mt-2 font-normal font-sans">
              Lado can make mistakes. Verify important project details with Atideto team.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
