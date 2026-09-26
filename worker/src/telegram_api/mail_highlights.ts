function htmlText(html: string): string {
    return html
        .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;|&#160;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">");
}

export function extractMailHighlights(subject: string, text: string, html: string) {
    const body = text || htmlText(html);
    const content = `${subject}\n${body}`;
    const keyword = "(?:验证码|校验码|动态码|一次性(?:密码|代码)|(?:verification|security|confirmation|auth)\\s+code|one[-\\s]?time\\s+(?:password|code)|otp|code)";
    const after = new RegExp(`${keyword}\\s*(?:(?:is|是|为)\\s*)?[:：#-]?\\s*([A-Z0-9]{3,8}(?:[- ]?[A-Z0-9]{3,4})?)(?![A-Z0-9])`, "i");
    const before = new RegExp(`\\b([A-Z0-9]{4,8})\\s*(?:is|是|为)?\\s*(?:your|您的)?\\s*${keyword}`, "i");
    const code = [content.match(after)?.[1], content.match(before)?.[1]]
        .map(candidate => (candidate || "").replace(/[- ]/g, ""))
        .find(candidate => /\d/.test(candidate) || /^[A-Z]{4,8}$/.test(candidate)) || "";

    const urls = [
        ...Array.from(text.matchAll(/https?:\/\/[^\s<>"']+/gi), match => match[0]),
        ...Array.from(html.matchAll(/<a\b[^>]*\bhref\s*=\s*["'](https?:\/\/[^"']+)["']/gi), match => match[1]),
    ];
    const links = Array.from(new Set(urls.map(url => url.replace(/&amp;/gi, "&").replace(/[.,;!?，。；！？)\]]+$/, ""))))
        .filter(url => {
            try { return ["http:", "https:"].includes(new URL(url).protocol); }
            catch { return false; }
        })
        .sort((a, b) => Number(/verify|confirm|activate|reset|login|auth|token/i.test(b)) - Number(/verify|confirm|activate|reset|login|auth|token/i.test(a)))
        .reduce<string[]>((chosen, url) => {
            if (chosen.length < 3 && chosen.reduce((length, link) => length + link.length, 0) + url.length <= 1800) chosen.push(url);
            return chosen;
        }, []);

    return { code, links, body };
}
