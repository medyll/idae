import fs from 'fs';
import path from 'path';
import { getAdapter } from '../core/evaluator/index.js';
import { getLatestResults } from '../core/reporter/index.js';

/**
 * Analyze failures and generate optimization suggestions
 * @param {Object} resultsData - Test results data
 * @param {string} skillMdContent - Current SKILL.md content
 * @param {string} optimizerModel - Model to use for optimization
 * @returns {Promise<string>} Optimization suggestions
 */
async function analyzeFailures(resultsData, skillMdContent, optimizerModel) {
  const failedTests = resultsData.results.filter(r => !r.passed);
  
  if (failedTests.length === 0) {
    return "✅ All tests are passing! No optimization needed.";
  }

  // Build analysis prompt
  const failureDetails = failedTests.map(r => `
Test Case: ${r.name} (${r.caseId})
Model: ${r.model}
Input: ${r.input}
Expected Assertions: ${JSON.stringify(r.assertions, null, 2)}
Response: ${r.response?.substring(0, 500)}${r.response?.length > 500 ? '...' : ''}
---
`).join('\n');

  const systemPrompt = `You are a skill optimization expert. Your task is to analyze failed test cases and suggest improvements to the SKILL.md instructions.

The SKILL.md file provides instructions to AI assistants on how to use a package. When tests fail, it often means the instructions are unclear or incomplete.

Analyze the failures and provide specific, actionable recommendations to improve the SKILL.md file.`;

  const userPrompt = `Current SKILL.md:
${skillMdContent}

---
Failed Test Cases:
${failureDetails}

---
Please provide:
1. A brief analysis of what went wrong
2. Specific sections of SKILL.md that need improvement
3. Suggested rewrites or additions to fix the failures

Format your response as markdown.`;

  const adapter = getAdapter(optimizerModel);
  
  if (!adapter.isReady()) {
    throw new Error(`Optimizer model "${typeof optimizerModel === 'string' ? optimizerModel : optimizerModel.name}" is not configured (missing API key?)`);
  }

  return await adapter.send(systemPrompt, userPrompt, { maxTokens: 4096 });
}

/**
 * Apply optimization suggestions to SKILL.md
 * @param {string} skillPath - Path to SKILL.md
 * @param {string} suggestions - Optimization suggestions
 * @param {boolean} dryRun - If true, don't modify the file
 * @returns {Object} Result with new content or suggestions only
 */
function applyOptimization(skillPath, suggestions, dryRun = false) {
  const currentContent = fs.readFileSync(skillPath, 'utf8');
  
  if (dryRun) {
    return {
      applied: false,
      suggestions,
      message: 'Dry run mode - file not modified'
    };
  }

  // Append suggestions as a new section
  const timestamp = new Date().toISOString();
  const newContent = `${currentContent}

---

## 🔄 Optimization Suggestions (Generated: ${timestamp})

${suggestions}
`;

  fs.writeFileSync(skillPath, newContent, 'utf8');

  return {
    applied: true,
    suggestions,
    newContent,
    message: `Optimization suggestions appended to ${skillPath}`
  };
}

/**
 * Optimize command
 * @param {Object} options
 * @param {string} options.skill - Package/skill name
 * @param {string} options.skillSrc - Path to SKILL.md
 * @param {string} [options.model] - Model to use for optimization
 * @param {boolean} [options.dryRun] - If true, show suggestions without applying
 */
export async function optimizeSkill(options) {
  const { skill, skillSrc, model = 'claude', dryRun = false } = options;

  console.log(`\n🔍 Analyzing skill: ${skill}`);

  // Read SKILL.md
  const skillMdContent = fs.readFileSync(skillSrc, 'utf8');

  // Get latest test results
  const sessionsDir = path.join(path.dirname(skillSrc), '..', '..', '..', '.skiller', 'sessions');
  const resultsData = getLatestResults(sessionsDir);

  if (!resultsData) {
    console.error('No test results found. Run "npx skiller test-skill" first.');
    process.exit(1);
  }

  // Check if results are for this skill
  if (resultsData.skill !== skill) {
    console.warn(`Warning: Latest results are for "${resultsData.skill}", not "${skill}"`);
    console.warn('Proceeding anyway...');
  }

  // Analyze failures
  console.log(`\n📊 Found ${resultsData.results.length} test results`);
  const failedCount = resultsData.results.filter(r => !r.passed).length;
  console.log(`   Failed: ${failedCount}`);

  if (failedCount === 0) {
    console.log('\n✅ All tests are passing! No optimization needed.');
    return;
  }

  console.log(`\n🤖 Using model "${model}" for analysis...`);

  try {
    const suggestions = await analyzeFailures(resultsData, skillMdContent, model);

    console.log('\n' + '='.repeat(60));
    console.log('OPTIMIZATION SUGGESTIONS');
    console.log('='.repeat(60));
    console.log(suggestions);
    console.log('='.repeat(60));

    if (dryRun) {
      console.log('\n💡 Dry run mode. Run without --dry-run to apply suggestions.');
      return;
    }

    // Ask for confirmation
    console.log('\n📝 Apply these suggestions to SKILL.md?');
    console.log('   This will append the suggestions as a new section.');
    console.log('');

    // For non-interactive mode, just apply
    const result = applyOptimization(skillSrc, suggestions, dryRun);

    if (result.applied) {
      console.log(`\n✅ ${result.message}`);
      console.log(`\n📄 Review and manually apply changes to optimize your skill.`);
      console.log(`   Then run "npx skiller test-skill" again to verify improvements.`);
    }

  } catch (error) {
    console.error(`\n❌ Optimization failed: ${error.message}`);
    process.exit(1);
  }
}
