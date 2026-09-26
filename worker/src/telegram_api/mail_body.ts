export function mailBody(text: string, html: string): string {
    const source = text || html
        .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
        .replace(/<\s*(br|\/p|\/div|\/section|\/article|\/tr|\/table|\/h[1-6]|\/li)\b[^>]*>/gi, "\n")
        .replace(/<\s*(p|div|section|article|tr|table|h[1-6]|li)\b[^>]*>/gi, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;|&#160;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">");

    return source
        .replace(/\r\n?/g, "\n")
        .split("\n")
        .map(line => line.replace(/[ \t]+/g, " ").trim())
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}
