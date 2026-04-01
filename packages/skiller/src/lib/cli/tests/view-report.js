import { exec } from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { getLatestResults, getResultsBySession, generateReport, listSessions } from '../../core/reporter/index.js';

/**
 * Open a file in the default browser
 * @param {string} filePath - Path to file to open
 */
function openInBrowser(filePath) {
  const platform = os.platform();
  const openCmd = platform === 'win32' ? 'start' : platform === 'darwin' ? 'open' : 'xdg-open';
  
  // Convert to absolute path and handle Windows paths
  const absPath = path.resolve(filePath);
  const cmd = `${openCmd} "${absPath}"`;
  
  exec(cmd, (error) => {
    if (error) {
      console.error(`Failed to open browser: ${error.message}`);
      console.log(`Please open manually: ${absPath}`);
    }
  });
}

/**
 * View report command
 * @param {Object} options
 * @param {string} [options.session] - Session name/timestamp (optional, defaults to latest)
 */
export async function viewReport(options = {}) {
  const { session } = options;
  const sessionsDir = path.join(process.cwd(), '.skiller', 'sessions');

  if (!fs.existsSync(sessionsDir)) {
    console.error('No sessions directory found. Run "npx skiller test-skill" first.');
    process.exit(1);
  }

  let resultsData;

  if (session) {
    resultsData = getResultsBySession(sessionsDir, session);
    if (!resultsData) {
      console.error(`Session not found: ${session}`);
      console.log('Available sessions:');
      listSessions(sessionsDir).forEach(s => console.log(`  - ${s}`));
      process.exit(1);
    }
  } else {
    resultsData = getLatestResults(sessionsDir);
    if (!resultsData) {
      console.error('No latest results found. Run "npx skiller test-skill" first.');
      process.exit(1);
    }
  }

  // Generate HTML report if it doesn't exist
  const sessionName = path.basename(resultsData.resultsPath, '.json').replace('results-', '');
  const htmlPath = path.join(sessionsDir, `${sessionName}.html`);

  if (!fs.existsSync(htmlPath)) {
    console.log('Generating HTML report...');
    generateReport(resultsData, sessionsDir);
  }

  console.log(`\n📄 Opening report for session: ${sessionName}`);
  console.log(`   ${htmlPath}`);
  
  openInBrowser(htmlPath);
}
