import fs from 'fs';
import path from 'path';
import { ClaudeAdapter } from './adapters/claude.js';
import { QwenAdapter } from './adapters/qwen.js';
import { OllamaAdapter } from './adapters/ollama.js';
import { OpenAIAdapter } from './adapters/openai.js';

/**
 * Get adapter instance by name
 * @param {string|Object} modelConfig - Model name or config object
 * @returns {import('./adapters/base.js').BaseAdapter} Adapter instance
 */
export function getAdapter(modelConfig) {
  let name, adapterType, model, endpoint;

  if (typeof modelConfig === 'string') {
    name = modelConfig;
    adapterType = modelConfig;
    model = undefined;
    endpoint = undefined;
  } else {
    name = modelConfig.name;
    adapterType = modelConfig.adapter;
    model = modelConfig.model;
    endpoint = modelConfig.endpoint;
  }

  const config = { name, model, endpoint };

  switch (adapterType.toLowerCase()) {
    case 'claude':
      return new ClaudeAdapter(config);
    case 'qwen':
      return new QwenAdapter(config);
    case 'ollama':
      return new OllamaAdapter(config);
    case 'openai':
      return new OpenAIAdapter(config);
    default:
      throw new Error(`Unknown adapter type: ${adapterType}`);
  }
}

/**
 * Run a single test case against a model
 * @param {Object} testCase - Test case definition
 * @param {import('./adapters/base.js').BaseAdapter} adapter - Model adapter
 * @param {string} skillMdContent - SKILL.md content
 * @param {Object} options - Test options
 * @returns {Promise<Object>} Test result
 */
export async function runTestCase(testCase, adapter, skillMdContent, options = {}) {
  const startTime = Date.now();
  const timeout = options.timeout || 30000;

  const systemPrompt = `You are an AI assistant. Follow these instructions:
${skillMdContent}

---
User question:`;

  let result = {
    caseId: testCase.id,
    name: testCase.name,
    model: adapter.name,
    passed: false,
    score: 0,
    response: '',
    error: null,
    assertions: {},
    duration_ms: 0
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await adapter.send(systemPrompt, testCase.input, {
      maxTokens: options.maxTokens
    });

    clearTimeout(timeoutId);

    result.response = response;
    result.duration_ms = Date.now() - startTime;

    // Run assertions
    const assertions = testCase.assertions || {};
    const assertionResults = {};

    // min_length assertion
    if (assertions.min_length !== undefined) {
      const passed = response.length >= assertions.min_length;
      assertionResults.min_length = { passed, value: response.length };
    }

    // max_length assertion
    if (assertions.max_length !== undefined) {
      const passed = response.length <= assertions.max_length;
      assertionResults.max_length = { passed, value: response.length };
    }

    // format assertion
    if (assertions.format) {
      let passed = false;
      if (assertions.format === 'markdown') {
        passed = response.includes('#') || response.includes('**') || response.includes('```');
      } else if (assertions.format === 'json') {
        try {
          JSON.parse(response);
          passed = true;
        } catch {
          passed = false;
        }
      } else if (assertions.format === 'code') {
        passed = response.includes('```');
      } else {
        passed = true; // plain text always passes
      }
      assertionResults.format = { passed, value: assertions.format };
    }

    // required_keywords assertion
    if (assertions.required_keywords) {
      const found = assertions.required_keywords.filter(kw => response.toLowerCase().includes(kw.toLowerCase()));
      const passed = found.length === assertions.required_keywords.length;
      assertionResults.required_keywords = { passed, found, missing: assertions.required_keywords.filter(kw => !found.includes(kw)) };
    }

    // forbidden_keywords assertion
    if (assertions.forbidden_keywords) {
      const found = assertions.forbidden_keywords.filter(kw => response.toLowerCase().includes(kw.toLowerCase()));
      const passed = found.length === 0;
      assertionResults.forbidden_keywords = { passed, found };
    }

    // contains_code assertion
    if (assertions.contains_code !== undefined) {
      const hasCode = response.includes('```');
      const passed = assertions.contains_code ? hasCode : !hasCode;
      assertionResults.contains_code = { passed, value: hasCode };
    }

    result.assertions = assertionResults;

    // Calculate overall pass/fail
    const allAssertionsPassed = Object.values(assertionResults).every(a => a.passed);
    result.passed = allAssertionsPassed;

    // Calculate score (0-1)
    const assertionCount = Object.keys(assertionResults).length;
    if (assertionCount > 0) {
      const passedCount = Object.values(assertionResults).filter(a => a.passed).length;
      result.score = passedCount / assertionCount;
    } else {
      result.score = 1; // No assertions = automatic pass
    }

  } catch (error) {
    result.error = error.message;
    result.duration_ms = Date.now() - startTime;
  }

  return result;
}

/**
 * Run all test cases against all configured models
 * @param {Object} testSuite - Test suite configuration
 * @param {string} skillMdContent - SKILL.md content
 * @param {Object} options - Run options
 * @returns {Promise<Object[]>} All test results
 */
export async function runTestSuite(testSuite, skillMdContent, options = {}) {
  const { cases, models = ['claude', 'qwen', 'ollama'], settings = {} } = testSuite;
  const { parallel = true, maxConcurrency = 5, timeout = 30000 } = settings;

  const allResults = [];

  // Get unique models
  const modelList = Array.isArray(models) ? models : [models];

  for (const modelConfig of modelList) {
    let adapter;
    try {
      adapter = getAdapter(modelConfig);
    } catch (error) {
      console.warn(`Skipping model ${typeof modelConfig === 'string' ? modelConfig : modelConfig.name}: ${error.message}`);
      continue;
    }

    if (!adapter.isReady()) {
      console.warn(`Skipping model ${adapter.name}: not configured (missing API key?)`);
      continue;
    }

    console.log(`\nRunning tests with model: ${adapter.name}`);

    if (parallel) {
      // Run test cases in parallel with concurrency limit
      const chunks = [];
      for (let i = 0; i < cases.length; i += maxConcurrency) {
        chunks.push(cases.slice(i, i + maxConcurrency));
      }

      for (const chunk of chunks) {
        const results = await Promise.all(
          chunk.map(tc => runTestCase(tc, adapter, skillMdContent, { timeout }))
        );
        allResults.push(...results);
      }
    } else {
      // Run sequentially
      for (const testCase of cases) {
        const result = await runTestCase(testCase, adapter, skillMdContent, { timeout });
        allResults.push(result);
      }
    }
  }

  return allResults;
}

/**
 * Save results to a session file
 * @param {Object[]} results - Test results
 * @param {string} skillName - Skill/package name
 * @returns {Object} Session info with paths
 */
export function saveResults(results, skillName) {
  const sessionsDir = path.join(process.cwd(), '.skiller', 'sessions');
  fs.mkdirSync(sessionsDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, -5);
  const sessionName = `${timestamp}`;

  const resultsPath = path.join(sessionsDir, `results-${sessionName}.json`);
  const resultsData = {
    skill: skillName,
    timestamp: new Date().toISOString(),
    results,
    summary: generateSummary(results)
  };

  fs.writeFileSync(resultsPath, JSON.stringify(resultsData, null, 2));

  // Update latest symlink (as JSON file copy)
  const latestPath = path.join(sessionsDir, 'latest.json');
  fs.writeFileSync(latestPath, JSON.stringify(resultsData, null, 2));

  return {
    sessionName,
    resultsPath,
    latestPath,
    sessionsDir
  };
}

/**
 * Generate summary statistics from results
 * @param {Object[]} results - Test results
 * @returns {Object} Summary stats
 */
export function generateSummary(results) {
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;
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

  // Calculate averages per model
  for (const model of Object.keys(byModel)) {
    const data = byModel[model];
    data.avgScore = data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length;
    delete data.scores;
  }

  return {
    total,
    passed,
    failed,
    avgScore: Math.round(avgScore * 100) / 100,
    passRate: Math.round((passed / total) * 100) / 100,
    byModel
  };
}
