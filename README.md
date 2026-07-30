# sample-app — T9 Transformer demo target

A deliberately tiny React 16 app used as the transform target for the **T9
Transformer** demo. It is a **fixture / demo asset**, not part of the engine
(`/coordinator`, `/runner`, …), so it may — and does — contain React-specific
code. Engine/adapter purity (CLAUDE.md) forbids that only in engine code.

> The real ~15-component fixture is **T18**. This one exists so T9 has something
> concrete to transform for the demo, carrying the backlog's reference story.

## The reference story

`src/Clock.jsx` is a React 16 **class component** that opens an external
subscription in `componentDidMount` and tears it down in `componentWillUnmount`.
The demo unit's job is the canonical lifecycle-to-hooks conversion: fold that
mount/unmount pair into a single `useEffect` with a cleanup return.

- `src/Clock.jsx` — the class component (the **only** file in the demo unit's
  Scope).
- `src/clock-source.js`, `src/App.jsx`, `src/index.js` — supporting files,
  deliberately **out of scope** so the scope check has something to protect.

## The canned transform (offline fallback)

`fixture/canned/src/Clock.jsx` is the transformed (functional + `useEffect`)
form. It is the deterministic input the `OfflineTransformSession` applies to the
demo worktree so the demo runs with no live model gateway (demo-plan §D1 /
`docs/t9-implementation-plan.md` §3.3). At reversion, the live
`ClaudeAgentSession` produces this change itself and the canned asset is demoted
to a test double.

## Worktree note (why there is no nested `.git` here)

The T9 plan calls for a "git-init'd worktree." Committing a nested Git repo into
the platform repo would create a gitlink/submodule, so instead these are plain
tracked files and the demo driver (`scripts/transform_demo.py`) / tests copy
this tree into a fresh temp directory and `git init` it **at runtime**. That is
strictly more hermetic and does not change the reversion story.

No `npm install` / build is run in the demo — the offline path only edits files.
Real build/lint/typecheck verification is out of T9's demo scope (plan §10).
