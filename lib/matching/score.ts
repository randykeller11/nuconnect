export function jaccard(a?: string[], b?: string[]) {
  if (!a?.length || !b?.length) return 0;
  const A = new Set(a.map((x) => x.toLowerCase()));
  const B = new Set(b.map((x) => x.toLowerCase()));
  let inter = 0;
  A.forEach((x) => { if (B.has(x)) inter++; });
  const union = A.size + B.size - inter;
  return union ? inter / union : 0;
}

export function scoreMatch(me: any, other: any) {
  let s = 0;
  s += jaccard(me?.interests, other?.interests) * 40;
  s += jaccard(me?.skills, other?.skills) * 30;
  s += jaccard(me?.industries, other?.industries) * 20;
  const gA = (me?.networking_goals || []).join(' ').toLowerCase();
  const gB = (other?.networking_goals || []).join(' ').toLowerCase();
  if (gA.includes('mentorship') && gB.includes('mentorship')) s += 5; // symmetric for MVP
  if (gA.includes('cofounder') && gB.includes('cofounder')) s += 5;
  return Math.max(0, Math.min(100, Math.round(s)));
}

export function whySimple(me: any, other: any, score: number) {
  return score >= 80
    ? 'Strong overlap and complementary goals.'
    : 'Shared interests and potential collaboration fit.';
}
export function jaccard(a?: string[], b?: string[]) {
  if (!a?.length || !b?.length) return 0;
  const A = new Set(a.map((x) => x.toLowerCase()));
  const B = new Set(b.map((x) => x.toLowerCase()));
  let inter = 0;
  A.forEach((x) => { if (B.has(x)) inter++; });
  const union = A.size + B.size - inter;
  return union ? inter / union : 0;
}

export function scoreMatch(me: any, other: any) {
  let s = 0;
  s += jaccard(me?.interests, other?.interests) * 40;
  s += jaccard(me?.skills, other?.skills) * 30;
  s += jaccard(me?.industries, other?.industries) * 20;
  const gA = (me?.networking_goals || []).join(' ').toLowerCase();
  const gB = (other?.networking_goals || []).join(' ').toLowerCase();
  if (gA.includes('mentorship') && gB.includes('mentorship')) s += 5; // symmetric for MVP
  if (gA.includes('cofounder') && gB.includes('cofounder')) s += 5;
  return Math.max(0, Math.min(100, Math.round(s)));
}

export function whySimple(me: any, other: any, score: number) {
  return score >= 80
    ? 'Strong overlap and complementary goals.'
    : 'Shared interests and potential collaboration fit.';
}
export function jaccard(a?: string[], b?: string[]) {
  if (!a?.length || !b?.length) return 0;
  const A = new Set(a.map((x) => x.toLowerCase()));
  const B = new Set(b.map((x) => x.toLowerCase()));
  let inter = 0;
  A.forEach((x) => { if (B.has(x)) inter++; });
  const union = A.size + B.size - inter;
  return union ? inter / union : 0;
}

export function scoreMatch(me: any, other: any) {
  let s = 0;
  s += jaccard(me?.interests, other?.interests) * 40;
  s += jaccard(me?.skills, other?.skills) * 30;
  s += jaccard(me?.industries, other?.industries) * 20;
  const gA = (me?.networking_goals || []).join(' ').toLowerCase();
  const gB = (other?.networking_goals || []).join(' ').toLowerCase();
  if (gA.includes('mentorship') && gB.includes('mentorship')) s += 5; // symmetric for MVP
  if (gA.includes('cofounder') && gB.includes('cofounder')) s += 5;
  return Math.max(0, Math.min(100, Math.round(s)));
}

export function whySimple(me: any, other: any, score: number) {
  return score >= 80
    ? 'Strong overlap and complementary goals.'
    : 'Shared interests and potential collaboration fit.';
}
