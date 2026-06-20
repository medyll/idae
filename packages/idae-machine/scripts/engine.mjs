#!/usr/bin/env node
/**
 * engine.mjs — Internal script runner for bmad-method skill
 *
 * Usage:
 *   node engine.mjs <command> [args]
 *
 * ⚠️ INTERNAL COMMANDS ONLY — Not user-facing
 * These commands are invoked by the SKILL.md LLM layer, never directly by users.
 * User-facing commands use the `bmad-*` prefix (e.g. bmad-init, bmad-status).
 *
 * Commands:
 *   init [dir]             Create bmad/ project structure with all Chain Protocol fields
 *   update [dir]           Add missing Chain Protocol fields to existing status.yaml
 *   analyze [dir]          Scan project and generate/update status.yaml (preserves adrs + backlog)
 *   render [dir]           Render status.yaml as markdown — stdout only, no file written
 *   snapshot [dir]         Snapshot status.yaml to artifacts/history/
 *   connector [dir]        Generate bmad/artifacts/connector.yml
 *   config <action> [key]  Manage skill configuration (get/set/unset)
 *   install                Install required dependencies (js-yaml)
 *   repair                 Verify environment and fix issues
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------

class Bmad {
  constructor(cwd = process.cwd()) {
    this.cwd = cwd;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  log(tag, ...args) {
    console.log(`[bmad:${tag}]`, ...args);
  }

  err(tag, ...args) {
    console.error(`[bmad:${tag}]`, ...args);
  }

  pad(n) {
    return String(n).padStart(2, '0');
  }

  timestamp(d = new Date()) {
    return (
      `${d.getFullYear()}-${this.pad(d.getMonth() + 1)}-${this.pad(d.getDate())}` +
      `-${this.pad(d.getHours())}${this.pad(d.getMinutes())}${this.pad(d.getSeconds())}`
    );
  }

  dateStamp(d = new Date()) {
    return `${d.getFullYear()}-${this.pad(d.getMonth() + 1)}-${this.pad(d.getDate())}`;
  }

  bmadDir(override) {
    return override ? path.resolve(override) : path.join(this.cwd, 'bmad');
  }

  // ── YAML loader ─────────────────────────────────────────────────────────

  async loadYaml() {
    try {
      const require = createRequire(import.meta.url);
      return require('js-yaml');
    } catch {
      throw new Error('js-yaml not found — run: node engine.mjs install');
    }
  }
 




  // ── YAML parsers ────────────────────────────────────────────────────────

  parsePhase(content, YAML) {
    try {
      const data = YAML.load(content);
      if (data?.phases?.length) {
        const cur =
          data.phases.find(p => p.status === 'in_progress') ||
          data.phases.find(p => p.status !== 'upcoming') ||
          data.phases[0];
        return cur?.name ? String(cur.name) : 'Unknown';
      }
      if (typeof data?.phase === 'string') return data.phase;
      if (data?.phase?.name) return data.phase.name;
    } catch {}
    const m = content.match(/-\s*name:\s*(.+)\r?\n\s*status:\s*in_progress/);
    return m ? m[1].trim() : 'Unknown';
  }

  parseProgress(content, YAML) {
    try {
      const data = YAML.load(content);
      if (data?.progress != null) {
        return typeof data.progress === 'number' ? data.progress : Number(String(data.progress).replace(/\D/g, '')) || null;
      }
    } catch {}
    const m = content.match(/progress:\s*(\d{1,3})/);
    return m ? Number(m[1]) : null;
  }

  parseQaBugs(content, YAML) {
    try {
      const data = YAML.load(content);
      if (data?.qa?.bugs) {
        return Array.isArray(data.qa.bugs)
          ? data.qa.bugs.map(String)
          : String(data.qa.bugs).split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
      }
    } catch {}
    return [];
  }

  parseNextAction(content, YAML) {
    try {
      const data = YAML.load(content);
      if (data?.next_action) return String(data.next_action);
    } catch {}
    const m = content.match(/next_action:\s*["|']?([^"|'\n]+)["|']?/);
    return m ? m[1].trim() : null;
  }

  // ── Commands ────────────────────────────────────────────────────────────

  /**
   * init — create bmad/ project structure
   * Workspace-first: checks for canonical template before using default
   */
  async init(bmadDirOverride) {
    const dir = this.bmadDir(bmadDirOverride);

    try {
      await fs.access(path.join(dir, 'status.yaml'));
      this.log('init', `bmad/ already exists at ${dir}`);
      console.log('Use `bmad-rebuild` to refresh status from existing code.');
      return;
    } catch {}

    const artifactsDirs = [
      path.join(dir, 'artifacts', 'stories'),
      path.join(dir, 'artifacts', 'docs'),
      path.join(dir, 'artifacts', 'history'),
    ];

    for (const d of artifactsDirs) {
      await fs.mkdir(d, { recursive: true });
    }

    const projectName = path.basename(this.cwd);

    // Canonical template lives inside the skill: templates/status-template.yaml
    const canonicalTemplate = path.join(__dirname, '..', 'templates', 'status-template.yaml');
    let statusYamlContent = '';
    let templateSource = 'default';

    try {
      await fs.access(canonicalTemplate);
      let templateContent = await fs.readFile(canonicalTemplate, 'utf8');
      const today = this.dateStamp();
      statusYamlContent = templateContent
        .replace(/\{\{project_name\}\}/g, projectName)
        .replace(/\{\{date\}\}/g, today);
      templateSource = 'canonical';
      this.log('init', `using canonical template from ${path.relative(this.cwd, canonicalTemplate)}`);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        this.log('init', `template read error: ${err.message}`);
      }
      templateSource = 'default';
    }

    if (templateSource === 'default') {
      // Fallback to default template
      statusYamlContent = `# BMAD Status — ${projectName}
# This file is the single source of truth for project state.

project: ${projectName}
phase: planning
progress: 0
next_action: "Create a PRD with bmad plan prd"
next_command: "bmad plan prd"
next_role: "pm"
active_role: "pm"

phases:
  - name: planning
    status: in_progress
  - name: development
    status: upcoming
  - name: testing
    status: upcoming
  - name: release
    status: upcoming

artifacts: {}

sprints: []
`;
      this.log('init', 'no canonical template found, using default');
    }

    const configYaml = `# BMAD Config — ${projectName}

name: ${projectName}
created: "${new Date().toISOString()}"
stack: []
`;

    await fs.writeFile(path.join(dir, 'status.yaml'), statusYamlContent, 'utf8');
    await fs.writeFile(path.join(dir, 'config.yaml'), configYaml, 'utf8');

    this.log('init', `created bmad/ structure at ${path.relative(this.cwd, dir)}/`);
    console.log(`  - status.yaml (project state + Chain Protocol fields) [from ${templateSource} template]`);
    console.log('  - config.yaml (project settings)');
    console.log('  - artifacts/ (output directory)');
    if (templateSource === 'default') {
      console.log('\n💡 Tip: Copy the canonical template for future projects:');
      console.log(`   cp ${path.join('workspace', 'templates', 'bmad', 'status-template.yaml')} <project>/bmad/status.yaml`);
    }
    console.log('\nNext step: bmad plan prd');
  }

  /**
   * update — add missing Chain Protocol fields to existing status.yaml
   * Preserves all existing content, only adds next_command, next_role, active_role if missing
   */
  async update(bmadDirOverride) {
    const YAML = await this.loadYaml();
    const dir = this.bmadDir(bmadDirOverride);
    const statusPath = path.join(dir, 'status.yaml');

    let content;
    try {
      content = await fs.readFile(statusPath, 'utf8');
    } catch {
      throw new Error(`No status.yaml found at ${statusPath}. Run \`bmad init\` to create a new project.`);
    }

    let data;
    try {
      data = YAML.load(content);
    } catch (e) {
      throw new Error(`Failed to parse status.yaml: ${e.message}`);
    }

    let updated = false;

    // Add missing Chain Protocol fields
    if (!data.next_command) {
      data.next_command = 'bmad plan prd';
      updated = true;
    }
    if (!data.next_role) {
      data.next_role = 'pm';
      updated = true;
    }
    if (!data.active_role) {
      data.active_role = data.next_role || 'pm';
      updated = true;
    }

    if (updated) {
      try {
        await fs.writeFile(statusPath, YAML.dump(data, { lineWidth: 120 }), 'utf8');
        this.log('update', `added missing Chain Protocol fields to status.yaml`);
        console.log(`  - next_command: ${data.next_command}`);
        console.log(`  - next_role: ${data.next_role}`);
        console.log(`  - active_role: ${data.active_role}`);
      } catch (e) {
        throw new Error(`Failed to write status.yaml: ${e.message}`);
      }
    } else {
      this.log('update', 'status.yaml already has all Chain Protocol fields');
    }
  }

  /**
   * analyze — scan project and generate/update status.yaml
   * Preserves existing adrs + backlog from prior status.yaml
   */
  async analyze(bmadDirOverride) {
    const YAML = await this.loadYaml();
    const dir = this.bmadDir(bmadDirOverride);
    const statusPath = path.join(dir, 'status.yaml');
    const info = await this.analyzeProject();

    // Preserve adrs + backlog from existing yaml before overwriting
    let existingAdrs = null;
    let existingBacklog = null;
    try {
      const existing = YAML.load(await fs.readFile(statusPath, 'utf8'));
      if (existing?.adrs?.length) existingAdrs = existing.adrs;
      if (existing?.backlog?.length) existingBacklog = existing.backlog;
    } catch { /* no existing file — fine */ }

    await fs.mkdir(path.join(dir, 'artifacts'), { recursive: true });

    // Determine phase heuristically
    let phase = 'planning';
    let progress = 0;
    let nextAction = 'Create a PRD with bmad plan prd';
    let nextCommand = 'bmad plan prd';
    let nextRole = 'pm';

    if (info.hasSrc) {
      phase = 'development';
      progress = 30;
      nextAction = 'Review code and create sprint with bmad sprint';
      nextCommand = 'bmad sprint';
      nextRole = 'scrum';
    }
    if (info.hasTests) {
      progress = 50;
      nextAction = 'Run tests with bmad test unit';
      nextCommand = 'bmad test unit';
      nextRole = 'tester';
    }

    // Check for existing artifacts
    const hasArtifacts = {};
    for (const name of ['prd.md', 'architecture.md', 'tech-spec.md']) {
      try {
        await fs.access(path.join(dir, 'artifacts', name));
        hasArtifacts[name.replace('.md', '')] = 'done';
      } catch {
        hasArtifacts[name.replace('.md', '')] = 'missing';
      }
    }

    const projectName = info.projectName || path.basename(this.cwd);
    const today = this.dateStamp();

    const adrsBlock = existingAdrs
      ? `\nadrs:\n${existingAdrs.map(a =>
          `  - id: "${a.id}"\n    title: "${a.title}"\n    status: ${a.status}\n    decision: "${a.decision}"`
        ).join('\n')}\n`
      : '';

    const backlogBlock = existingBacklog
      ? `\nbacklog:\n${existingBacklog.map(b =>
          b.priority === 'done' || b.priority === 'obsolete'
            ? `  - { id: "${b.id}", priority: ${b.priority}, title: "${b.title}" }`
            : `  - id: "${b.id}"\n    title: "${b.title}"\n    priority: ${b.priority}${b.description ? `\n    description: "${b.description}"` : ''}`
        ).join('\n')}\n`
      : '';

    const statusYaml = `# BMAD Status — ${projectName}
# Auto-generated by bmad analyze

project: ${projectName}
phase: ${phase}
progress: ${progress}
next_action: "${nextAction}"
next_command: "${nextCommand}"
next_role: "${nextRole}"
active_role: "${nextRole}"
last_updated: "${today}"

detected:
  languages: [${Array.from(info.languages).map(l => `"${l}"`).join(', ')}]
  has_package_json: ${info.hasPackageJson}
  has_requirements_txt: ${info.hasRequirements}
  has_src: ${info.hasSrc}
  has_tests: ${info.hasTests}
  install_command: "${info.installCommand || 'N/A'}"
  run_command: "${info.runCommand || 'N/A'}"
  test_command: "${info.testCommand || 'N/A'}"
  top_dependencies: [${info.dependencies.slice(0, 8).map(d => `"${d}"`).join(', ')}]

phases:
  - name: planning
    status: ${phase === 'planning' ? 'in_progress' : 'done'}
  - name: development
    status: ${phase === 'development' ? 'in_progress' : 'upcoming'}
  - name: testing
    status: upcoming
  - name: release
    status: upcoming

marketing:
  - "Project initialized — status auto-detected"

product:
  - "Phase detected: ${phase} (${progress}%)"

far_vision:
  - "To be defined during planning phase"

artifacts:
${Object.entries(hasArtifacts).map(([k, v]) => `  ${k}: ${v}`).join('\n')}

sprints: []
${adrsBlock}${backlogBlock}`;

    this.log('analyze', `wrote status.yaml for "${projectName}"`);
    if (existingAdrs) this.log('analyze', `preserved ${existingAdrs.length} ADR(s)`);
    if (existingBacklog) this.log('analyze', `preserved ${existingBacklog.length} backlog item(s)`);
    console.log(`  Phase: ${phase} | Progress: ${progress}%`);
    console.log(`  Languages: ${Array.from(info.languages).join(', ') || 'unknown'}`);
    console.log(`  Next: ${nextAction}`);
    console.log(`  Chain: next_command="${nextCommand}" next_role="${nextRole}"`);
  }

  /**
   * render — render status.yaml as markdown to stdout (no file written)
   * Used by bmad-status short-circuit — replaces status.md
   */
  async render(bmadDirOverride) {
    const YAML = await this.loadYaml();
    const dir = this.bmadDir(bmadDirOverride);
    const statusPath = path.join(dir, 'status.yaml');

    let content;
    try {
      content = await fs.readFile(statusPath, 'utf8');
    } catch {
      throw new Error(`No status.yaml at ${statusPath}. Run bmad init first.`);
    }

    const d = YAML.load(content);
    const bars = Math.round((d.progress || 0) / 10);
    const bar = '█'.repeat(bars) + '░'.repeat(10 - bars);

    const lines = [
      `# ${d.project} — Status`,
      '',
      `> Phase: **${d.phase}** | Progress: [${bar}] ${d.progress || 0}%`,
      `> Last updated: ${d.last_updated || '—'} | Active role: ${d.active_role || '—'}`,
      '',
      '## Chain Protocol',
      '',
      `- **Next action:** ${d.next_action || '—'}`,
      `- **Next command:** \`${d.next_command || '—'}\``,
      `- **Next role:** ${d.next_role || '—'}`,
      '',
    ];

    if (d.phases?.length) {
      lines.push('## Phases', '');
      for (const p of d.phases) {
        const icon = p.status === 'done' ? '✅' : p.status === 'in_progress' ? '🔨' : '⬚';
        lines.push(`  ${icon} ${p.name}`);
      }
      lines.push('');
    }

    if (d.sprints?.length) {
      lines.push('## Sprints', '');
      for (const s of d.sprints) {
        const icon = s.status === 'completed' ? '✅' : s.status === 'in_progress' ? '🔨' : '⬚';
        const done = s.stories?.filter(st => st.status === 'done' || st.status === 'complete').length || 0;
        const total = s.stories?.length || 0;
        lines.push(`  ${icon} Sprint ${s.id}: ${s.goal || ''} (${done}/${total} stories)`);
        if (s.stories?.length) {
          for (const st of s.stories) {
            const si = st.status === 'done' || st.status === 'complete' ? '✅' : st.status === 'in_progress' ? '🔨' : '⬚';
            lines.push(`      ${si} ${st.id}: ${st.title}`);
          }
        }
      }
      lines.push('');
    }

    const activeBacklog = d.backlog?.filter(b => b.priority !== 'done' && b.priority !== 'obsolete');
    if (activeBacklog?.length) {
      lines.push('## Backlog', '');
      for (const b of activeBacklog) {
        lines.push(`  - **${b.id}** [${b.priority}] ${b.title}${b.description ? ' — ' + b.description : ''}`);
      }
      lines.push('');
    }

    if (d.adrs?.length) {
      lines.push('## Architecture Decisions', '');
      for (const a of d.adrs) {
        const icon = a.status === 'accepted' ? '✅' : a.status === 'proposed' ? '🔲' : '🚫';
        lines.push(`  ${icon} **${a.id}** ${a.title} — ${a.decision}`);
      }
      lines.push('');
    }

    if (d.marketing?.length) {
      lines.push('## Marketing', '');
      for (const m of d.marketing) lines.push(`  - ${m}`);
      lines.push('');
    }
    if (d.product?.length) {
      lines.push('## Product', '');
      for (const p of d.product) lines.push(`  - ${p}`);
      lines.push('');
    }
    if (d.far_vision?.length) {
      lines.push('## Far Vision', '');
      for (const f of d.far_vision) lines.push(`  - ${f}`);
      lines.push('');
    }

    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('  bmad continue   — execute next step');
    lines.push('  bmad test       — run tests');
    lines.push('  bmad audit      — code quality');
    lines.push('  bmad doc        — generate docs');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    console.log(lines.join('\n'));
  }

  /**
   * status — read and display status.yaml
   */
  async status(bmadDirOverride) {
    const YAML = await this.loadYaml();
    const dir = this.bmadDir(bmadDirOverride);
    const statusPath = path.join(dir, 'status.yaml');

    let content;
    try {
      content = await fs.readFile(statusPath, 'utf8');
    } catch {
      throw new Error(`No status.yaml found at ${statusPath}. Run \`bmad init\` or \`bmad analyze\` first.`);
    }

    const data = YAML.load(content);
    const phase = this.parsePhase(content, YAML);
    const progress = this.parseProgress(content, YAML);
    const nextAction = this.parseNextAction(content, YAML);
    const bugs = this.parseQaBugs(content, YAML);

    console.log(`\n[bmad] Project: ${data?.project || path.basename(this.cwd)}`);
    console.log(`  Phase:    ${phase}`);
    console.log(`  Progress: ${progress != null ? progress + '%' : 'unknown'}`);
    if (nextAction) console.log(`  Next:     ${nextAction}`);
    if (bugs.length) console.log(`  Bugs:     ${bugs.join(', ')}`);

    // Show artifacts summary
    if (data?.artifacts && typeof data.artifacts === 'object') {
      const entries = Object.entries(data.artifacts).filter(([, v]) => v && v !== 'missing');
      if (entries.length) {
        console.log(`  Artifacts: ${entries.map(([k, v]) => `${k}(${v})`).join(', ')}`);
      }
    }

    // Show sprints summary
    if (data?.sprints?.length) {
      console.log(`  Sprints:  ${data.sprints.length} defined`);
    }

    console.log('');
  }

  /**
   * next — show the next recommended action from status.yaml
   */
  async next(bmadDirOverride) {
    const YAML = await this.loadYaml();
    const dir = this.bmadDir(bmadDirOverride);
    const statusPath = path.join(dir, 'status.yaml');

    let content;
    try {
      content = await fs.readFile(statusPath, 'utf8');
    } catch {
      throw new Error(`No status.yaml found. Run bmad init first.`);
    }

    const nextAction = this.parseNextAction(content, YAML);
    const phase = this.parsePhase(content, YAML);
    const progress = this.parseProgress(content, YAML);

    console.log(`\n[bmad] Phase: ${phase} | Progress: ${progress != null ? progress + '%' : '?'} | Next: ${nextAction || 'unknown'}`);
    if (nextAction) {
      console.log(`  Next action: ${nextAction}`);
    } else {
      console.log(`  No explicit next action defined in status.yaml.`);
      console.log(`  Suggestion: run bmad status for full overview.`);
    }
    console.log('');
  }

  /**
   * config — manage skill reference overrides
   * Stored in the skill's own references/overrides.json
   *
   * Supported keys:
   *   theme              Path to project CSS theme file
   *   role.<name>.ref    Extra reference file for a role
   *   role.<name>.prompt Additional prompt/context for a role
   */
  async configCmd(action, key, value) {
    const overridesPath = path.join(__dirname, '..', 'references', 'overrides.json');

    // Load existing overrides
    let overrides = {};
    try {
      overrides = JSON.parse(await fs.readFile(overridesPath, 'utf8'));
    } catch {}

    if (action === 'get') {
      if (key) {
        const val = this.getNestedKey(overrides, key);
        if (val !== undefined) {
          console.log(`${key} = ${typeof val === 'object' ? JSON.stringify(val, null, 2) : val}`);
        } else {
          console.log(`${key} is not set`);
        }
      } else {
        if (Object.keys(overrides).length === 0) {
          console.log('No overrides configured.');
        } else {
          console.log(JSON.stringify(overrides, null, 2));
        }
      }
      return;
    }

    if (action === 'set') {
      if (!key || value === undefined) {
        throw new Error('Usage: bmad config set <key> <value>');
      }
      // Resolve relative paths to absolute for file references
      let resolvedValue = value;
      if (key === 'theme' || key.endsWith('.ref')) {
        const absPath = path.resolve(this.cwd, value);
        try {
          await fs.access(absPath);
          resolvedValue = absPath;
        } catch {
          throw new Error(`File not found: ${absPath}`);
        }
      }
      this.setNestedKey(overrides, key, resolvedValue);
      await fs.writeFile(overridesPath, JSON.stringify(overrides, null, 2), 'utf8');
      this.log('config', `set ${key} = ${resolvedValue}`);
      return;
    }

    if (action === 'unset') {
      if (!key) {
        throw new Error('Usage: bmad config unset <key>');
      }
      this.deleteNestedKey(overrides, key);
      await fs.writeFile(overridesPath, JSON.stringify(overrides, null, 2), 'utf8');
      this.log('config', `unset ${key}`);
      return;
    }

    throw new Error(`Unknown config action: ${action}. Usage: bmad config <get|set|unset> [key] [value]`);
  }

  // Helpers for nested dot-notation keys (e.g. "role.designer.ref")
  getNestedKey(obj, key) {
    return key.split('.').reduce((o, k) => o?.[k], obj);
  }

  setNestedKey(obj, key, value) {
    const parts = key.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]] || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
  }

  deleteNestedKey(obj, key) {
    const parts = key.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]]) return;
      cur = cur[parts[i]];
    }
    delete cur[parts[parts.length - 1]];
  }

  /**
   * install — install required npm dependencies
   */
  async install() {
    this.log('install', 'installing dependencies');
    for (const pkg of ['js-yaml']) {
      this.log('install', `installing ${pkg}...`);
      let res = spawnSync('npm', ['install', pkg, '--no-audit', '--no-fund'], {
        stdio: 'inherit',
        cwd: __dirname,
        shell: true,
      });
      if (res.status !== 0) {
        this.err('install', `failed in ${__dirname}; trying project root`);
        res = spawnSync('npm', ['install', pkg, '--no-audit', '--no-fund'], {
          stdio: 'inherit',
          cwd: this.cwd,
          shell: true,
        });
        if (res.status !== 0) {
          throw new Error(`Failed to install ${pkg}`);
        }
      }
    }
    this.log('install', 'done');
  }

  /**
   * repair — ensure the script environment is healthy
   */
  async repair() {
    this.log('repair', 'running environment repair');

    try {
      await fs.access(path.join(this.cwd, 'package.json'));
    } catch {
      this.err('repair', 'no package.json in cwd — run from project root');
    }

    try {
      const require = createRequire(import.meta.url);
      require('js-yaml');
      this.log('repair', 'yaml dependency present (skipping install)');
    } catch {
      await this.install();
      try {
        await this.loadYaml();
        this.log('repair', 'yaml dependency installed successfully');
      } catch {
        throw new Error('yaml check failed');
      }
    }

    this.log('repair', 'repair complete');
  }

  /**
   * snapshot — save a timestamped copy of status.yaml
   */
  async snapshot(bmadDirOverride) {
    const dir = this.bmadDir(bmadDirOverride);
    const statusPath = path.join(dir, 'status.yaml');
    const historyDir = path.join(dir, 'artifacts', 'history');

    try {
      await fs.access(statusPath);
    } catch {
      throw new Error(`status.yaml not found at ${statusPath}`);
    }

    const content = await fs.readFile(statusPath, 'utf8');
    const now = new Date();
    const ts = this.timestamp(now);
    const outPath = path.join(historyDir, `status-${ts}.md`);

    await fs.mkdir(historyDir, { recursive: true });

    const md = [
      `# Status Snapshot — ${ts}`,
      ``,
      `> **Source:** \`bmad/status.yaml\`  `,
      `> **Captured:** ${now.toISOString()}`,
      ``,
      '```yaml',
      content.trimEnd(),
      '```',
      ``,
    ].join('\n');

    await fs.writeFile(outPath, md, 'utf8');
    this.log('snapshot', 'saved ->', path.relative(this.cwd, outPath));
  }

  /**
   * connector — generate bmad/artifacts/connector.yml
   */
  async connector(bmadDirOverride) {
    const YAML = await this.loadYaml();
    const dir = this.bmadDir(bmadDirOverride);
    const artifactsDir = path.join(dir, 'artifacts');
    const outPath = path.join(artifactsDir, 'connector.yml');

    let config = {};
    let status = {};
    try { config = YAML.load(await fs.readFile(path.join(dir, 'config.yaml'), 'utf8')) || {}; } catch {}
    try { status = YAML.load(await fs.readFile(path.join(dir, 'status.yaml'), 'utf8')) || {}; } catch {}

    const scan = async (subdir, ext = '.md') => {
      try {
        const files = await fs.readdir(path.join(artifactsDir, subdir));
        return files.filter(f => f.endsWith(ext));
      } catch { return []; }
    };

    const [stories, history] = await Promise.all([
      scan('stories'),
      scan('history', '.md'),
    ]);

    const connector = {
      meta: {
        generated: new Date().toISOString(),
        bmad_version: '5.0.0',
        project: config.name || path.basename(this.cwd),
        root: 'bmad/',
      },
      dictionary: {
        keywords: {
          story:     'Atomic dev task. ID pattern: S{sprint}-{seq:02d}.',
          sprint:    'Time-boxed work batch. ID pattern: sprint-{N}.',
          prd:       'Product Requirements Document.',
          arch:      'Architecture document.',
          audit:     'Codebase analysis report.',
          connector: 'This file. Machine-readable project manifest.',
        },
        rules: [
          'Story IDs follow pattern S{sprint_number}-{sequence:02d} (e.g. S1-03).',
          'Sprint files are named sprint-{N}.md.',
          'All text artifacts are written in English.',
          'status.yaml is the single source of truth for project phase state.',
        ],
        naming: {
          story:   'S{sprint}-{seq:02d}',
          sprint:  'sprint-{N}',
          audit:   'audit-{YYYY-MM-DD}',
          history: 'status-{YYYYMMDDTHHmmss}',
        },
      },
      architecture: [
        {
          path: 'bmad/',
          description: 'BMAD project root',
          children: [
            { path: 'config.yaml',  type: 'file', description: 'Project metadata' },
            { path: 'status.yaml',  type: 'file', description: 'Current phase and progress' },
            {
              path: 'artifacts/',
              type: 'dir',
              description: 'All generated project artifacts',
              children: [
                { path: 'connector.yml',    type: 'file', description: 'Auto-discovery manifest' },
                { path: 'prd.md',           type: 'file', status: status?.artifacts?.prd ?? 'unknown' },
                { path: 'tech-spec.md',     type: 'file', status: status?.artifacts?.['tech-spec'] ?? 'unknown' },
                { path: 'architecture.md',  type: 'file', status: status?.artifacts?.architecture ?? 'unknown' },
                { path: 'stories/',  type: 'dir', pattern: 'S{sprint}-{seq}.md', entries: stories },
                { path: 'history/',  type: 'dir', pattern: 'status-{timestamp}.md', entries: history },
              ],
            },
          ],
        },
      ],
    };

    await fs.mkdir(artifactsDir, { recursive: true });
    const header = [
      '# BMAD Auto-Discovery Connector',
      `# Generated: ${connector.meta.generated}`,
      '# Do not edit manually — regenerate with: node engine.mjs connector',
      '',
    ].join('\n');
    await fs.writeFile(outPath, header + YAML.dump(connector, { lineWidth: 120 }), 'utf8');
    this.log('connector', 'written ->', path.relative(this.cwd, outPath));
  }

  /**
   * generateReadme — create README template in project's bmad/artifacts/docs/
   */
  async generateReadme() {
    try {
      const templatesDir = path.join(__dirname, '..', 'references', 'readme-templates');
      const files = {
        simple: path.join(templatesDir, 'README.simple.md'),
        intermediate: path.join(templatesDir, 'README.intermediate.md'),
        advanced: path.join(templatesDir, 'README.advanced.md'),
      };

      const projectName = path.basename(this.cwd);

      const readTemplate = async (p) => {
        try { return await fs.readFile(p, 'utf8'); } catch { return ''; }
      };

      const tplSimple = await readTemplate(files.simple);
      const tplInter = await readTemplate(files.intermediate);
      const tplAdv = await readTemplate(files.advanced);

      const normalize = (tpl) => {
        let s = tpl || '';
        s = s.replace(/{{project_name}}/g, projectName).replace(/{{project_dir}}/g, this.cwd);
        s = s.replace(/^#\s.*\r?\n/, '');
        return s.trim();
      };

      const bodySimple = normalize(tplSimple);
      const bodyInter = normalize(tplInter);
      const bodyAdv = normalize(tplAdv);

      // Write to project's bmad/artifacts/docs/, NOT back into the skill folder
      const outDir = path.join(this.cwd, 'bmad', 'artifacts', 'docs');
      await fs.mkdir(outDir, { recursive: true });
      const outPath = path.join(outDir, 'README.template.md');

      const parts = [
        `# ${projectName}`,
        '',
        `> Auto-generated README template — includes three progressive levels: Simple, Intermediate, Advanced.`,
        '',
        '## Simple',
        '',
        bodySimple || '_No simple template available._',
        '',
        '---',
        '',
        '## Intermediate',
        '',
        bodyInter || '_No intermediate template available._',
        '',
        '---',
        '',
        '## Advanced',
        '',
        bodyAdv || '_No advanced template available._',
        '',
        '---',
        '',
        'Generated by BMAD',
      ].join('\n');

      await fs.writeFile(outPath, parts, 'utf8');
      this.log('readme', `wrote template -> ${path.relative(this.cwd, outPath)}`);
    } catch (err) {
      this.err('readme', 'failed to generate README:', err.message);
      throw err;
    }
  }

  /**
   * analyzeProject — collect basic project facts
   */
  async analyzeProject() {
    const info = {
      projectName: path.basename(this.cwd),
      languages: new Set(),
      hasPackageJson: false,
      hasRequirements: false,
      hasSrc: false,
      hasTests: false,
      installCommand: null,
      runCommand: null,
      testCommand: null,
      dependencies: [],
      packageScripts: {},
      description: null,
    };

    try {
      const pj = JSON.parse(await fs.readFile(path.join(this.cwd, 'package.json'), 'utf8'));
      info.hasPackageJson = true;
      info.languages.add('JavaScript/Node');
      info.description = pj.description || null;
      info.packageScripts = pj.scripts || {};
      if (pj.dependencies) info.dependencies = Object.keys(pj.dependencies).slice(0, 10);
      if (info.packageScripts.start) info.runCommand = 'npm start';
      else if (info.packageScripts.dev) info.runCommand = 'npm run dev';
      else if (pj.main) info.runCommand = `node ${pj.main}`;
      info.installCommand = 'npm install';
    } catch {}

    try {
      const req = await fs.readFile(path.join(this.cwd, 'requirements.txt'), 'utf8');
      info.hasRequirements = true;
      info.languages.add('Python');
      info.installCommand = info.installCommand || 'pip install -r requirements.txt';
      const deps = req.split(/\r?\n/).map(s => s.trim()).filter(Boolean).slice(0, 20);
      info.dependencies = info.dependencies.length ? info.dependencies.concat(deps) : deps;
    } catch {}

    try { await fs.access(path.join(this.cwd, 'src')); info.hasSrc = true; } catch {}
    try { await fs.access(path.join(this.cwd, 'tests')); info.hasTests = true; } catch {}
    try { await fs.access(path.join(this.cwd, 'test')); info.hasTests = true; } catch {}

    if (!info.testCommand) {
      if (info.packageScripts?.test) info.testCommand = 'npm test';
      else if (info.hasTests) info.testCommand = 'run your test suite (see tests/)';
    }

    return info;
  }

  /**
   * fillReadmeDraft — fill template with project analysis
   */
  async fillReadmeDraft() {
    try {
      const templatePath = path.join(this.cwd, 'bmad', 'artifacts', 'docs', 'README.template.md');
      const fallback = path.join(__dirname, '..', 'references', 'readme-template.md');
      let tpl;
      try { tpl = await fs.readFile(templatePath, 'utf8'); } catch {}
      if (!tpl) {
        try { tpl = await fs.readFile(fallback, 'utf8'); } catch {}
      }
      if (!tpl) {
        tpl = `# {{project_name}}\n\n## Installation\n\n\`\`\`\n<install-command>\n\`\`\`\n\n## Usage\n\n\`\`\`\n<example-command>\n\`\`\`\n`;
        this.log('readme', 'no template available, using minimal inline template');
      }

      const info = await this.analyzeProject();

      tpl = tpl.replace(/{{project_name}}/g, info.projectName || path.basename(this.cwd));
      tpl = tpl.replace(/{{project_dir}}/g, this.cwd);

      const installCmd = info.installCommand || '<install-command>';
      const runCmd = info.runCommand || '<run-command>';
      const exampleCmd = runCmd || (info.testCommand || '<example-command>');

      tpl = tpl.replace(/<install-command>/g, installCmd);
      tpl = tpl.replace(/<run-command>/g, runCmd);
      tpl = tpl.replace(/<example-command>/g, exampleCmd);

      const analysis = [
        '', '---', '',
        '## Auto Analysis', '',
        `- Detected languages: ${Array.from(info.languages).join(', ') || 'unknown'}`,
        `- Has package.json: ${info.hasPackageJson}`,
        `- Has requirements.txt: ${info.hasRequirements}`,
        `- Has src/: ${info.hasSrc}`,
        `- Has tests/: ${info.hasTests}`,
        `- Install command: ${installCmd}`,
        `- Run command: ${runCmd}`,
        `- Test command: ${info.testCommand || 'none detected'}`,
      ];

      if (info.dependencies.length) analysis.push(`- Top dependencies: ${info.dependencies.slice(0, 10).join(', ')}`);
      if (info.description) analysis.push('', `## Project Description`, '', info.description);

      const out = tpl + '\n' + analysis.join('\n');
      const outDir = path.join(this.cwd, 'bmad', 'artifacts', 'docs');
      await fs.mkdir(outDir, { recursive: true });
      const outPath = path.join(outDir, 'README.draft.md');
      await fs.writeFile(outPath, out, 'utf8');
      this.log('readme', `wrote draft -> ${path.relative(this.cwd, outPath)}`);
      return outPath;
    } catch (err) {
      this.err('readme', 'failed to fill draft:', err.message);
      throw err;
    }
  }
}

// ── Command Parser ──────────────────────────────────────────────────────────
// Internal commands only — no natural language variations needed

function parseCommand(rawInput) {
  const cmd = rawInput[0]?.toLowerCase();
  if (!cmd) return null;
  return cmd;
}

// ── CLI entry point ─────────────────────────────────────────────────────────

const raw = process.argv.slice(2);
const bmad = new Bmad();

const commands = {
  init:      (a) => bmad.init(a[0]),
  update:    (a) => bmad.update(a[0]),
  status:    (a) => bmad.status(a[0]),
  next:      (a) => bmad.next(a[0]),
  analyze:   (a) => bmad.analyze(a[0]),
  render:    (a) => bmad.render(a[0]),
  install:   () => bmad.install(),
  repair:    () => bmad.repair(),
  snapshot:  (a) => bmad.snapshot(a[0]),
  connector: (a) => bmad.connector(a.find(x => !x.startsWith('--'))),
  config:    (a) => bmad.configCmd(a[0], a[1], a[2]),
};

if (!raw.length) {
  console.error(`Usage: node engine.mjs <command> [args]\nCommands: ${Object.keys(commands).join(', ')}`);
  process.exit(1);
}

const cmd = parseCommand(raw);
const args = raw.slice(1);

if (!cmd || !commands[cmd]) {
  console.error(`Unknown command: ${raw[0]}\nAvailable: ${Object.keys(commands).join(', ')}`);
  process.exit(1);
}

commands[cmd](args).catch(e => { console.error(e); process.exit(1); });
