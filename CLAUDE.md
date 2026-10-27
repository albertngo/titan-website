@AGENTS.md

# Titan Flooring

## Second brain: titan-vault

Titan's decisions, analyses and platform knowledge live in the Obsidian vault
(`albertngo/titan-vault`, default branch `main-vault`). This repo holds the code; the vault
holds why things are the way they are. The rules for writing it are the vault's
`CONVENTIONS.md`, section "Capture from work sessions". That section is canonical and this
one only points at it (Albert, 2026-10-27).

- **Load it** before designing a build, and whenever one of the things below happens. If a
  `titan-vault` checkout is already in the session, use it (`git pull` on `main-vault`).
  Otherwise `add_repo` (`albertngo/titan-vault`, `access: "push"`), `git clone --depth 1
  <clone_url> /workspace/titan-vault`, then `register_repo_root`.
- **Read before you build.** Before proposing a new build or a significant change, read
  `04_goals/`, recent `05_decisions/` and `09_analyses/`, and the notes on whatever the build
  touches. Name the notes that shaped the suggestion, and say where it would contradict a
  recorded decision.
- **Capture as it happens**, not at the end: a decision Albert makes or changes goes to
  `05_decisions/`, an analysis with findings worth keeping to `09_analyses/`, a platform
  quirk, trap or ID to `06_platforms/`. Draft it, show it, write it when he says yes.
- **A vault note this repo cites must exist.** If a comment, doc or commit here points at a
  vault note, write that note in the same session.
- **Land it on `main-vault`.** A vault commit left on a session branch never reaches
  Obsidian or a later session. If the session can push only its own branch, open a PR into
  `main-vault` and say so in the final reply.
- **Run `/wrap-up` before you finish** any session that built, decided or analysed
  something. It lists what this session hasn't captured yet and drafts it.
- **Here:** what the site shows (prices, which products are listed, forms and where leads
  go) and how it is built are decisions. The architecture decision is
  `05_decisions/2026-09-12-website-architecture.md`, including its 2026-10-27 addendum on
  prices.
