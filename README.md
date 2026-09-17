# Polar Bear Library

A lesson dashboard for Lowrance, built for a student-facing display plus a
PIN-gated Admin planning view. Standalone project — no shared code path
with the Paisley IB Library Dashboard, though a few components (Rules,
Timer pattern, Blobs auth) started as copies of that project's approach.

- **Student Display** — what's on the screen: today's date/time, a
  countdown timer, library rules, a Canva slides embed (Fit / Full Screen),
  "Today I Can...", Word of the Week, the 3-step visual schedule, today's
  books, the lesson video, and "Your Turn" prompts.
- **Admin / Planning** — everything you edit: Standards (AASL + NC
  Extended Content Standards, grades 6–8), the "I Can" statement, Goal,
  Barriers, Access Options, Evidence, materials, video/slides URLs, and
  the detailed timed agenda. PIN-gated so students can't wander into it.

## Local development

```bash
npm install
npm run dev
```

This runs the UI only. Without `netlify dev`, Admin edits are held in
memory in your browser tab (not saved anywhere) — that's expected, and is
just so you can iterate on the UI without needing Netlify running. Real
saving requires the Netlify Functions + Blobs backend below.

To test the real backend locally:

```bash
npm install -g netlify-cli   # one-time
netlify dev
```

## Putting this on GitHub

```bash
git init
git add .
git commit -m "Initial commit"
```

Then create a new, empty repository on GitHub (no README/gitignore — you
already have one), and:

```bash
git remote add origin https://github.com/<your-username>/polar-bear-library.git
git branch -M main
git push -u origin main
```

## Deploying to Netlify

1. In Netlify, **Add new site → Import an existing project**, and pick
   this GitHub repo.
2. Build settings are already set via `netlify.toml` — Netlify should
   detect them automatically (build command `npm run build`, publish
   folder `dist`). You shouldn't need to type anything in manually.
3. Deploy. Netlify Blobs works automatically once the site is live — no
   separate database or credentials to set up.
4. **Before you consider this ready for real use**, set one environment
   variable (Site settings → Environment variables):
   - `SESSION_SECRET` — any long random string of your choosing.

## A few things worth knowing before you rely on this

**Set `SESSION_SECRET` — this one actually matters.** The Admin PIN check
signs a login session using a secret key. Right now, if you never set
`SESSION_SECRET` in Netlify, the code falls back to a fixed string that's
sitting in plain sight in this repo's source code
(`netlify/functions/auth-check.js`). Since this will be a public GitHub
repo (or even a private one anyone on your team can read), that fallback
string isn't actually secret — anyone who can see the code could use it to
forge a valid Admin session and skip the PIN entirely. Setting your own
`SESSION_SECRET` in Netlify (step 4 above) closes that gap. This is the
one item I'd genuinely call "don't skip," not just a nice-to-have.

**The PIN itself is a light lock, not a strong one.** It's a numeric PIN
(default `0000`, change it in Admin → Change Admin PIN right after your
first deploy) with no attempt limit or lockout — someone could sit and try
PINs repeatedly. Since Admin only edits lesson content (not any student
data), the worst case if someone guesses it is that they change what's on
the display, not a data leak — but if this ever needs a stronger guarantee
than "casual protection," a longer PIN plus rate-limiting the auth
function would be the next step, and I'd want to build that deliberately
rather than bolt it on.

**No student data is collected or stored anywhere in this app.** Nothing
here asks a student to log in, type their name, or submit anything — it's
a one-way display plus a planning tool. That means COPPA (which is about
collecting personal info from children under 13) and FERPA (which is about
student education records) don't really apply, since neither personal
info nor education records ever touch this app. Worth re-checking this
assessment any time you add a feature that involves students entering or
submitting anything.

**Embedded YouTube video, and CIPA.** The video uses YouTube's
privacy-enhanced embed domain (`youtube-nocookie.com`), which cuts down on
tracking but doesn't guarantee every "related video" YouTube might surface
after playback is classroom-appropriate — worth a quick check with
whatever filtering your school already runs on district devices, same as
you'd want for any embedded YouTube video, not something specific to this
app.

**Canva embed links are public.** Once you generate a Canva "Embed" link
for a set of slides, anyone with that link can view the slides, whether or
not they have a Canva account. That's normal for how Canva's embed feature
works — just worth knowing before pasting a link to something that
shouldn't be publicly viewable.

## Project structure

```
netlify/functions/     Auth (PIN + session), content read/write
src/data/defaults.js   The full content schema + AASL/NCES option lists
src/lib/blobsClient.js Talks to the functions (falls back to in-memory
                        storage if functions aren't reachable, for local dev)
src/components/
  Display.jsx           Student Display
  Admin.jsx              Admin / Planning (PIN-gated)
src/assets/             Mascot + the three step icons
```
