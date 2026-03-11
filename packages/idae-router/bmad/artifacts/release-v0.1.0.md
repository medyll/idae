# Release v0.1.0 — Checklist

Date: 2026-03-11T12:55:05.527Z

Preconditions
- All unit tests passing (79/79)
- publint: ✅
- Build: clean

Checklist
1. pnpm run build
2. Ensure npm auth (npm whoami)
3. pnpm publish --access public
4. git tag -a v0.1.0 -m "Release v0.1.0" && git push --tags
5. Update CHANGELOG.md if needed
6. Run `bmad-master dashboard` after publish

Post-publish
- Confirm package available on npm
- Update bmad/status.yaml `recommendation` and `progress` if publish succeeded

Notes
- Publishing requires npm registry auth; do not publish from CI without credentials.
- If two-factor is enabled, ensure proper OTP flow.
