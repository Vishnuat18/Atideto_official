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

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('atideto_sql_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for custom storage events (e.g. SQL login from login page)
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('atideto_sql_user');
        if (saved) {
          setUser(JSON.parse(saved));
          setLoading(false);
          return;
        }
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('atideto_auth_change', handleStorageChange);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
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
        
        const ADMIN_EMAILS = [
          'admin@atideto.in',
          'sam@atideto.in',
          'neevas@atideto.in',
          'vishnu@atideto.in',
          'kiran@atideto.in',
          'yogesh@atideto.in',
          'sanjay@atideto.in',
          'sachin@atideto.in'
        ];
        const userEmail = (firebaseUser.email || '').toLowerCase().trim();
        if (ADMIN_EMAILS.includes(userEmail)) {
          role = 'admin';
        }
        
        const authenticatedUser = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'User'),
          email: firebaseUser.email,
          role: role,
          provider: 'google'
        };

        setUser(authenticatedUser);
        localStorage.setItem('atideto_sql_user', JSON.stringify(authenticatedUser));
      } else {
        // If not firebase, check if SQL user is saved
        try {
          const saved = localStorage.getItem('atideto_sql_user');
          if (saved) {
            setUser(JSON.parse(saved));
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
