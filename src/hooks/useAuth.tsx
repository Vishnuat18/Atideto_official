export interface User {
  uid: string;
  name: string;
  email: string | null;
  role: string;
}

// Default mock user object so authentication is disabled everywhere
const activeUser: User = {
  uid: 'demo-user-123',
  name: 'ATIDETO User',
  email: 'hello@atideto.in',
  role: 'admin'
};

export function useAuth() {
  return { user: activeUser, loading: false };
}
