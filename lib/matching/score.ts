export function jaccard(a?: string[], b?: string[]) {
  if (!a?.length || !b?.length) return 0
  const A = new Set(a.map((x) => x.toLowerCase()))
  const B = new Set(b.map((x) => x.toLowerCase()))
  let inter = 0
  A.forEach((x) => { if (B.has(x)) inter++ })
  const union = A.size + B.size - inter
  return union ? inter / union : 0
}

export function scoreMatch(me: any, other: any) {
  let s = 0
  s += jaccard(me?.interests, other?.interests) * 40
  s += jaccard(me?.skills, other?.skills) * 30
  s += jaccard(me?.industries, other?.industries) * 20
  const gA = (me?.networking_goals || []).join(' ').toLowerCase()
  const gB = (other?.networking_goals || []).join(' ').toLowerCase()
  if (gA.includes('mentorship') && gB.includes('mentorship')) s += 5
  if (gA.includes('cofounder') && gB.includes('cofounder')) s += 5
  return Math.max(0, Math.min(100, Math.round(s)))
}

export function whySimple(me: any, other: any, score: number) {
  const sharedInterests = me?.interests?.filter((i: string) => 
    other?.interests?.some((oi: string) => oi.toLowerCase() === i.toLowerCase())
  ) || []
  
  const sharedSkills = me?.skills?.filter((s: string) => 
    other?.skills?.some((os: string) => os.toLowerCase() === s.toLowerCase())
  ) || []

  const sharedIndustries = me?.industries?.filter((i: string) => 
    other?.industries?.some((oi: string) => oi.toLowerCase() === i.toLowerCase())
  ) || []

  if (sharedInterests.length > 0 && sharedSkills.length > 0) {
    return `You both share interests in ${sharedInterests[0]} and have complementary ${sharedSkills[0]} skills.`
  } else if (sharedInterests.length > 0) {
    return `Both passionate about ${sharedInterests[0]} - great potential for collaboration.`
  } else if (sharedSkills.length > 0) {
    return `Your shared expertise in ${sharedSkills[0]} could lead to interesting discussions.`
  } else if (sharedIndustries.length > 0) {
    return `Both working in ${sharedIndustries[0]} with complementary backgrounds.`
  } else if (score >= 70) {
    return 'Strong professional alignment and complementary goals.'
  } else {
    return 'Interesting background differences that could spark valuable conversations.'
  }
}
