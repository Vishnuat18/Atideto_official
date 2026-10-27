import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface User {
  uid: string;
  name: string;
  email: string | null;
  role: string;
  provider?: string;
}

const ADMIN_EMAILS = [
  'admin@atideto.in',
  'sam@atideto.in',
  'neevas@atideto.in',
  'vishnu@atideto.in',
  'kiran@atideto.in',
  'yogesh@atideto.in',
  'sanjay@atideto.in',
  'sachin@atideto.in',
  'vishnurajan24766@gmail.com'
];

export function checkIsAdmin(email?: string | null, explicitRole?: string | null): boolean {
  if (explicitRole === 'admin') return true;
  const clean = (email || '').toLowerCase().trim();
  if (!clean) return false;
  if (clean.endsWith('@atideto.in')) return true;
  if (ADMIN_EMAILS.includes(clean)) return true;
  return false;
}

function normalizeUserRecord(raw: any): User | null {
  if (!raw) return null;
  const email = (raw.email || '').toLowerCase().trim();
  const mode = typeof window !== 'undefined' ? localStorage.getItem('atideto_dashboard_mode') : null;
  const isAdmin = checkIsAdmin(email, raw.role) || mode === 'admin';
  return {
    uid: raw.uid || (isAdmin ? 'usr-admin-01' : 'usr-student'),
    name: raw.name || (email ? email.split('@')[0] : 'User'),
    email: raw.email || null,
    role: isAdmin ? 'admin' : (raw.role || 'student'),
    provider: raw.provider || 'local'
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('atideto_sql_user');
      if (saved) return normalizeUserRecord(JSON.parse(saved));
    } catch (e) {}
    return null;
  });
  // If user is already cached in localStorage, do not block page render with full screen loader
  const [loading, setLoading] = useState(() => {
    try {
      return !localStorage.getItem('atideto_sql_user');
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    // Safety fallback: Never keep loading stuck permanently
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 800);

    // Listen for custom storage events (e.g. SQL login from login page)
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('atideto_sql_user');
        if (saved) {
          setUser(normalizeUserRecord(JSON.parse(saved)));
          setLoading(false);
          return;
        }
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('atideto_auth_change', handleStorageChange);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      clearTimeout(safetyTimer);
      if (firebaseUser) {
        // If an explicit SQL admin session is already active in localStorage, preserve it
        try {
          const savedStr = localStorage.getItem('atideto_sql_user');
          if (savedStr) {
            const savedParsed = JSON.parse(savedStr);
            if (savedParsed && checkIsAdmin(savedParsed.email, savedParsed.role) && !checkIsAdmin(firebaseUser.email)) {
              setUser(normalizeUserRecord(savedParsed));
              setLoading(false);
              return;
            }
          }
        } catch {}

        let role = 'student';
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            role = docSnap.data().role || 'student';
          }
        } catch (e) {
          console.error('Error fetching user role:', e);
        }
        
        const userEmail = (firebaseUser.email || '').toLowerCase().trim();
        if (checkIsAdmin(userEmail, role)) {
          role = 'admin';
        }
        
        const authenticatedUser: User = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'User'),
          email: firebaseUser.email,
          role: role,
          provider: 'google'
        };

        const normalized = normalizeUserRecord(authenticatedUser)!;
        setUser(normalized);
        localStorage.setItem('atideto_sql_user', JSON.stringify(normalized));
        if (normalized.role === 'admin') {
          localStorage.setItem('atideto_dashboard_mode', 'admin');
        }
      } else {
        // If not firebase, check if SQL user is saved
        try {
          const saved = localStorage.getItem('atideto_sql_user');
          if (saved) {
            setUser(normalizeUserRecord(JSON.parse(saved)));
          } else {
            setUser(null);
          }
        } catch (e) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('atideto_auth_change', handleStorageChange);
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    localStorage.removeItem('atideto_sql_user');
    localStorage.removeItem('atideto_dashboard_mode');
    try {
      await firebaseSignOut(auth);
    } catch (e) {}
    setUser(null);
    window.dispatchEvent(new Event('atideto_auth_change'));
  };

  return { user, loading, logout };
}
