// Canonical student name formatter.
// - Uppercases every token
// - Moves single-letter initials (with or without a dot) to the end
// - Preserves the order of names and initials
//
// Examples:
//   "K madhan"      -> "MADHAN K"
//   "rithika patil" -> "RITHIKA PATIL"
//   "K. R. Madhan"  -> "MADHAN K R"

export function formatStudentName(raw?: string): string {
  const tokens = String(raw ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!tokens.length) return '';

  const names: string[] = [];
  const initials: string[] = [];

  for (const token of tokens) {
    const cleaned = token.replace(/\./g, '').trim();
    if (!cleaned) continue;

    if (cleaned.length === 1) {
      initials.push(cleaned.toUpperCase());
    } else {
      names.push(cleaned.toUpperCase());
    }
  }

  return [...names, ...initials].join(' ').trim();
}

export function splitName(raw?: string): { first: string; rest: string } {
  const formatted = formatStudentName(raw);
  if (!formatted) return { first: '', rest: '' };
  const [first, ...rest] = formatted.split(' ');
  return { first, rest: rest.join(' ') };
}
