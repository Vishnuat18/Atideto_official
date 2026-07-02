import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div
      style={{ background: '#050505', minHeight: '100vh' }}
      className="flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(47,47,228,0.08) 0%, transparent 60%)' }}
      />

      <div className="relative text-center px-6">
        <div
          className="text-[180px] font-black leading-none mb-0 gradient-text"
          style={{ opacity: 0.15 }}
        >
          404
        </div>
        <div className="text-6xl mb-6 -mt-16">🔭</div>
        <h1 className="text-white text-3xl font-bold mb-4" >
          Page Not Found
        </h1>
        <p className="text-[#AFAFAF] mb-10 max-w-sm mx-auto">
          The page at <code className="text-[#2F2FE4]">{location.pathname}</code> doesn't exist. Maybe it moved or was deleted.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/" className="btn-primary px-8 py-3">
            ← Back to Home
          </Link>
          <Link to="/client-connect" className="btn-outline px-8 py-3">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
