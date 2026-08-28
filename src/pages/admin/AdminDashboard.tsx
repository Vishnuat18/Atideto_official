import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileCheck2,
  Award,
  XCircle,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStats } from '@/lib/adminApi';
import { STATUS_ORDER, statusMeta } from '@/lib/statusMeta';

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ total: number; byStatus: Record<string, number> } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStats().then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) {
    return <p className="text-red-600 text-sm">Failed to load statistics: {error}</p>;
  }

  if (!stats) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading statistics...
      </div>
    );
  }

  const statusCounts = STATUS_ORDER.map((status) => ({ status, count: stats.byStatus[status] ?? 0 }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Overview of internship applications</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total Applications</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#2F2FE4]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#2F2FE4]" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Selected</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.byStatus['SELECTED'] ?? 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Completed</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.byStatus['COMPLETED'] ?? 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-violet-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Rejected</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.byStatus['REJECTED'] ?? 0}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">Applications by status</h2>
        <div className="space-y-3">
          {statusCounts.map(({ status, count }) => {
            const meta = statusMeta(status);
            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            return (
              <div key={status} className="flex items-center gap-4">
                <Badge variant="outline" className={`w-44 justify-start ${meta.className}`}>
                  {meta.label}
                </Badge>
                <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[#2F2FE4] transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-10 text-right text-sm font-semibold text-slate-700">{count}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Link
        to="/admin/applications"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2F2FE4] hover:text-[#2828c9]"
      >
        View all applications <ArrowUpRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
