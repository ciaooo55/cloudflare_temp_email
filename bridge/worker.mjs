export default {
  async email(message, env) {
    if (!env.BRIDGE_SECRET) throw new Error("BRIDGE_SECRET is required");
    const recipient = message.to;
    const key = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(env.BRIDGE_SECRET),
      { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(recipient));
    const headers = new Headers();
    headers.set("X-Original-Recipient", recipient);
    headers.set("X-Original-Recipient-Signature",
      Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, "0")).join(""));
    await message.forward(env.BRIDGE_DESTINATION, headers);
  },
};
