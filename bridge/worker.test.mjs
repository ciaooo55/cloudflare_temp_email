import assert from "node:assert/strict";
import { test } from "node:test";
import bridge from "./worker.mjs";

test("forwarded mail carries a signed original recipient", async () => {
  const secret = "test-secret";
  const original = "alice@example.com";
  let forwarded;
  await bridge.email({
    to: original,
    async forward(to, headers) { forwarded = { to, headers }; },
  }, { BRIDGE_SECRET: secret, BRIDGE_DESTINATION: "bridge@example.net" });

  assert.equal(forwarded.to, "bridge@example.net");
  assert.equal(forwarded.headers.get("X-Original-Recipient"), original);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const signature = Uint8Array.from(
    forwarded.headers.get("X-Original-Recipient-Signature").match(/.{2}/g),
    byte => parseInt(byte, 16));
  assert.equal(await crypto.subtle.verify("HMAC", key, signature,
    new TextEncoder().encode(original)), true);
  assert.equal(await crypto.subtle.verify("HMAC", key, signature,
    new TextEncoder().encode("bob@example.com")), false);
});
