import { useLocation } from 'react-router-dom';
import LadoBot from '@/components/lado/LadoBot';

export default function FloatingLetsTalk() {
  const location = useLocation();

  if (location.pathname.startsWith('/join')) return null;

  return <LadoBot />;
}

export { LadoBot };
