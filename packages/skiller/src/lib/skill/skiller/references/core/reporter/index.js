import fs from 'fs';
import path from 'path';

/**
 * Generate HTML report from results data
 * @param {Object} resultsData - Results data from test run
 * @param {string} sessionsDir - Sessions directory
 * @returns {string} Path to generated HTML report
 */
export function generateReport(resultsData, sessionsDir) {
  const templatePath = path.join(path.dirname(import.meta.url.replace('file://', '')), 'template.html');
  let template = fs.readFileSync(templatePath, 'utf8');

  // Replace placeholders
  template = template.replace(/{{SKILL_NAME}}/g, resultsData.skill);
  template = template.replace(/{{TIMESTAMP}}/g, resultsData.timestamp);
  template = template.replace(/{{RESULTS_JSON}}/g, JSON.stringify(resultsData));
  template = template.replace(/{{SUMMARY.TOTAL}}/g, resultsData.summary.total);
  template = template.replace(/{{SUMMARY.PASSED}}/g, resultsData.summary.passed);
  template = template.replace(/{{SUMMARY.FAILED}}/g, resultsData.summary.failed);
  template = template.replace(/{{SUMMARY.PASS_RATE}}/g, resultsData.summary.passRate);
  template = template.replace(
    /{{SUMMARY.PASS_RATE_CLASS}}/g,
    resultsData.summary.passRate >= 80 ? 'text-green-600' : resultsData.summary.passRate < 50 ? 'text-red-600' : 'text-yellow-600'
  );

  // Generate HTML filename
  const sessionName = path.basename(resultsData.resultsPath, '.json').replace('results-', '');
  const htmlPath = path.join(sessionsDir, `${sessionName}.html`);

  fs.writeFileSync(htmlPath, template, 'utf8');

  // Also update latest.html
  const latestHtmlPath = path.join(sessionsDir, 'latest_report.html');
  fs.writeFileSync(latestHtmlPath, template, 'utf8');

  return htmlPath;
}

/**
 * Get latest results from sessions directory
 * @param {string} sessionsDir - Sessions directory
 * @returns {Object|null} Latest results data or null
 */
export function getLatestResults(sessionsDir) {
  const latestPath = path.join(sessionsDir, 'latest.json');
  if (!fs.existsSync(latestPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(latestPath, 'utf8'));
}

/**
 * Get results by session name
 * @param {string} sessionsDir - Sessions directory
 * @param {string} sessionName - Session name/timestamp
 * @returns {Object|null} Results data or null
 */
export function getResultsBySession(sessionsDir, sessionName) {
  const resultsPath = path.join(sessionsDir, `results-${sessionName}.json`);
  if (!fs.existsSync(resultsPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
}

/**
 * List all available sessions
 * @param {string} sessionsDir - Sessions directory
 * @returns {string[]} List of session names
 */
export function listSessions(sessionsDir) {
  if (!fs.existsSync(sessionsDir)) {
    return [];
  }
  return fs.readdirSync(sessionsDir)
    .filter(f => f.startsWith('results-') && f.endsWith('.json'))
    .map(f => f.replace('results-', '.json').replace('.json', ''))
    .sort()
    .reverse();
}
