import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayCircle, Award, Briefcase, Clock, CheckCircle2, ChevronRight, Layers, Sparkles, Folder, Users, BarChart2,
  Code2, Server, Database, Globe, Smartphone, Shield, Cloud, Palette, Laptop, Target, Zap, Rocket, Star, 
  MessageSquare, HelpCircle, ChevronDown, Compass, Download, ArrowRight, Check, Calendar
} from 'lucide-react';
import { INTERNSHIP_PROGRAMS, INTERNSHIP_CATEGORIES } from '@/constants';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// --- Subcomponents for Right Panel ---

const DeepMindVisual = ({ icon }: { icon: string }) => {
  return (
    <div className="relative flex items-center justify-center p-4">
      {/* Center Floating Image with Shadow */}
      <motion.div 
        animate={{ y: [-15, 15, -15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10"
      >
        <img 
          src={icon} 
          alt="Internship Logo" 
          className="w-32 h-32 lg:w-40 lg:h-40 object-contain drop-shadow-[0_20px_30px_rgba(0,163,255,0.3)] hover:drop-shadow-[0_20px_40px_rgba(0,163,255,0.6)] transition-all duration-300" 
        />
      </motion.div>
    </div>
  );
};

export default function InternshipExplorer() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeId, setActiveId] = useState(INTERNSHIP_PROGRAMS[0].id);
  const [isApplying, setIsApplying] = useState(false);
  const [applyStep, setApplyStep] = useState(0);
  const [applyForm, setApplyForm] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    resumeName: '',
    college: '',
    degree: '',
    stream: '',
    graduationYear: '',
    startDate: '',
    endDate: '',
    paymentOption: 'Pay Now'
  });

  const filteredPrograms = activeCategory === 'All' 
    ? INTERNSHIP_PROGRAMS 
    : INTERNSHIP_PROGRAMS.filter(p => p.category === activeCategory);

  const activeProgram = INTERNSHIP_PROGRAMS.find(p => p.id === activeId) || INTERNSHIP_PROGRAMS[0];

  return (
    <div className="w-full relative z-10 text-white font-sans">
      
      {/* 1. Filters */}
      <div className="text-center mb-10">
        <div className="flex flex-wrap justify-center gap-3">
          {INTERNSHIP_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-[#0052FF] text-white shadow-[0_0_20px_rgba(0,82,255,0.4)] border border-[#0052FF]'
                  : 'bg-transparent text-white/60 border border-white/20 hover:border-white/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Split Layout (Explorer) */}
      <div className="flex flex-col lg:flex-row gap-8 mb-24 items-stretch">
        
        {/* Left Panel (35%) */}
        <div className="w-full lg:w-[35%] flex flex-col h-[600px] lg:h-auto overflow-hidden">
          <div className="flex flex-col gap-3 relative h-full overflow-y-auto custom-scrollbar pr-2 pb-10 lg:pb-0">
            <AnimatePresence>
              {filteredPrograms.map((prog) => {
                const isActive = prog.id === activeId;
                return (
                  <motion.button
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={prog.id}
                    onClick={() => {
                      setActiveId(prog.id);
                      setIsApplying(false);
                    }}
                    whileHover={{ scale: 1.02 }}
                    className={`relative w-full p-4 rounded-[16px] text-left transition-all duration-300 overflow-hidden flex items-center justify-between group ${
                      isActive 
                        ? 'bg-[#0B1221] border border-[#00A3FF]/50 shadow-[0_0_20px_rgba(0,163,255,0.15)]' 
                        : 'bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-white/20'
                    }`}
                  >
                    {/* Active Background Sweep */}
                    {isActive && (
                      <motion.div 
                        layoutId="activeGlowLeft"
                        className="absolute inset-0 bg-gradient-to-r from-[#00A3FF]/10 to-transparent pointer-events-none" 
                      />
                    )}
                    {isActive && (
                      <motion.div 
                        layoutId="activeLeftBarLeft"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-[#00A3FF] rounded-r-full shadow-[0_0_10px_#00A3FF]" 
                      />
                    )}

                    <div className="relative z-10 flex items-center gap-4 flex-1 pr-4">
                      <div className={`w-10 h-10 shrink-0 flex items-center justify-center ${isActive ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'opacity-80 group-hover:opacity-100 transition-opacity'}`}>
                        <img src={prog.icon as string} alt={prog.title} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-[14px] leading-snug mb-1 transition-colors ${isActive ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                          {prog.title}
                        </h3>
                        <p className="text-[11px] text-white/50 line-clamp-1">
                          {prog.description}
                        </p>
                      </div>
                    </div>

                    <div className={`shrink-0 px-3 py-1 rounded border text-[11px] font-semibold transition-colors ${
                      isActive ? 'bg-[#00A3FF]/10 border-[#00A3FF]/30 text-[#00A3FF] shadow-[0_0_10px_rgba(0,163,255,0.2)]' : 'bg-transparent border-white/20 text-white/50 group-hover:border-white/40 group-hover:text-white/80'
                    }`}>
                      {prog.duration}
                    </div>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel (65%) */}
        <div className="w-full lg:w-[65%] bg-[#050914] border border-white/5 rounded-[24px] shadow-2xl overflow-hidden relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProgram.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8 lg:p-10 relative z-10 h-full flex flex-col"
            >
              
              {/* Render Details OR Application Form */}
              {!isApplying ? (
                <>
                  {/* Header inside Right Panel */}
                  <div className="flex flex-col xl:flex-row gap-8 mb-10 items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-[#00A3FF] text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                        <Sparkles className="w-3 h-3" /> Featured Internship
                      </div>
                      <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                        {activeProgram.title}
                      </h2>
                      <p className="text-[15px] text-white/60 leading-relaxed">
                        Learn to build enterprise-grade applications using industry-standard tools. Perfect for students who want to become job-ready professionals.
                      </p>
                    </div>

                    <div className="shrink-0 xl:pr-10">
                      <DeepMindVisual icon={activeProgram.icon as string} />
                    </div>
                  </div>

                  {/* 4 Stats Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {[
                      { l: 'Duration', v: activeProgram.duration, i: Clock },
                      { l: 'Projects', v: '5+ Real-world', i: Folder },
                      { l: 'Live Classes', v: 'Included', i: Users },
                      { l: 'Certificate', v: 'Industry Verified', i: Award }
                    ].map(stat => (
                      <div key={stat.l} className="bg-[#0A0F1C] border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center group hover:bg-[#00A3FF]/5 hover:border-[#00A3FF]/20 transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,163,255,0.05)]">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-transparent border border-[#00A3FF]/30 text-[#00A3FF] group-hover:shadow-[0_0_15px_rgba(0,163,255,0.4)] transition-shadow">
                          <stat.i className="w-5 h-5" />
                        </div>
                        <div className="text-[11px] text-white/50 uppercase font-bold tracking-wider mb-1">{stat.l}</div>
                        <div className="text-[13px] font-bold text-white">{stat.v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div className="mb-10">
                    <h3 className="text-lg font-bold text-white mb-4">Skills You'll Master</h3>
                    <div className="flex flex-wrap gap-2.5">
                      {activeProgram.skills.map(skill => (
                        <div key={skill} className="px-4 py-2 bg-transparent border border-white/20 rounded-md text-[13px] font-semibold text-white/80 hover:bg-[#00A3FF]/10 hover:border-[#00A3FF]/50 hover:text-[#00A3FF] transition-all cursor-default">
                          {skill}
                        </div>
                      ))}
                      <div className="px-4 py-2 bg-transparent border border-white/20 rounded-md text-[13px] font-semibold text-white/80 hover:bg-[#00A3FF]/10 hover:border-[#00A3FF]/50 hover:text-[#00A3FF] transition-all cursor-default">Git</div>
                      <div className="px-4 py-2 bg-transparent border border-white/20 rounded-md text-[13px] font-semibold text-white/80 hover:bg-[#00A3FF]/10 hover:border-[#00A3FF]/50 hover:text-[#00A3FF] transition-all cursor-default">Deployment</div>
                    </div>
                  </div>

                  {/* Bottom Split (Build / Certificate) */}
                  <div className="flex flex-col md:flex-row gap-8 mb-10">
                    {/* What You'll Build */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-4">What You'll Build</h3>
                      <ul className="space-y-3">
                        {['Student Management System', 'E-Commerce Web Application', 'Blog Platform with Authentication', 'RESTful APIs & Integrations', 'Deploy Your Application'].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-[14px] text-white/70">
                            <div className="w-5 h-5 rounded-full bg-[#0052FF] flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Certificate */}
                    <div className="flex-1">
                      <div className="bg-[#0A0F1C] border border-[#00A3FF]/20 rounded-2xl p-5 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(0,163,255,0.1)] transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00A3FF]/10 blur-[40px] rounded-full" />
                        <h3 className="text-[#00A3FF] font-bold text-[15px] mb-2 relative z-10">Internship Certificate</h3>
                        <p className="text-[12px] text-white/60 mb-4 relative z-10">Earn a verified certificate from Atideto Academy to showcase your skills.</p>
                        <div className="w-full h-[120px] bg-white/5 border border-white/10 rounded-lg flex items-center justify-center relative z-10 overflow-hidden">
                          {/* Fake Certificate Illustration */}
                          <div className="w-[80%] h-[70%] bg-[#05070B] border-4 border-[#00A3FF]/30 flex flex-col items-center justify-center p-2 relative">
                             <div className="w-8 h-8 rounded-full bg-[#F59E0B] absolute bottom-2 right-2 flex items-center justify-center"><Award className="w-4 h-4 text-white" /></div>
                             <div className="w-1/2 h-1 bg-white/20 mb-2 rounded" />
                             <div className="w-3/4 h-2 bg-white/40 mb-2 rounded" />
                             <div className="w-1/3 h-1 bg-white/20 rounded" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 mt-auto pt-4 border-t border-white/5">
                    <button onClick={() => setIsApplying(true)} className="flex items-center gap-2 px-8 py-3.5 bg-[#0052FF] hover:bg-[#0040cc] text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(0,82,255,0.3)]">
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 px-8 py-3.5 bg-transparent border border-white/20 hover:border-white/40 text-white font-semibold rounded-full transition-all">
                      Download Syllabus <Download className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                  <div className="h-full flex flex-col">
                    {/* Multi-step Application Wizard Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                      <div>
                        <h2 className="text-xl font-bold text-white mb-1">
                          {(() => {
                            if (applyStep === 0) return "1. Personal Information";
                            if (applyStep === 1) return "2. Academic Information";
                            if (applyStep === 2) return "3. Internship Schedule";
                            if (applyStep === 3) return "4. Payment Options";
                            return "Application Submitted!";
                          })()}
                        </h2>
                        <p className="text-white/60 text-[13px]">
                          Applying for: <span className="text-[#00A3FF] font-semibold">{activeProgram.title}</span>
                        </p>
                      </div>
                    </div>

                    {applyStep < 10 && (
                      <div className="w-full bg-white/5 rounded-full h-1 mb-8">
                        <div 
                          className="bg-[#0052FF] h-1 rounded-full transition-all duration-300"
                          style={{ width: `${((applyStep + 1) / 10) * 100}%` }}
                        />
                      </div>
                    )}

                    {/* Step 0: Name */}
                    {applyStep === 0 && (
                      <div className="space-y-6 flex-1 animate-fadeIn">
                        <div className="flex flex-col space-y-4">
                          <label className="text-xl font-bold text-white">What is your Full Name?</label>
                          <input 
                            type="text" 
                            placeholder="e.g. John Doe" 
                            value={applyForm.name}
                            onChange={(e) => setApplyForm({...applyForm, name: e.target.value})}
                            className="w-full bg-transparent border-b border-white/15 pb-2 text-[20px] text-white focus:outline-none focus:border-[#0052FF] transition-all focus:placeholder-transparent"
                            autoFocus
                          />
                        </div>
                        <div className="flex justify-end pt-6 border-t border-white/5">
                          <button 
                            type="button"
                            disabled={!applyForm.name}
                            onClick={() => setApplyStep(1)}
                            className="px-8 py-2.5 rounded-full bg-[#0052FF] text-white font-bold text-[14px] hover:bg-[#0040cc] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                          >
                            Next &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 1: Email */}
                    {applyStep === 1 && (
                      <div className="space-y-6 flex-1 animate-fadeIn">
                        <div className="flex flex-col space-y-4">
                          <label className="text-xl font-bold text-white">Your Email Address</label>
                          <input 
                            type="email" 
                            placeholder="john@example.com" 
                            value={applyForm.email}
                            onChange={(e) => setApplyForm({...applyForm, email: e.target.value})}
                            className="w-full bg-transparent border-b border-white/15 pb-2 text-[20px] text-white focus:outline-none focus:border-[#0052FF] transition-all focus:placeholder-transparent"
                            autoFocus
                          />
                        </div>
                        <div className="flex justify-between pt-6 border-t border-white/5">
                          <button 
                            type="button" onClick={() => setApplyStep(0)}
                            className="px-6 py-2.5 rounded-full border border-white/20 text-white font-semibold text-[14px] hover:bg-white/5 transition-all cursor-pointer"
                          >
                            &larr; Back
                          </button>
                          <button 
                            type="button"
                            disabled={!applyForm.email}
                            onClick={() => setApplyStep(2)}
                            className="px-8 py-2.5 rounded-full bg-[#0052FF] text-white font-bold text-[14px] hover:bg-[#0040cc] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                          >
                            Next &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Phone */}
                    {applyStep === 2 && (
                      <div className="space-y-6 flex-1 animate-fadeIn">
                        <div className="flex flex-col space-y-4">
                          <label className="text-xl font-bold text-white">Your Phone Number</label>
                          <div className="flex gap-2 items-end">
                            <select
                              value={applyForm.countryCode}
                              onChange={(e) => setApplyForm({...applyForm, countryCode: e.target.value})}
                              className="bg-transparent border-b border-white/15 pb-2 text-[20px] text-white focus:outline-none focus:border-[#0052FF] cursor-pointer"
                            >
                              <option value="+91" className="bg-[#050505] text-white">+91</option>
                              <option value="+1" className="bg-[#050505] text-white">+1</option>
                              <option value="+44" className="bg-[#050505] text-white">+44</option>
                            </select>
                            <input 
                              type="tel" 
                              placeholder="9876543210" 
                              value={applyForm.phone}
                              onChange={(e) => setApplyForm({...applyForm, phone: e.target.value})}
                              className="flex-1 bg-transparent border-b border-white/15 pb-2 text-[20px] text-white focus:outline-none focus:border-[#0052FF] transition-all focus:placeholder-transparent"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="flex justify-between pt-6 border-t border-white/5">
                          <button 
                            type="button" onClick={() => setApplyStep(1)}
                            className="px-6 py-2.5 rounded-full border border-white/20 text-white font-semibold text-[14px] hover:bg-white/5 transition-all cursor-pointer"
                          >
                            &larr; Back
                          </button>
                          <button 
                            type="button"
                            disabled={!applyForm.phone}
                            onClick={() => setApplyStep(3)}
                            className="px-8 py-2.5 rounded-full bg-[#0052FF] text-white font-bold text-[14px] hover:bg-[#0040cc] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                          >
                            Next &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Resume */}
                    {applyStep === 3 && (
                      <div className="space-y-6 flex-1 animate-fadeIn">
                        <div className="flex flex-col space-y-4">
                          <label className="text-xl font-bold text-white">Upload Resume <span className="text-sm font-normal text-white/50 ml-2">(Optional)</span></label>
                          <div className="border border-dashed border-white/15 hover:border-[#0052FF]/60 hover:bg-white/[0.01] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative group">
                            <input 
                              type="file" 
                              accept=".pdf,.docx" 
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setApplyForm({...applyForm, resumeName: file.name});
                                }
                              }}
                            />
                            <Download className="w-8 h-8 text-white/40 mb-3 group-hover:text-[#0052FF]/80 transition-colors" />
                            <p className="text-[15px] text-white/80 font-medium text-center">
                              {applyForm.resumeName || "Drag & Drop resume, or click to browse"}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between pt-6 border-t border-white/5">
                          <button 
                            type="button" onClick={() => setApplyStep(2)}
                            className="px-6 py-2.5 rounded-full border border-white/20 text-white font-semibold text-[14px] hover:bg-white/5 transition-all cursor-pointer"
                          >
                            &larr; Back
                          </button>
                          <button 
                            type="button"
                            onClick={() => setApplyStep(4)}
                            className="px-8 py-2.5 rounded-full bg-[#0052FF] text-white font-bold text-[14px] hover:bg-[#0040cc] transition-all cursor-pointer"
                          >
                            Next &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 4: College */}
                    {applyStep === 4 && (
                      <div className="space-y-6 flex-1 animate-fadeIn">
                        <div className="flex flex-col space-y-4">
                          <label className="text-xl font-bold text-white">College / University Name</label>
                          <input 
                            list="colleges"
                            type="text" 
                            placeholder="Type or select from dropdown" 
                            value={applyForm.college}
                            onChange={(e) => setApplyForm({...applyForm, college: e.target.value})}
                            className="w-full bg-transparent border-b border-white/15 pb-2 text-[20px] text-white focus:outline-none focus:border-[#0052FF] transition-all focus:placeholder-transparent"
                            autoFocus
                          />
                          <datalist id="colleges">
                            <option value="IIT Madras" />
                            <option value="IIT Bombay" />
                            <option value="NIT Trichy" />
                            <option value="Anna University" />
                            <option value="SRM University" />
                            <option value="VIT Vellore" />
                            <option value="Other" />
                          </datalist>
                        </div>
                        <div className="flex justify-between pt-6 border-t border-white/5">
                          <button 
                            type="button" onClick={() => setApplyStep(3)}
                            className="px-6 py-2.5 rounded-full border border-white/20 text-white font-semibold text-[14px] hover:bg-white/5 transition-all cursor-pointer"
                          >
                            &larr; Back
                          </button>
                          <button 
                            type="button"
                            disabled={!applyForm.college}
                            onClick={() => setApplyStep(5)}
                            className="px-8 py-2.5 rounded-full bg-[#0052FF] text-white font-bold text-[14px] hover:bg-[#0040cc] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                          >
                            Next &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 5: Degree */}
                    {applyStep === 5 && (
                      <div className="space-y-6 flex-1 animate-fadeIn">
                        <div className="flex flex-col space-y-4">
                          <label className="text-xl font-bold text-white">Degree</label>
                          <select
                            value={applyForm.degree}
                            onChange={(e) => setApplyForm({...applyForm, degree: e.target.value})}
                            className="w-full bg-[#050505] border-b border-white/15 pb-2 text-[20px] text-white focus:outline-none focus:border-[#0052FF] cursor-pointer appearance-none"
                          >
                            <option value="" className="bg-[#050505] text-white/50" disabled>Select your degree</option>
                            <option value="B.Tech" className="bg-[#050505] text-white">B.Tech</option>
                            <option value="B.E" className="bg-[#050505] text-white">B.E</option>
                            <option value="B.Sc" className="bg-[#050505] text-white">B.Sc</option>
                            <option value="BCA" className="bg-[#050505] text-white">BCA</option>
                            <option value="M.Tech" className="bg-[#050505] text-white">M.Tech</option>
                            <option value="MCA" className="bg-[#050505] text-white">MCA</option>
                            <option value="Other" className="bg-[#050505] text-white">Other</option>
                          </select>
                        </div>
                        <div className="flex justify-between pt-6 border-t border-white/5">
                          <button 
                            type="button" onClick={() => setApplyStep(4)}
                            className="px-6 py-2.5 rounded-full border border-white/20 text-white font-semibold text-[14px] hover:bg-white/5 transition-all cursor-pointer"
                          >
                            &larr; Back
                          </button>
                          <button 
                            type="button"
                            disabled={!applyForm.degree}
                            onClick={() => setApplyStep(6)}
                            className="px-8 py-2.5 rounded-full bg-[#0052FF] text-white font-bold text-[14px] hover:bg-[#0040cc] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                          >
                            Next &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 6: Stream */}
                    {applyStep === 6 && (
                      <div className="space-y-6 flex-1 animate-fadeIn">
                        <div className="flex flex-col space-y-4">
                          <label className="text-xl font-bold text-white">Stream / Specialization</label>
                          <select
                            value={applyForm.stream}
                            onChange={(e) => setApplyForm({...applyForm, stream: e.target.value})}
                            className="w-full bg-[#050505] border-b border-white/15 pb-2 text-[20px] text-white focus:outline-none focus:border-[#0052FF] cursor-pointer appearance-none"
                          >
                            <option value="" className="bg-[#050505] text-white/50" disabled>Select your stream</option>
                            <option value="Computer Science" className="bg-[#050505] text-white">Computer Science</option>
                            <option value="Information Technology" className="bg-[#050505] text-white">Information Technology</option>
                            <option value="Electronics and Communication" className="bg-[#050505] text-white">Electronics and Communication</option>
                            <option value="Mechanical Engineering" className="bg-[#050505] text-white">Mechanical Engineering</option>
                            <option value="Civil Engineering" className="bg-[#050505] text-white">Civil Engineering</option>
                            <option value="Other" className="bg-[#050505] text-white">Other</option>
                          </select>
                        </div>
                        <div className="flex justify-between pt-6 border-t border-white/5">
                          <button 
                            type="button" onClick={() => setApplyStep(5)}
                            className="px-6 py-2.5 rounded-full border border-white/20 text-white font-semibold text-[14px] hover:bg-white/5 transition-all cursor-pointer"
                          >
                            &larr; Back
                          </button>
                          <button 
                            type="button"
                            disabled={!applyForm.stream}
                            onClick={() => setApplyStep(7)}
                            className="px-8 py-2.5 rounded-full bg-[#0052FF] text-white font-bold text-[14px] hover:bg-[#0040cc] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                          >
                            Next &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 7: Year of Graduation */}
                    {applyStep === 7 && (
                      <div className="space-y-6 flex-1 animate-fadeIn">
                        <div className="flex flex-col space-y-4">
                          <label className="text-xl font-bold text-white">Year of Graduation</label>
                          <select
                            value={applyForm.graduationYear}
                            onChange={(e) => setApplyForm({...applyForm, graduationYear: e.target.value})}
                            className="w-full bg-[#050505] border-b border-white/15 pb-2 text-[20px] text-white focus:outline-none focus:border-[#0052FF] cursor-pointer appearance-none"
                          >
                            <option value="" className="bg-[#050505] text-white/50" disabled>Select year</option>
                            <option value="2024" className="bg-[#050505] text-white">2024</option>
                            <option value="2025" className="bg-[#050505] text-white">2025</option>
                            <option value="2026" className="bg-[#050505] text-white">2026</option>
                            <option value="2027" className="bg-[#050505] text-white">2027</option>
                            <option value="2028" className="bg-[#050505] text-white">2028</option>
                          </select>
                        </div>
                        <div className="flex justify-between pt-6 border-t border-white/5">
                          <button 
                            type="button" onClick={() => setApplyStep(6)}
                            className="px-6 py-2.5 rounded-full border border-white/20 text-white font-semibold text-[14px] hover:bg-white/5 transition-all cursor-pointer"
                          >
                            &larr; Back
                          </button>
                          <button 
                            type="button"
                            disabled={!applyForm.graduationYear}
                            onClick={() => setApplyStep(8)}
                            className="px-8 py-2.5 rounded-full bg-[#0052FF] text-white font-bold text-[14px] hover:bg-[#0040cc] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                          >
                            Next &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 8: Internship Schedule (From-To Date) */}
                    {applyStep === 8 && (
                      <div className="space-y-6 flex-1 animate-fadeIn">
                        <div className="bg-[#0A0F1C] border border-[#00A3FF]/20 rounded-2xl p-5 mb-4">
                          <h4 className="text-white font-bold text-[14px] mb-1">Select Dates</h4>
                          <p className="text-white/60 text-[12px] leading-relaxed">
                            Specify the dates you wish to begin and complete your internship.
                          </p>
                        </div>

                        <div className="flex flex-col space-y-4">
                          <div className="flex flex-col space-y-2">
                            <label className="text-sm font-semibold text-white/70">From Date (Start)</label>
                            <div className="relative">
                              <Calendar className="absolute left-0 top-1 w-5 h-5 text-[#0052FF] pointer-events-none" />
                              <input 
                                type="date" 
                                value={applyForm.startDate}
                                onChange={(e) => setApplyForm({...applyForm, startDate: e.target.value})}
                                className="w-full bg-transparent border-b border-white/15 pb-2 pl-8 text-[16px] text-white focus:outline-none focus:border-[#0052FF] cursor-pointer scheme-dark appearance-none"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 mt-4">
                            <label className="text-sm font-semibold text-white/70">To Date (End)</label>
                            <div className="relative">
                              <Calendar className="absolute left-0 top-1 w-5 h-5 text-[#0052FF] pointer-events-none" />
                              <input 
                                type="date" 
                                value={applyForm.endDate}
                                onChange={(e) => setApplyForm({...applyForm, endDate: e.target.value})}
                                className="w-full bg-transparent border-b border-white/15 pb-2 pl-8 text-[16px] text-white focus:outline-none focus:border-[#0052FF] cursor-pointer scheme-dark appearance-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between pt-6 border-t border-white/5">
                          <button 
                            type="button"
                            onClick={() => setApplyStep(7)}
                            className="px-6 py-2.5 rounded-full border border-white/20 text-white font-semibold text-[14px] hover:bg-white/5 transition-all cursor-pointer"
                          >
                            &larr; Back
                          </button>
                          <button 
                            type="button"
                            disabled={!applyForm.startDate || !applyForm.endDate}
                            onClick={() => setApplyStep(9)}
                            className="px-8 py-2.5 rounded-full bg-[#0052FF] text-white font-bold text-[14px] hover:bg-[#0040cc] transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                          >
                            Next Step &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 9: Payment Options */}
                    {applyStep === 9 && (
                      <div className="space-y-6 flex-1 animate-fadeIn">
                        <label className="text-[18px] font-bold text-white text-center block">
                          Choose your payment schedule
                        </label>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: 'Pay Now', title: 'Pay Now', desc: 'Secure your certificate and get early-bird discount.' },
                            { id: 'Pay Later', title: 'Pay Later', desc: 'Pay before your certificate unlocks upon completion.' }
                          ].map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => setApplyForm({...applyForm, paymentOption: option.id})}
                              className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                                applyForm.paymentOption === option.id
                                  ? 'bg-[#0052FF]/10 border-[#0052FF] shadow-[0_0_15px_rgba(0,82,255,0.2)]'
                                  : 'bg-transparent border-white/10 text-white hover:border-white/20'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-[15px]">{option.title}</span>
                                {applyForm.paymentOption === option.id && (
                                  <div className="w-4 h-4 rounded-full bg-[#0052FF] flex items-center justify-center text-white text-[10px]">&bull;</div>
                                )}
                              </div>
                              <p className="text-[12px] text-white/50 leading-snug">{option.desc}</p>
                            </button>
                          ))}
                        </div>

                        {applyForm.paymentOption === 'Pay Now' ? (
                          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-4 animate-fadeIn">
                            <div className="flex justify-between items-center pb-2 border-b border-white/5 text-[14px]">
                              <span className="text-white/60">Program Fee</span>
                              <span className="text-white font-bold">₹1,999</span>
                            </div>
                            <div className="space-y-3 pt-1">
                              <label className="text-xs font-semibold text-white/50 block">Payment Method Summary</label>
                              <div className="relative">
                                <input 
                                  type="text" 
                                  placeholder="Card number (Mock details only)" 
                                  className="w-full bg-transparent border-b border-white/15 pb-2 text-[14px] text-white focus:outline-none focus:border-[#0052FF]" 
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-[#0A0F1C] border border-[#00A3FF]/10 rounded-xl p-4 animate-fadeIn">
                            <p className="text-[13px] text-[#00A3FF] leading-relaxed">
                              You've chosen <strong>Pay Later</strong>. You will have full dashboard tracking, syllabus access, and mentor support. Your certificate will remain locked until payment is made at the end of the program.
                            </p>
                          </div>
                        )}

                        <div className="flex justify-between pt-6 border-t border-white/5">
                          <button 
                            type="button"
                            onClick={() => setApplyStep(8)}
                            className="px-6 py-2.5 rounded-full border border-white/20 text-white font-semibold text-[14px] hover:bg-white/5 transition-all cursor-pointer"
                          >
                            &larr; Back
                          </button>
                          <button 
                            type="button"
                            onClick={async () => {
                              try {
                                // Save application to Firebase Firestore
                                await addDoc(collection(db, 'internship_applications'), {
                                  createdAt: serverTimestamp(),
                                  programId: activeProgram.id,
                                  programTitle: activeProgram.title,
                                  name: applyForm.name,
                                  email: applyForm.email,
                                  phone: `${applyForm.countryCode}${applyForm.phone}`,
                                  resumeName: applyForm.resumeName || '',
                                  college: applyForm.college,
                                  degree: applyForm.degree,
                                  stream: applyForm.stream,
                                  graduationYear: applyForm.graduationYear,
                                  startDate: applyForm.startDate,
                                  endDate: applyForm.endDate,
                                  paymentOption: applyForm.paymentOption,
                                  status: 'pending',
                                });
                                console.log('Application saved to Firebase successfully!');
                              } catch (error) {
                                console.error('Error saving application:', error);
                              }

                              // Update local user state for nav profile
                              const mockUser = { name: applyForm.name, email: applyForm.email };
                              localStorage.setItem('currentUser', JSON.stringify(mockUser));
                              window.dispatchEvent(new Event('auth-change'));
                              
                              setApplyStep(10);
                            }}
                            className="px-8 py-2.5 rounded-full bg-gradient-to-r from-[#0052FF] to-[#0040cc] text-white font-bold text-[14px] hover:shadow-[0_0_25px_rgba(0,82,255,0.4)] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,82,255,0.2)]"
                          >
                            Confirm Application &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 10: Success Screen (Certificate status + dashboard links) */}
                    {applyStep === 10 && (
                      <div className="space-y-6 flex-1 text-center animate-fadeIn py-6 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#0052FF] to-[#0040cc] flex items-center justify-center shadow-[0_0_20px_rgba(0,82,255,0.3)] mb-4">
                          <Check className="w-8 h-8 text-white animate-pulse" strokeWidth={3} />
                        </div>
                        
                        <h2 className="text-2xl font-black text-white tracking-tight">Application Successful!</h2>
                        <p className="text-white/60 text-sm max-w-sm leading-relaxed mb-6">
                          Welcome, <strong className="text-white">{applyForm.name}</strong>! Your account has been created. You can track progress directly in your Dashboard.
                        </p>

                        <div className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4 text-left shadow-xl max-w-sm">
                          <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                            <span className="text-white/40 text-xs font-semibold uppercase">Payment Status</span>
                            <span className={`text-xs font-bold ${applyForm.paymentOption === 'Pay Now' ? 'text-green-400' : 'text-amber-400'}`}>
                              {applyForm.paymentOption === 'Pay Now' ? 'PAYMENT COMPLETED' : 'PAYMENT PENDING'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-white/40 text-xs font-semibold uppercase">Certificate Status</span>
                            <span className="text-xs text-white font-semibold flex items-center gap-1.5">
                              <Shield className="w-3.5 h-3.5 text-[#0052FF]" /> Locked
                            </span>
                          </div>
                          <p className="text-[11px] text-white/50 leading-snug pt-2 border-t border-white/5 text-center">
                            {applyForm.paymentOption === 'Pay Now' 
                              ? 'Certificate will automatically unlock upon completing all internship tasks.' 
                              : 'Certificate will unlock upon program task completion and payment settlement.'}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-6 mt-auto">
                          <button 
                            onClick={() => {
                              setIsApplying(false);
                              setApplyStep(0);
                            }}
                            className="px-6 py-2.5 rounded-full border border-white/10 text-white font-bold text-xs hover:bg-white/5 transition-all cursor-pointer"
                          >
                            View Other Internships
                          </button>
                          <Link 
                            to="/dashboard"
                            className="px-8 py-2.5 rounded-full bg-[#0052FF] hover:bg-[#0040cc] text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(0,82,255,0.3)] flex items-center justify-center gap-1.5"
                          >
                            Go to My Dashboard &rarr;
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Full Width Sections (Below Explorer) */}
      
      {/* Why Learn */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Why Learn With Atideto Academy?</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { icon: Users, t: 'Industry Experts', d: 'Learn from professionals working in top companies.' },
            { icon: Code2, t: 'Hands-on Projects', d: 'Build real-world projects for your portfolio.' },
            { icon: Award, t: 'Certificate', d: 'Earn industry-recognized internship certificate.' },
            { icon: Clock, t: 'Flexible Learning', d: 'Live classes + recorded sessions for revision.' }
          ].map(feat => (
            <div key={feat.t} className="flex-1 min-w-[200px] flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center mb-4 group-hover:bg-[#0052FF]/10 group-hover:border-[#0052FF]/30 transition-all group-hover:shadow-[0_0_20px_rgba(0,82,255,0.2)]">
                <feat.icon className="w-8 h-8 text-[#00A3FF]" />
              </div>
              <h4 className="font-bold text-[15px] text-white mb-2">{feat.t}</h4>
              <p className="text-[12px] text-white/50 leading-relaxed max-w-[200px]">{feat.d}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          display: none;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
