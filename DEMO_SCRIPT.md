# LudaVia Investor Demo Script

This is the repeatable 60-90 second path for the laptop demo. The flow uses one fictional business and keeps the presenter in control of the final submission.

## Sample Business

Click **Use sample business** on the first form screen. The control fills the values in `presenterSampleBusiness` from `src/data/form-options.ts`; it does not submit the form.

| Field | Value |
| --- | --- |
| Business name | Morrow Care |
| Business type | Product / SaaS (`product-saas`) |
| Sector | Health (`health`) |
| Location | Austin, Texas |
| Stage | Early (`early`) |
| Main goal | Find customers (`find-customers`) |
| Help needed | Go-to-market (`go-to-market`) |
| Additional context | A care navigation platform helping independent clinics guide new parents through postpartum support. |

## Click Path And Spoken Lines

1. On `/`, click **Begin your journey**. Say: "I'll show the shortest path from a business brief to one practical growth decision."
2. On Step 1, click **Use sample business**. Say: “For the demo, I’m using Morrow Care, an early health SaaS business in Austin. The sample keeps the story concrete.”
3. Click **Continue** on each of the five steps. Say: “The form only asks for the context that changes the recommendation: business model, market, stage, goal, and the kind of help needed.”
4. On the results briefing, read **Here's what I see**. Click **Continue to the leverage**. Say: "Via21 starts with an observation, then looks for leverage instead of dumping a report on the founder."
5. Let the Via21 reading state finish. A live response is labelled **Live insight**; a prepared response is labelled **Prepared insight**. Click **Continue to the opportunity**.
6. Read the single illustrative opportunity and connection. Click **Continue to the next move**. Say: "There is one path to explore and one potential perspective, both clearly marked illustrative. The product ends with one next move."
7. Click **Shape this opportunity**, then **Yes, help me shape it** if showing the local confirmation. Click **Save the plan** to download the one-page executive brief. Say: "That is the handoff: a focused recommendation and a plan the owner can take away."

The core path is splash, sample fill, five **Continue** clicks, three guided briefing actions, and the optional local confirmation/PDF export. It requires no account and does not contact anyone.

## If Wi-Fi Or Gemini Fails

Keep going. After the Via21 reading state, the prepared insight appears automatically and is labelled **Prepared insight**. It still includes the summary and exactly one recommended next step. The opportunity, connection, local confirmation, and **Save the plan** export work in fallback mode too.

To force fallback for a test run, stop the server, remove `GEMINI_API_KEY` from `.env.local` or launch without that variable, and restart. An invalid key also produces the fallback after the request fails. Do not put a key in source, a `NEXT_PUBLIC_` variable, this document, or a command copied into the repository.

## Gemini Key Setup

Use either a server-only shell variable:

```bash
GEMINI_API_KEY='replace-with-the-real-key' npm run start
```

Or create a local `.env.local` file, which is gitignored:

```bash
GEMINI_API_KEY=replace-with-the-real-key
GEMINI_MODEL=gemini-3.6-flash
```

Restart `npm run dev` or `npm run start` after changing `.env.local`. The key is read only by `src/server/gemini-config.ts`; never use `NEXT_PUBLIC_GEMINI_API_KEY`.

## Reset Between Runs

The profile is stored in same-tab `sessionStorage`. For a clean run, open a fresh tab or use the browser console on the current tab:

```js
sessionStorage.removeItem('ludavia-business-needs:v1');
localStorage.removeItem('ludavia-form-draft:v2');
location.href = '/';
```

The **Edit details** link returns to the form with the current profile when you want to adjust it rather than start over. A fresh `/results` tab without a saved profile returns to `/form`.

## Recognizing The Mode

- Live Gemini output: the briefing source reads **Live insight**.
- Prepared fallback: the briefing source reads **Prepared insight**, and the Via21 panel explains that live generation is unavailable.
- The next step remains visible in either mode; do not wait indefinitely for the provider.
