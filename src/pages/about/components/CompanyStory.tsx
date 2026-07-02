import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Target, Lightbulb, Shield } from 'lucide-react';
import RibbonBackground from './RibbonBackground';

const STORIES = [
  {
    icon: <Lightbulb className="w-8 h-8 text-[#3B82F6]" />,
    title: 'Our Mission',
    desc: 'To deliver premium, scalable, and intelligent software solutions while democratizing quality tech education worldwide.',
  },
  {
    icon: <Shield className="w-8 h-8 text-[#60A5FA]" />,
    title: 'Our Vision',
    desc: 'Engineering the digital future by bridging the gap between cutting-edge technology and human-centric design.',
  },
];

function StoryContent({ story, index }: { story: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="relative flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-[rgba(59,130,246,0.05)] border border-[rgba(59,130,246,0.1)] flex items-center justify-center mb-6">
        {story.icon}
      </div>
      
      <h3 className="text-2xl md:text-3xl font-black text-white tracking-wide mb-4">
        {story.title}
      </h3>
      <p className="text-[#94A3B8] text-base md:text-lg leading-relaxed max-w-[340px]">
        {story.desc}
      </p>
    </motion.div>
  );
}

export default function CompanyStory() {
  return (
    <section className="relative py-12 px-8 lg:px-16 z-10 overflow-hidden">
      <div className="max-w-[800px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STORIES.map((story, i) => (
            <StoryContent key={i} story={story} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
