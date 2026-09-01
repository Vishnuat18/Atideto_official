import { motion } from 'framer-motion';
import { BlurFade } from '@/components/ui/blur-fade';
import { TEAM_MEMBERS } from '@/constants';
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MessageCircle,
  Instagram,
  Facebook,
  Sparkles,
  Shield,
  Crown,
  Layers,
} from 'lucide-react';

const roleIcons: Record<string, typeof Crown> = {
  '1': Crown, // Vishnu (CEO & Founder)
<<<<<<< HEAD
  '2': Sparkles, // Neevas (Founder)
  '3': Layers, // Kiran (CPO)
=======
  '2': Layers, // Kiran (CPO)
>>>>>>> 9afa06a (2.3)
};

export default function MeetTheTeam() {
  return (
    <section className="relative py-20 md:py-28 px-6 lg:px-16 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[var(--about-primary)]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1240px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <BlurFade delay={0} inView>
            <span className="about-eyebrow">
              <Shield className="inline-block w-3.5 h-3.5 mr-1 mb-0.5" /> Executive Leadership
            </span>
          </BlurFade>

          <BlurFade delay={0.1} inView>
            <h2 className="about-section-title text-3xl md:text-5xl font-black tracking-tight mb-4 text-[var(--about-text)]">
              The Minds Behind <span className="about-heading-grad">ATIDETO</span>
            </h2>
          </BlurFade>

          <BlurFade delay={0.15} inView>
            <p className="text-[var(--about-muted)] text-sm md:text-base leading-relaxed">
              Led by visionary engineers and product strategists committed to transforming business operations through scalable software and cutting-edge artificial intelligence.
            </p>
          </BlurFade>
        </div>

        {/* 3 Executive Leaders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {TEAM_MEMBERS.map((member, index) => {
            const isCEO = member.id === '1';
            const RoleIcon = roleIcons[member.id] || Sparkles;

            return (
              <BlurFade key={member.id} delay={0.1 + index * 0.08} inView>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className={`relative flex flex-col h-full rounded-3xl p-6 md:p-8 backdrop-blur-xl transition-all ${
                    isCEO
                      ? 'bg-gradient-to-b from-[var(--about-surface)] to-[var(--about-primary-soft)] border-2 border-[var(--about-primary)]/60 shadow-[0_20px_50px_-15px_rgba(47,47,228,0.25)] dark:shadow-[0_20px_50px_-15px_rgba(46,168,255,0.25)]'
                      : 'about-card border border-[var(--about-border)] bg-[var(--about-surface)] shadow-lg'
                  }`}
                >
                  {/* CEO Highlight Ribbon */}
                  {isCEO && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-1.5">
                      <Crown size={12} className="text-yellow-300 fill-yellow-300" />
                      Executive Lead
                    </div>
                  )}

                  {/* Leader Image Frame */}
                  <div className="relative w-full aspect-square max-w-[240px] mx-auto rounded-2xl overflow-hidden mb-6 bg-gradient-to-b from-slate-200/50 to-slate-300/30 dark:from-slate-800/60 dark:to-slate-900/60 border border-[var(--about-border)] group">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Leader Details */}
                  <div className="flex flex-col items-center text-center flex-grow">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2.5 bg-[var(--about-primary-soft)] text-[var(--about-primary)] border border-[var(--about-primary)]/20">
                      <RoleIcon size={12} />
                      {member.role}
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-[var(--about-text)] tracking-tight mb-2">
                      {member.name}
                    </h3>

                    <p className="text-xs md:text-sm text-[var(--about-muted)] leading-relaxed mb-6 flex-grow">
                      {member.bio}
                    </p>

                    {/* Social Links Bar */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-[var(--about-border)] w-full">
                      {member.social.linkedin && (
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} LinkedIn`}
                          className="w-9 h-9 rounded-full border border-[var(--about-border)] bg-[var(--about-surface)] flex items-center justify-center text-[var(--about-muted)] hover:text-[var(--about-primary)] hover:border-[var(--about-primary)]/50 hover:bg-[var(--about-primary-soft)] transition-all"
                        >
                          <Linkedin size={15} />
                        </a>
                      )}

                      {member.social.github && (
                        <a
                          href={member.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} GitHub`}
                          className="w-9 h-9 rounded-full border border-[var(--about-border)] bg-[var(--about-surface)] flex items-center justify-center text-[var(--about-muted)] hover:text-[var(--about-primary)] hover:border-[var(--about-primary)]/50 hover:bg-[var(--about-primary-soft)] transition-all"
                        >
                          <Github size={15} />
                        </a>
                      )}

                      {member.social.email && (
                        <a
                          href={member.social.email}
                          aria-label={`${member.name} Email`}
                          className="w-9 h-9 rounded-full border border-[var(--about-border)] bg-[var(--about-surface)] flex items-center justify-center text-[var(--about-muted)] hover:text-[var(--about-primary)] hover:border-[var(--about-primary)]/50 hover:bg-[var(--about-primary-soft)] transition-all"
                        >
                          <Mail size={15} />
                        </a>
                      )}

                      {member.social.phone && (
                        <a
                          href={member.social.phone}
                          aria-label={`${member.name} Phone`}
                          className="w-9 h-9 rounded-full border border-[var(--about-border)] bg-[var(--about-surface)] flex items-center justify-center text-[var(--about-muted)] hover:text-[var(--about-primary)] hover:border-[var(--about-primary)]/50 hover:bg-[var(--about-primary-soft)] transition-all"
                        >
                          <Phone size={15} />
                        </a>
                      )}

                      {member.social.whatsapp && (
                        <a
                          href={member.social.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} WhatsApp`}
                          className="w-9 h-9 rounded-full border border-[var(--about-border)] bg-[var(--about-surface)] flex items-center justify-center text-[var(--about-muted)] hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
                        >
                          <MessageCircle size={15} />
                        </a>
                      )}

                      {member.social.instagram && (
                        <a
                          href={member.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} Instagram`}
                          className="w-9 h-9 rounded-full border border-[var(--about-border)] bg-[var(--about-surface)] flex items-center justify-center text-[var(--about-muted)] hover:text-pink-500 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all"
                        >
                          <Instagram size={15} />
                        </a>
                      )}

                      {member.social.facebook && (
                        <a
                          href={member.social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} Facebook`}
                          className="w-9 h-9 rounded-full border border-[var(--about-border)] bg-[var(--about-surface)] flex items-center justify-center text-[var(--about-muted)] hover:text-blue-600 hover:border-blue-600/50 hover:bg-blue-600/10 transition-all"
                        >
                          <Facebook size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
