import { TECH_STACK } from '@/constants';

const categories = ['All', 'Frontend', 'Backend', 'AI', 'Cloud', 'Database', 'DevOps', 'Mobile'];

export default function TechStack() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-tag">Technology</div>
          <h2 className="text-3xl lg:text-5xl font-bold text-white" >
            Our Tech Stack
          </h2>
          <p className="text-[#AFAFAF] mt-4 max-w-xl mx-auto">
            Enterprise-grade tools and frameworks powering every project we build.
          </p>
        </div>

        {/* Stack Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {TECH_STACK.map((tech, i) => (
            <div
              key={tech.name}
              className="glass rounded-xl p-4 flex flex-col items-center gap-2 card-hover group"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="w-10 h-10 rounded-lg bg-[#2F2FE4]/10 flex items-center justify-center text-xl group-hover:bg-[#2F2FE4]/20 transition-colors duration-200">
                {getTechIcon(tech.name)}
              </div>
              <span className="text-white text-xs font-medium text-center">{tech.name}</span>
              <span className="text-[#AFAFAF] text-xs">{tech.category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getTechIcon(name: string): string {
  const icons: Record<string, string> = {
    React: '⚛️',
    TypeScript: '📘',
    'Node.js': '🟢',
    Python: '🐍',
    AWS: '☁️',
    Kubernetes: '⎈',
    TensorFlow: '🧠',
    PostgreSQL: '🐘',
    MongoDB: '🍃',
    'Next.js': '▲',
    Flutter: '💙',
    Docker: '🐳',
    GraphQL: '◈',
    Redis: '🔴',
    Figma: '🎨',
    Swift: '🦅'};
  return icons[name] || '🔧';
}
