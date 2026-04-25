# 3D Live Sweep Protocol

Use this before restoring or changing another 3D family.

## Gate Order

1. Work from a clean worktree based on `origin/main`.
2. Restore one family only.
3. Verify every local GLB path referenced by that family's manifest exists.
4. Run `npm run type-check`.
5. Run `npm run build`.
6. Start local preview and click every non-custom config.
7. Push only after local approval.
8. Tag the shipped commit with a family restore tag.
9. Verify both live domains after Vercel updates.

## Live Verification

Run the reusable browser sweep:

```bash
npm run verify:3d-family -- cratos --screenshots tmp
npm run verify:3d-family -- nepton --screenshots tmp
```

For local preview:

```bash
npm run verify:3d-family -- cratos --base http://localhost:3000 --screenshots tmp
```

The sweep fails when:

- The family page title says `Product not found`.
- The live manifest is missing or has no configs.
- A config cannot be clicked.
- No 3D canvas appears after selecting a config.
- The page shows the 3D `COMING SOON` fallback.
- Any `/3d-parts/` asset request fails.

## Product Logic Checklist

Before marking a family solid, compare its live options against the original 3ds/max idea:

- Workstations need front dividers and side dividers when the original system has them.
- Cable trays should be configurable where the table type normally needs them.
- Power boxes must follow table logic: single office, meeting table, workstation 4, workstation 6, and large boardroom are different cases.
- Meeting-table middle legs can also be cable paths when the original design uses them that way.
- Spine/cable-path parts should not be lost when simplifying the live configurator.

## Current Restore Baseline

- Cratos: restored and tagged `cratos-live-restore-2026-04-26`.
- Nepton: restored and tagged `nepton-live-restore-2026-04-26`.

Do not move to the next family until the current family passes local browser sweep, build checks, live manifest check, live browser sweep, and has a restore tag.
