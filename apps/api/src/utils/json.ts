export function extractFirstJSON(text: string): any {
  if (!text || typeof text !== "string") {
    throw new Error("No text to parse");
  }

  const candidates: string[] = [];

  // 1) If the whole text is valid JSON
  candidates.push(text.trim());

  // 2) Extract code fences
  const fenceRegex = /```(?:json)?\s*([\s\S]*?)```/gi;
  let m;
  while ((m = fenceRegex.exec(text))) {
    if (m[1]) candidates.push(m[1].trim());
  }

  // 3) Try to extract {...} or [...] blocks with balanced brackets scanning
  const bracketCandidates: string[] = [];
  const scans = [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
  ];
  for (const { open, close } of scans) {
    let stack = 0;
    let start = -1;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === open) {
        if (stack === 0) start = i;
        stack++;
      } else if (ch === close) {
        stack--;
        if (stack === 0 && start !== -1) {
          bracketCandidates.push(text.slice(start, i + 1));
          start = -1;
        }
      }
    }
  }
  candidates.push(...bracketCandidates);

  // try parsing candidates in order of discovery
  for (const c of candidates) {
    try {
      const parsed = JSON.parse(c);
      return parsed;
    } catch (err) {
      // ignore and try next
    }
  }

  // last resort: try to find something that looks like "planTitle": ... using regex
  const keyedJsonLike = text.match(/\{[\s\S]*"planTitle"[\s\S]*\}/);
  if (keyedJsonLike) {
    try {
      return JSON.parse(keyedJsonLike[0]);
    } catch (err) {
      // fallthrough
    }
  }

  throw new Error("No JSON found in text");
}
