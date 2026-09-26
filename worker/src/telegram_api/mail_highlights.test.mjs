import assert from "node:assert/strict";
import { test } from "node:test";
import { extractMailHighlights } from "./mail_highlights.ts";

test("extracts common codes and actionable links without HTML tracking images", () => {
    const result = extractMailHighlights(
        "验证邮箱",
        "",
        '<p>验证码：ABC123</p><a href="https://example.com/verify?x=1&amp;y=2">验证</a><img src="https://track.example.com/pixel">'
    );
    assert.equal(result.code, "ABC123");
    assert.deepEqual(result.links, ["https://example.com/verify?x=1&y=2"]);
    assert.match(result.body, /验证码：ABC123/);
});

test("recognizes codes before or after English keywords", () => {
    assert.equal(extractMailHighlights("", "Your verification code is 123-456", "").code, "123456");
    assert.equal(extractMailHighlights("739201 is your verification code", "", "").code, "739201");
    assert.equal(extractMailHighlights("Status", "The code will arrive soon", "").code, "");
});

test("keeps long verification links within the Telegram message budget", () => {
    const link = `https://example.com/verify?token=${"a".repeat(700)}`;
    assert.deepEqual(extractMailHighlights("", link, "").links, [link]);
});
