import { useNavigate } from 'react-router-dom';
import {
  Users,
  Receipt,
  Layers,
  ClipboardList,
  GraduationCap,
  Building2,
  Dumbbell,
  BookOpen,
  Bus,
  Truck,
  MonitorPlay,
  UserCheck,
  PieChart,
  ShoppingCart,
  Cpu,
  CalendarClock,
  Code,
  Globe,
  Smartphone,
  Palette,
  Zap,
  Bot,
  Cloud,
  Rocket,
  Database,
  ArrowRight
} from 'lucide-react';

const ROW1_SOLUTIONS = [
  { title: 'Custom Software', icon: Code },
  { title: 'Web Development', icon: Globe },
  { title: 'Mobile Apps', icon: Smartphone },
  { title: 'UI / UX Design', icon: Palette },
  { title: 'AI Automation', icon: Zap },
  { title: 'CRM', icon: Users },
  { title: 'Billing System', icon: Receipt },
  { title: 'ERP', icon: Layers },
  { title: 'Inventory Management', icon: ClipboardList },
  { title: 'School ERP', icon: GraduationCap },
  { title: 'Hotel Management', icon: Building2 },
  { title: 'Gym Management', icon: Dumbbell },
  { title: 'Library Management', icon: BookOpen }
];

const ROW2_SOLUTIONS = [
  { title: 'AI Agents', icon: Bot },
  { title: 'API Management', icon: Cpu },
  { title: 'Database Solutions', icon: Database },
  { title: 'DevOps & Deployment', icon: Rocket },
  { title: 'Cloud Solutions', icon: Cloud },
  { title: 'SCM – Supply Chain', icon: Truck },
  { title: 'Transport Management', icon: Bus },
  { title: 'LMS – Learning Management', icon: MonitorPlay },
  { title: 'SMS – Student Management', icon: UserCheck },
  { title: 'Expense Management', icon: PieChart },
  { title: 'E-Commerce Management', icon: ShoppingCart },
  { title: 'Appointment Booking', icon: CalendarClock }
];

export default function SolutionsRunningCarousel() {
  const navigate = useNavigate();

  return (
    <div className="w-full relative z-10 my-12 border-y border-white/10 bg-[#080D1A]/85 backdrop-blur-md overflow-hidden rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.4)]">
      {/* Left & Right Edge Fade Gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-l from-[#050505] via-[#050505]/90 to-transparent z-20 pointer-events-none" />

      {/* Row 1 (Moving Left, continuous contiguous bordered cells) */}
      <div className="flex overflow-hidden select-none">
        <div className="animate-marquee-track-left flex items-center">
          {[...ROW1_SOLUTIONS, ...ROW1_SOLUTIONS, ...ROW1_SOLUTIONS, ...ROW1_SOLUTIONS].map((sol, index) => {
            const Icon = sol.icon;
            return (
              <button
                key={`sol-r1-${sol.title}-${index}`}
                onClick={() => navigate('/services')}
                className="h-full px-6 sm:px-8 py-3.5 sm:py-4 border-r border-white/10 flex items-center gap-3 bg-transparent hover:bg-[#005DFF]/15 transition-colors group cursor-pointer shrink-0 text-left"
              >
                <Icon size={18} className="text-[#2EA8FF] shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-slate-200 group-hover:text-white text-sm font-medium whitespace-nowrap transition-colors">
                  {sol.title}
                </span>
                <ArrowRight
                  size={14}
                  className="text-slate-500 group-hover:text-[#2EA8FF] group-hover:translate-x-1 transition-all ml-1"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 2 (Moving Right, continuous contiguous bordered cells) */}
      <div className="border-t border-white/10 flex overflow-hidden select-none">
        <div className="animate-marquee-track-right flex items-center">
          {[...ROW2_SOLUTIONS, ...ROW2_SOLUTIONS, ...ROW2_SOLUTIONS, ...ROW2_SOLUTIONS].map((sol, index) => {
            const Icon = sol.icon;
            return (
              <button
                key={`sol-r2-${sol.title}-${index}`}
                onClick={() => navigate('/services')}
                className="h-full px-6 sm:px-8 py-3.5 sm:py-4 border-r border-white/10 flex items-center gap-3 bg-transparent hover:bg-[#005DFF]/15 transition-colors group cursor-pointer shrink-0 text-left"
              >
                <Icon size={18} className="text-[#2EA8FF] shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-slate-200 group-hover:text-white text-sm font-medium whitespace-nowrap transition-colors">
                  {sol.title}
                </span>
                <ArrowRight
                  size={14}
                  className="text-slate-500 group-hover:text-[#2EA8FF] group-hover:translate-x-1 transition-all ml-1"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
