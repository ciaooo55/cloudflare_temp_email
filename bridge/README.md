# Cross-account email bridge

The 11 and 163 accounts run this small Email Worker. Their catch-all rules send incoming mail to it. It signs the original envelope recipient and forwards the message to `mail@ciaooo55.de5.net`. The 55 account's `cloudflaretempemail` Worker verifies the signature before storing mail under the original recipient.

Deploy `wrangler.toml` for account 11 and `wrangler.163.toml` for account 163. Set the same `BRIDGE_SECRET` Worker secret on both bridge Workers and the 55 receiver; never put its value in Git. The destination address must be verified in each forwarding account.

```sh
node --test worker.test.mjs
npx wrangler deploy --config wrangler.toml
npx wrangler secret put BRIDGE_SECRET --config wrangler.toml
npx wrangler deploy --config wrangler.163.toml
npx wrangler secret put BRIDGE_SECRET --config wrangler.163.toml
```
