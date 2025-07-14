export function summarizeText(text) {
  const sentences = text
    .split('.')
    .map(s => s.trim())
    .filter(s => s.length > 20); // Avoid very short junk sentences

  const selected = sentences.slice(0, 5); // Get top 5 meaningful sentences

  // Format with bullets
  const bullets = selected.map(s => `• ${s}`).join('\n');

  return bullets;
}