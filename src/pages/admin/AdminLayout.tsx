import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Award,
  LogOut,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchMe, logout, type AdminUser } from '@/lib/adminApi';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/applications', label: 'Applications', icon: FileText, end: false },
  { to: '/admin/certificates', label: 'Certificates', icon: Award, end: false },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetchMe()
      .then(setAdmin)
      .catch(() => navigate('/admin/login', { replace: true }));
  }, [navigate, location.pathname]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      // ignore — clear local state regardless
    } finally {
      setLoggingOut(false);
      navigate('/admin/login', { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-60 shrink-0 bg-slate-900 text-slate-100 flex flex-col">
          <div className="px-5 py-5 border-b border-slate-800">
            <p className="font-bold text-white">ATIDETO</p>
            <p className="text-[11px] text-slate-400 tracking-wide uppercase mt-0.5">Admin Console</p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#2F2FE4] text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="px-4 py-4 border-t border-slate-800 space-y-3">
            {admin && (
              <div className="text-xs text-slate-400">
                <p className="font-semibold text-slate-200 truncate">{admin.name}</p>
                <p className="truncate">{admin.email}</p>
                <span className="inline-block mt-1 rounded bg-slate-700 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-200">
                  {admin.role}
                </span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full border-slate-700 text-slate-200 hover:bg-slate-800"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogOut className="w-4 h-4 mr-2" />}
              Logout
            </Button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-x-hidden">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
