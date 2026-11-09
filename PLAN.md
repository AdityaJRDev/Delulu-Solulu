# DELULU SOLUL — Refined Product & Engineering Plan

> A 100-decision interactive relationship simulator. One partner sets the dilemma.
> The other lives the consequences. Then you both get an honest mirror.

---

## 1. What we are actually building (and what we are not)

**Not** a quiz. **Not** a "compatibility score" gimmick.

**It is** a *choice-driven episodic narrative engine* where the story is the test.
The score is a by-product of how two people behave inside the same story.

### The one-line pitch
> *"Set the fight you keep having. Send it to your person. See how they actually show up — 100 decisions later."*

### Core loop (30 seconds to understand, 15 minutes to feel)
```
A creates a run  →  picks a real friction point  →  answers how THEY would handle it
        ↓
B opens the link  →  plays 4 acts × 25 decisions  →  consequences accumulate
        ↓
Both unlock THE ALIGNMENT AUDIT  →  5-axis radar + 3 Critical Crossroads + repair prompts
```

---

## 2. The five refinements that make this peak

### Refinement 1 — Canonical 5 axes (kill the 4-vs-5 inconsistency)
The original doc mixes 4 axes (§3) and 5 axes (§2 of the upgrade). We lock **five**, each with a
weight, a low pole, a high pole, and a *visible* behaviour so the report can explain itself.

| Axis | Weight | Low pole | High pole |
|---|---|---|---|
| `empathy` — Empathy & Validation | 25% | fixes first, invalidates | validates before solving |
| `transparency` — Stress Transparency | 20% | goes silent, stonewalls | over-communicates early |
| `autonomy` — Autonomy ↔ Fusion | 20% | hyper-independent | interdependence-first |
| `repair` — Conflict & Repair | 20% | defends, keeps score | owns, de-escalates, repairs fast |
| `finance` — Money & Ego | 15% | secretive / status-driven | transparent / shared values |

Scoring: per axis, `Alignment = clamp(100 − 2 · |Aₖ − Bₖ|, 0, 100)`; the overall number is the
weighted mean. Choice deltas are applied relative to the scene's average choice, so no scene bakes in a
directional bias and a neutral run lands near 50 on every axis. Per-axis alignment is always reported,
so the number is never a black box.

### Refinement 2 — "Authored spine, generated skin" (the big architectural call)
Generating 100 scenes live with an LLM per run is slow, expensive, and *tonally inconsistent* —
the exact thing that kills immersion. So:

- **Spine (deterministic, shipped):** 100 hand-authored scenes across 4 acts, each with 3–4 choices,
  trait deltas, a consequence echo, and a `focus` axis. This is the quality floor and the zero-latency path.
- **Skin (LLM, optional):** the LLM only *personalises* — injects the couple's names, A's opening hook,
  and callbacks to earlier flags into the wrapper text. It never invents the decision tree.
- **Result:** zero loading delays, guaranteed schema validity, ~10× cheaper, and the LLM becomes an
  enhancement instead of a dependency. A `NarrativeProvider` interface keeps the door open for
  full generation later.

### Refinement 3 — Partner A gets a real vector, not vibes
A's baseline is built from three cheap inputs, so the report has something honest to compare against:
1. The opening hook (preset or free text).
2. **"How I'd actually handle it"** — 3 options that each carry axis deltas.
3. **Three non-negotiables** picked from a card deck (maps to axis boosts).

A never has to answer 100 questions. Setup stays under 60 seconds.

### Refinement 4 — Consequences that carry (memory state bag)
Every choice writes flags (`lied_about_overtime`, `backed_partner_against_parent`,
`joint_savings_depleted`). Later scenes reference them, so the run feels authored *for this couple*
rather than shuffled. Flags also feed the report's "what this predicts" section.

### Refinement 5 — The report is a conversation starter, not a verdict
- Overall resonance + per-axis radar.
- **3 Critical Crossroads**: the scenes where B drifted furthest from A's baseline, with
  "A expected / You chose / Ask each other this" framing.
- **Repair prompts** per weak axis, written as sentences you can literally read out loud.
- **Archetype card** (shareable 9:16 PNG) for the viral loop.

---

## 3. Architecture (v1, buildable today)

```
┌──────────────────────────── Browser / PWA ────────────────────────────┐
│  React 18 + Vite + TS + Tailwind + Framer Motion + Recharts           │
│  ─ landing / create / invite / play / report                          │
│  ─ local engine: scene runner, trait replay, scoring, report          │
│  ─ localStorage cache = offline-safe + instant reload                 │
└───────────────────────────────┬───────────────────────────────────────┘
                                │ /api (JSON)
┌───────────────────────────────▼───────────────────────────────────────┐
│  Express (ESM) — dumb, swappable persistence                          │
│  POST /api/sessions            create run                             │
│  GET  /api/sessions/:id        hydrate run                            │
│  PATCH /api/sessions/:id       append answers / status                │
│  JSON file store (data/sessions.json) → Postgres/Mongo later          │
└───────────────────────────────────────────────────────────────────────┘
```

**Why this shape:** the scoring engine is pure TypeScript on the client, so it is testable,
instant, and works offline. The server is a sync + share-link layer. Swapping JSON for
Postgres later touches one file.

### Later (documented, not built in v1)
- **LLM skin layer** — `POST /api/narrate` with Zod-validated structured output, cached in Redis.
- **Live co-play** — Socket.io room, both partners see the same scene in real time.
- **Capacitor** — `npx cap add android` over the existing `dist/`; haptics + local notifications.
- **BullMQ prefetch** — only needed once generation is live; unnecessary with an authored spine.

---

## 4. Data model

```ts
Session {
  id: string
  createdAt: number
  a: { name, hook, styleKey, priorities[], baseline: Axes }
  b: { name }
  answers: { sceneId, choiceIndex, ms }[]
  status: 'waiting_b' | 'in_progress' | 'completed'
}
```

`B`'s final vector is **replayed** from `answers` through the scene library — never stored as truth.
This means balance patches to the content automatically re-score old sessions, and cheating is
pointless because the report is derived, not asserted.

---

## 5. Act map (100 decisions)

| Act | Decisions | Theme | Recurring pressure |
|---|---|---|---|
| 1 — Daily Pressure | 1–25 | work crunches, chores, sleep, phone habits | the Friday deadline from A's hook |
| 2 — Outer Circles | 26–50 | in-laws, exes, friends, weddings, social media | "whose family wins?" |
| 3 — Money & Ego | 51–75 | bonuses, secret splurges, salary gap, loans | "whose ambition pays?" |
| 4 — Crisis & Forever | 76–100 | relocation, health scare, grief, commitment | "is this the life?" |

Each scene: `focus` axis, 3–4 choices, deltas, one-line consequence echo, and optional flags.

---

## 6. Sprint plan

- **Sprint 1 — Playable spine (this build).** Full 9:16 shell, 100 scenes, 5-axis engine, A setup,
  share link, B playthrough, alignment audit, radar, crossroads, archetype PNG export, PWA manifest.
- **Sprint 2 — Personalisation skin.** LLM wrapper pass, flag callbacks, A/B tone variants, Zod validation.
- **Sprint 3 — Live mode + accounts.** Socket.io co-play, Postgres, partner-A notifications, PDF export.
- **Sprint 4 — Native + growth.** Capacitor wrapper, haptics, push, invite analytics, story templates.

---

## 7. Success signals
- **Completion:** >55% of B players finish all 4 acts (the tension timer and act recaps protect this).
- **Share rate:** >1.4 invite links created per completed run.
- **The real metric:** couples who report having the "Crossroads" conversation within 48h.
