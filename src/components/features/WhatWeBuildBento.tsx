import { Bot, Cpu, Cloud, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WhatWeBuildBento() {
  const navigate = useNavigate();

  return (
    <div className="w-full mt-12 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Systems Architecture (Spans 8 columns) */}
        <div 
          onClick={() => navigate('/services')}
          className="col-span-1 md:col-span-8 group cursor-pointer relative overflow-hidden rounded-[24px] p-8 md:p-10 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 hover:border-[#2EA8FF]/30 hover:shadow-[0_0_30px_rgba(46,168,255,0.1)] flex flex-col justify-between"
        >
          <div className="mb-6 md:mb-12">
            <Bot className="w-8 h-8 text-[#2EA8FF] mb-6" />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 font-space">AI Automation & Agents</h3>
            <p className="text-[#A7B3C7] text-base md:text-lg leading-relaxed max-w-xl">
              Intelligent workflows, LLM agents, and automated processes. We integrate state-of-the-art artificial intelligence to scale your business operations securely.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/80">LLM Integration</span>
            <span className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] md:text-xs font-bold tracking-widest uppercase text-white/80">Machine Learning</span>
          </div>
        </div>

        {/* Data Analytics (Spans 4 columns) */}
        <div 
          onClick={() => navigate('/services')}
          className="col-span-1 md:col-span-4 group cursor-pointer relative overflow-hidden rounded-[24px] p-8 md:p-10 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 hover:border-[#2EA8FF]/30 hover:shadow-[0_0_30px_rgba(46,168,255,0.1)]"
        >
          <Cpu className="w-8 h-8 text-[#2EA8FF] mb-6" />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 font-space">Custom Systems</h3>
          <p className="text-[#A7B3C7] text-base leading-relaxed">
            Tailored CRM, enterprise ERP platforms, and complex API integrations engineered for your unique workflow.
          </p>
        </div>

        {/* Cyber Defense (Spans 4 columns) */}
        <div 
          onClick={() => navigate('/services')}
          className="col-span-1 md:col-span-4 group cursor-pointer relative overflow-hidden rounded-[24px] p-8 md:p-10 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 hover:border-[#2EA8FF]/30 hover:shadow-[0_0_30px_rgba(46,168,255,0.1)]"
        >
          <Cloud className="w-8 h-8 text-[#2EA8FF] mb-6" />
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 font-space">Cloud Solutions</h3>
          <p className="text-[#A7B3C7] text-base leading-relaxed">
            Scalable enterprise server hosting, seamless migrations, and automated CI/CD DevOps pipelines.
          </p>
        </div>

        {/* Scale Operations (Spans 8 columns) */}
        <div 
          onClick={() => navigate('/services')}
          className="col-span-1 md:col-span-8 group cursor-pointer relative overflow-hidden rounded-[24px] p-8 md:p-10 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 hover:border-[#2EA8FF]/30 hover:shadow-[0_0_30px_rgba(46,168,255,0.1)] flex flex-col md:flex-row gap-8 justify-between items-center"
        >
          <div className="flex-1">
            <Code className="w-8 h-8 text-[#2EA8FF] mb-6" />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 font-space">Web & Mobile Apps</h3>
            <p className="text-[#A7B3C7] text-base md:text-lg leading-relaxed max-w-lg">
              High-performance custom web applications and native mobile experiences built for modern users. Pixel-perfect, fast, and accessible.
            </p>
          </div>
          
          <div className="w-full md:w-64 h-40 bg-[#0A0A0A] rounded-xl border border-white/10 flex flex-col p-4 shadow-inner relative overflow-hidden">
             <div className="flex gap-2 mb-4">
               <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
               <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
               <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
             </div>
             <div className="w-3/4 h-2 bg-white/10 rounded-full mb-3"></div>
             <div className="w-1/2 h-2 bg-white/5 rounded-full mb-3"></div>
             <div className="w-full h-2 bg-[#2EA8FF]/20 rounded-full mb-3"></div>
             <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#2EA8FF]/10 rounded-full blur-2xl group-hover:bg-[#2EA8FF]/20 transition-all"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
