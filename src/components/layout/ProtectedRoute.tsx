import React from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Authentication restriction disabled — all routes accessible directly
  return <>{children}</>;
}
