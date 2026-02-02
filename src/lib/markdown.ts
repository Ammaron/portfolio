/**
 * Strip markdown formatting from text for use in previews
 */
export function stripMarkdown(text: string): string {
  if (!text) return '';
  
  return text
    // Remove headers (# ## ### etc.)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold (**text**) and italic (*text*) markdown
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // Remove inline code (`code`)
    .replace(/`(.*?)`/g, '$1')
    // Remove links [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove blockquotes (> text)
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules (--- or ***)
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove numbered lists
    .replace(/^\d+\.\s+/gm, '')
    // Remove bullet points
    .replace(/^[-*+]\s+/gm, '')
    // Remove multiple newlines and replace with single space
    .replace(/\n\s*\n/g, ' ')
    // Remove any remaining newlines
    .replace(/\n/g, ' ')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Create a plain text excerpt from markdown content
 */
export function createExcerpt(content: string, maxLength: number = 160): string {
  const plainText = stripMarkdown(content);
  if (plainText.length <= maxLength) return plainText;
  
  // Find the last complete sentence before the cutoff
  const truncated = plainText.substring(0, maxLength);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );
  
  if (lastSentenceEnd > maxLength * 0.7) {
    return truncated.substring(0, lastSentenceEnd + 1);
  }
  
  return truncated + '...';
}