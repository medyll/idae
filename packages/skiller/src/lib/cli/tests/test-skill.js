import fs from 'fs';
import path from 'path';
import { findPackageJson, getPackageName, findSkillMd } from '../../../index.mjs';
import { runTestSuite, saveResults } from '../../core/evaluator/index.js';

/**
 * Find test-suite.json in standard locations
 * @param {string} pkgDir - Package directory
 * @param {string} pkgName - Package name
 * @returns {string|null} Path to test-suite.json or null
 */
export function findTestSuite(pkgDir, pkgName) {
  const candidates = [
    path.join(pkgDir, 'lib', 'skill', pkgName, 'test-suite.json'),
    path.join(pkgDir, 'src', 'lib', 'skill', pkgName, 'test-suite.json'),
    path.join(pkgDir, 'dist', 'skill', pkgName, 'test-suite.json'),
    path.join(pkgDir, 'test-suite.json')
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

/**
 * Main test-skill command
 * @param {Object} options
 * @param {string} options.pkgName - Package name
 * @param {string} options.skillSrc - Path to SKILL.md
 * @param {string} options.testSuite - Path to test-suite.json
 * @param {string} [options.model] - Specific model to test (optional)
 * @param {string} [options.caseId] - Specific test case to run (optional)
 * @param {boolean} [options.parallel] - Run tests in parallel
 */
export async function testSkill(options = {}) {
  const { pkgName, skillSrc, testSuite, model, caseId, parallel } = options;

  // Read SKILL.md
  const skillMdContent = fs.readFileSync(skillSrc, 'utf8');

  // Read test-suite.json
  const testSuiteData = JSON.parse(fs.readFileSync(testSuite, 'utf8'));

  // Filter by specific model if provided
  if (model) {
    testSuiteData.models = [model];
  }

  // Filter by specific test case if provided
  if (caseId) {
    testSuiteData.cases = testSuiteData.cases.filter(tc => tc.id === caseId);
    if (testSuiteData.cases.length === 0) {
      console.error(`No test case found with id: ${caseId}`);
      process.exit(1);
    }
  }

  // Override parallel setting if provided
  if (parallel !== undefined) {
    testSuiteData.settings = testSuiteData.settings || {};
    testSuiteData.settings.parallel = parallel;
  }

  console.log(`\n🧪 Running skill evaluation for: ${pkgName}`);
  console.log(`   Test cases: ${testSuiteData.cases.length}`);
  console.log(`   Models: ${testSuiteData.models.join(', ')}`);
  console.log('');

  // Run the test suite
  const results = await runTestSuite(testSuiteData, skillMdContent, testSuiteData.settings);

  // Save results
  const sessionInfo = saveResults(results, pkgName);

  // Print summary
  const summary = sessionInfo.latestPath ? 
    JSON.parse(fs.readFileSync(sessionInfo.latestPath, 'utf8')).summary : 
    generateSummary(results);

  console.log('\n✅ Evaluation complete!');
  console.log(`\n📊 Summary:`);
  console.log(`   Total: ${summary.total}`);
  console.log(`   Passed: ${summary.passed}`);
  console.log(`   Failed: ${summary.failed}`);
  console.log(`   Pass Rate: ${summary.passRate}%`);
  console.log(`   Average Score: ${summary.avgScore}`);

  console.log(`\n📁 Results saved to:`);
  console.log(`   ${sessionInfo.resultsPath}`);
  console.log(`\n📄 View report with: npx skiller report`);

  // Exit with error code if any tests failed
  if (summary.failed > 0) {
    process.exit(1);
  }
}

/**
 * Generate summary from results (fallback if saveResults doesn't return it)
 */
function generateSummary(results) {
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / total;

  const byModel = {};
  for (const result of results) {
    if (!byModel[result.model]) {
      byModel[result.model] = { total: 0, passed: 0, scores: [] };
    }
    byModel[result.model].total++;
    if (result.passed) byModel[result.model].passed++;
    byModel[result.model].scores.push(result.score);
  }

  for (const model of Object.keys(byModel)) {
    const data = byModel[model];
    data.avgScore = data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length;
    delete data.scores;
  }

  return {
    total,
    passed,
    failed: total - passed,
    avgScore: Math.round(avgScore * 100) / 100,
    passRate: Math.round((passed / total) * 100) / 100,
    byModel
  };
}
