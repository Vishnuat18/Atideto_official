let timer: number | undefined;

const DARK_META = '#0B1220';
const LIGHT_META = '#F8FAFC';

/**
 * Animates color surfaces smoothly when the theme changes so the switch
 * never looks like a hard white/dark flash. Adds a temporary class to
 * <html> that enables CSS transitions on background/border/color, then
 * removes it after the transition window.
 */
export function applyThemeTransition() {
  const root = document.documentElement;
  root.classList.add('theme-transitioning');
  if (timer) window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    root.classList.remove('theme-transitioning');
  }, 420);
}

/**
 * Keeps the browser chrome (mobile URL bar, tab strip) in sync with the
 * theme immediately, instead of one paint late.
 */
export function syncThemeMeta(dark: boolean) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? DARK_META : LIGHT_META);
}
