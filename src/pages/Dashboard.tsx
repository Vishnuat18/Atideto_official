import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Users, GraduationCap, Video, BookOpen, BarChart3, CheckCircle2, DollarSign, Activity } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="text-[#2EA8FF]">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-[#AFAFAF]">
            {user.role === 'admin' 
              ? 'Here is an overview of your platform today.' 
              : 'Ready to continue your learning journey?'}
          </p>
        </div>

        {/* Dashboard Content Based on Role */}
        {user.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />}
        
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// ADMIN DASHBOARD
// ----------------------------------------------------------------------
function AdminDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeCourses, setActiveCourses] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribeUsers = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const studentUsers = usersData.filter((u: any) => u.role === 'student');
      
      setTotalStudents(studentUsers.length);
      setStudents(studentUsers.slice(0, 5));
    });

    const qCourses = query(collection(db, 'courses'));
    const unsubscribeCourses = onSnapshot(qCourses, (snapshot) => {
      const activeCount = snapshot.docs.filter(doc => doc.data().status === 'active').length;
      setActiveCourses(activeCount);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeCourses();
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users />} label="Total Students" value={totalStudents.toString()} trend="Live updates" />
        <StatCard icon={<GraduationCap />} label="Active Courses" value={activeCourses.toString()} trend="Live updates" />
        <StatCard icon={<DollarSign />} label="Total Revenue" value="$45,290" trend="+8% this month" />
        <StatCard icon={<Activity />} label="Platform Uptime" value="99.9%" trend="All systems normal" />
      </div>

      {/* Recent Activity & Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User Management Table */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Recent Registrations</h3>
            <button className="text-sm text-[#2EA8FF] hover:text-white transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[#AFAFAF] text-sm border-b border-white/10">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Date Joined</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {students.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="py-4 font-medium capitalize">{row.name}</td>
                    <td className="py-4 text-[#AFAFAF]">{row.email}</td>
                    <td className="py-4 text-[#AFAFAF]">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown'}
                    </td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs bg-[#00D26A]/20 text-[#00D26A]">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#AFAFAF]">
                      No student registrations yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
          <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
          <button className="w-full py-3 bg-[#2F2FE4] hover:bg-[#3A3DFF] text-white rounded-lg font-medium transition-colors">Add New Course</button>
          <button className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg font-medium transition-colors">Manage Internships</button>
          <button className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg font-medium transition-colors">Generate Reports</button>
        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// STUDENT DASHBOARD (LMS)
// ----------------------------------------------------------------------
function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [lectures, setLectures] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    
    // Fetch user's enrollments
    const qEnrollments = query(collection(db, 'enrollments'));
    const unsubscribeEnrollments = onSnapshot(qEnrollments, (snapshot) => {
      const userEnrollments = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((e: any) => e.userId === user.uid);
      setEnrollments(userEnrollments);
    });

    // Fetch upcoming assignments
    const qAssignments = query(collection(db, 'assignments'));
    const unsubscribeAssignments = onSnapshot(qAssignments, (snapshot) => {
      setAssignments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch lectures
    const qLectures = query(collection(db, 'lectures'));
    const unsubscribeLectures = onSnapshot(qLectures, (snapshot) => {
      setLectures(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch user's internship applications
    const qApplications = query(collection(db, 'internship_applications'));
    const unsubscribeApplications = onSnapshot(qApplications, (snapshot) => {
      const userApplications = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((a: any) => a.userId === user.uid);
      setApplications(userApplications);
    });

    return () => {
      unsubscribeEnrollments();
      unsubscribeAssignments();
      unsubscribeLectures();
      unsubscribeApplications();
    };
  }, [user]);

  const activeCourse = enrollments[0]; // Just showing the first one as "Current Progress"
  const completedCount = enrollments.filter(e => e.progress === 100).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Current Progress Banner */}
      <div className="bg-gradient-to-r from-[#2F2FE4]/20 to-[#00C6FF]/20 border border-[#2EA8FF]/30 rounded-3xl p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {activeCourse ? `Continue: ${activeCourse.courseName || 'Your Course'}` : 'Ready to start learning?'}
          </h2>
          <p className="text-[#AFAFAF] mb-4">
            {activeCourse ? `Module: ${activeCourse.currentModule || 'Getting Started'}` : 'Enroll in a course to begin.'}
          </p>
          <div className="flex items-center gap-4">
            <div className="w-full max-w-[200px] h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#2EA8FF] rounded-full" style={{ width: `${activeCourse?.progress || 0}%` }} />
            </div>
            <span className="text-sm font-medium">{activeCourse?.progress || 0}% Complete</span>
          </div>
        </div>
        <button className="whitespace-nowrap px-8 py-4 bg-[#2F2FE4] hover:bg-[#3A3DFF] text-white rounded-full font-bold transition-all shadow-[0_0_20px_rgba(47,47,228,0.3)] hover:scale-105">
          {activeCourse ? 'Resume Lesson' : 'Browse Courses'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Learning Area */}
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-xl font-bold">Upcoming Assignments</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {assignments.slice(0, 4).map((task, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between mb-2">
                  <BookOpen className="text-[#2EA8FF]" size={20} />
                  <span className="text-xs text-[#f59e0b] bg-[#f59e0b]/20 px-2 py-1 rounded-full">{task.dueDate || 'No Date'}</span>
                </div>
                <h4 className="font-bold text-lg mb-1 group-hover:text-[#2EA8FF] transition-colors">{task.title || 'Assignment'}</h4>
                <p className="text-sm text-[#AFAFAF]">{task.courseName || 'Course'}</p>
              </div>
            ))}
            {assignments.length === 0 && (
              <p className="text-[#AFAFAF] text-sm">No upcoming assignments.</p>
            )}
          </div>

          <h3 className="text-xl font-bold pt-4">Recent Video Lectures</h3>
          <div className="space-y-3">
            {lectures.slice(0, 3).map((vid, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${vid.completed ? 'bg-[#00D26A]/20 text-[#00D26A]' : 'bg-[#2EA8FF]/20 text-[#2EA8FF]'}`}>
                  {vid.completed ? <CheckCircle2 size={20} /> : <Video size={20} />}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium">{vid.title || 'Video Lecture'}</h5>
                  <p className="text-xs text-[#AFAFAF]">{vid.duration || '0 mins'}</p>
                </div>
              </div>
            ))}
            {lectures.length === 0 && (
              <p className="text-[#AFAFAF] text-sm">No recent lectures.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">My Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-[#AFAFAF]">Enrolled Courses</span>
                <span className="font-bold text-xl">{enrollments.length}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-[#AFAFAF]">Completed</span>
                <span className="font-bold text-xl text-[#00D26A]">{completedCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#AFAFAF]">Hours Learned</span>
                <span className="font-bold text-xl">
                  {enrollments.reduce((sum, e) => sum + (e.hoursLearned || 0), 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Internships Teaser or Status */}
          <div className="bg-gradient-to-br from-[#2EA8FF]/10 to-transparent border border-[#2EA8FF]/30 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2EA8FF]/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <h3 className="text-xl font-bold mb-4 text-white">My Internships</h3>
            
            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map(app => (
                  <div key={app.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-white text-sm">{app.programTitle}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        app.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        app.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {app.status || 'Pending'}
                      </span>
                    </div>
                    <div className="text-xs text-white/60">
                      Duration: {app.duration === '30' ? '1 Month' : app.duration === '60' ? '2 Months' : app.duration === '90' ? '3 Months' : app.duration === '120' ? '4 Months' : app.duration === '150' ? '5 Months' : app.duration === '180' ? '6 Months' : app.duration + ' Days'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <p className="text-[#AFAFAF] text-sm mb-4 relative z-10">
                  Apply for exclusive internship opportunities at ATIDETO. Applications opening shortly!
                </p>
                <button 
                  onClick={() => navigate('/academy')}
                  className="w-full py-2.5 bg-white/5 border border-[#2EA8FF]/50 hover:bg-[#2EA8FF]/20 text-[#2EA8FF] rounded-lg font-medium transition-colors relative z-10 cursor-pointer"
                >
                  Apply Now
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// SHARED COMPONENTS
// ----------------------------------------------------------------------
function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-xl text-[#2EA8FF]">
          {icon}
        </div>
        <span className="text-xs text-[#AFAFAF]">{trend}</span>
      </div>
      <div>
        <p className="text-3xl font-black mb-1">{value}</p>
        <p className="text-sm text-[#AFAFAF]">{label}</p>
      </div>
    </div>
  );
}
