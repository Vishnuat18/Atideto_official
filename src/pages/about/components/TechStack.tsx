import { motion } from 'framer-motion';
import { TECH_STACK } from '@/constants';

export default function TechStack() {
  // Group by category
  const groupedStack = TECH_STACK.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <section className="relative py-12 px-8 lg:px-16 z-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full border border-[#60A5FA]/30 bg-[#60A5FA]/10 text-[#60A5FA] text-xs font-bold tracking-[0.2em] uppercase mb-6"
          >
            Our Arsenal
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-black text-white"
          >
            TECHNOLOGY <span className="text-[#60A5FA]">STACK</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(groupedStack).map(([category, techs], index) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-[rgba(255,255,255,0.02)] border border-white/5 rounded-3xl p-8 backdrop-blur-xl hover:bg-[rgba(255,255,255,0.04)] hover:border-[#3B82F6]/30 transition-all duration-500 group shadow-lg"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-6 h-1.5 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#00C6FF] group-hover:w-10 transition-all duration-500"></span>
                {category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {techs.map((tech) => (
                  <motion.span
                    key={tech}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#AFAFAF] text-sm font-medium hover:bg-[#3B82F6]/10 hover:text-white hover:border-[#3B82F6]/40 transition-colors shadow-sm cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
