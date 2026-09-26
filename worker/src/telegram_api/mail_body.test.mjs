import assert from "node:assert/strict";
import { test } from "node:test";
import { mailBody } from "./mail_body.ts";

test("keeps plain text unchanged and reads HTML-only mail", () => {
    assert.equal(mailBody("Code: 123456\nVisit https://example.com", "<p>ignored</p>"), "Code: 123456\nVisit https://example.com");
    assert.equal(mailBody("", "<p>验证码：123456</p><div>激活链接：</div><a href=\"https://example.com\">打开</a><script>ignored()</script>"), "验证码：123456\n\n激活链接：\n打开");
});
