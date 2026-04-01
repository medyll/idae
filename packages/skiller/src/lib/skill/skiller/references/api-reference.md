# @medyll/skiller — Library API Reference

## Exports

```ts
import {
  // Core functions
  findSkillMd,           // Find SKILL.md in a package
  findPackageJson,       // Find parent package.json
  getPackageName,        // Extract package name (without scope)
  createSkill,           // Create a SKILL.md template
  createTestSuite,       // Create a test-suite.json template
  createSkillWithTests,  // Create both SKILL.md and test-suite.json
  installSkill,          // Copy skill to destination
  interactivePrompt,     // Show interactive menu
  installSkillNonInteractive, // Install without prompts
  resolveTargetPath,     // Resolve a target path template
  getTargets,            // Get available targets from registry

  // Evaluation functions
  findTestSuite,         // Find test-suite.json in a package
  testSkill,             // Run test suite evaluation
  runTestCase,           // Run a single test case
  runTestSuite,          // Run full test suite
  saveResults,           // Save results to session file
  getAdapter,            // Get LLM adapter by name

  // Reporter functions
  viewReport,            // Open report in browser
  generateReport,        // Generate HTML report from results
  getLatestResults,      // Get latest test results
  getResultsBySession,   // Get results by session name
  listSessions,          // List all available sessions

  // Optimization functions
  optimizeSkill          // Run AI-powered optimization
} from '@medyll/skiller';
```

## Examples

```ts
// Find SKILL.md in standard locations (auto-detects pkgName)
const skillPath = findSkillMd(pkgDir);
const skillPath = findSkillMd(pkgDir, 'my-pkg');

// Create a new skill template
createSkill({ pkgName: 'my-pkg', pkgDir, description: '...' });

// Install skill interactively
await interactivePrompt({ pkgName: 'my-pkg', skillSrc: skillPath });

// Install skill non-interactively
installSkillNonInteractive({
  pkgName: 'my-pkg',
  skillSrc: skillPath,
  target: 'user'  // or 'claude', 'cursor', 'codex', etc.
});

// Resolve a target path
const destDir = resolveTargetPath(['homedir', '.cursor', 'skills', '<pkg>'], 'my-pkg', process.cwd());

// Get all available targets
const targets = getTargets();
```
