const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process'); 

const scriptPath = __dirname;
const monorepoPath = path.resolve(scriptPath, '..');
const monorepoName = "idae monorepo";
const monorepoDescription = "This monorepo centralizes all core components needed to develop Idae applications for web, mobile, or desktop platforms.";
const githubBaseUrl = 'https://github.com/medyll/idae/tree/main/';
/**
 * Retrieves repository information from the given repository path.
 *
 * @param {string} repoPath - The path to the repository.
 * @returns {Object|null} An object containing repository information or null if the package.json file does not exist.
 * @returns {string} return.name - The name of the repository.
 * @returns {string} return.description - The description of the repository.
 * @returns {string} return.version - The version of the repository.
 * @returns {string|null} return.changelog - The latest changelog entry or null if the changelog file does not exist.
 * @returns {string} return.changelogPath - The path to the changelog file.
 * @returns {string} return.changelogLink - The GitHub link to the changelog.
 * @returns {string} return.githubLink - The GitHub link to the repository.
 */
function getRepoInfo(repoPath) {
    const packageJsonPath = path.join(repoPath, 'package.json');
    const changelogPath = path.join(repoPath, 'CHANGELOG.md');

    if (!fs.existsSync(packageJsonPath)) {
        return null;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const repoInfo = {
        name: packageJson.name,
        description: packageJson.description,
        version: packageJson.version,
        changelog: null,
        changelogPath: fs.existsSync(changelogPath) ? changelogPath : null,
        changelogLink: githubBaseUrl + path.relative(monorepoPath, changelogPath).replace(/\\/g, '/'),
        githubLink: githubBaseUrl + path.relative(monorepoPath, repoPath).replace(/\\/g, '/')
    };

    if (fs.existsSync(changelogPath)) {
        const changelogContent = fs.readFileSync(changelogPath, 'utf8');
        const changelogLines = changelogContent.split('\n');
        const lastChangelogEntry = changelogLines.slice(0, changelogLines.indexOf('##', 1)).join('\n');
        repoInfo.changelog = lastChangelogEntry;
    }

    return repoInfo;
}

/**
 * Lists the repositories in a monorepo based on the workspaces defined in the monorepo's package.json.
 *
 * @returns {Array<Object>} An array of repository information objects.
 * @throws {Error} If the monorepo's package.json file is not found.
 */
function listMonorepo() {
    const monorepoPackageJsonPath = path.join(monorepoPath, 'package.json');
 
    if (!fs.existsSync(monorepoPackageJsonPath)) {
        throw new Error('Monorepo package.json not found');
    }

    const monorepoPackageJson = JSON.parse(fs.readFileSync(monorepoPackageJsonPath, 'utf8'));
    const workspaces = monorepoPackageJson.workspaces || [];

    const repos = workspaces.flatMap(workspace => {
        // Remove trailing '*' if present
        const cleanedWorkspace = workspace.replace(/\/\*$/, '');
        const workspacePath = path.join(monorepoPath, cleanedWorkspace);
    
        if (!fs.existsSync(workspacePath)) {
            return [];
        }
        return fs.readdirSync(workspacePath).map(repo => path.join(cleanedWorkspace, repo));
    }).filter(repo => {
        const repoPath = path.join(monorepoPath, repo);
        return fs.statSync(repoPath).isDirectory();
    });
 

    const repoInfos = repos.map(repo => {
        const repoPath = path.join(monorepoPath, repo);
        return getRepoInfo(repoPath);
    }).filter(info => info !== null);

  
    return repoInfos;
}

function listPackageNames() {
    const repoInfos = listMonorepo();
    let packageNamesContent = '## Packages\n\n';

    repoInfos.forEach(info => {
        packageNamesContent += `- [${info.name}](${info.githubLink})\n`;
    });

    return packageNamesContent;
}

function generateReadme() {
    const repoInfos = listMonorepo();
    let readmeContent = `# ${monorepoName}\n\n${monorepoDescription}\n`;

    readmeContent += listPackageNames() + '\n';

    readmeContent += '## Details\n\n';
    repoInfos.forEach(info => {
        readmeContent += `### ${info.name}\n`; 
        if (info?.description) {
            readmeContent += `${info.description}\n\n`;  
        }
        readmeContent += `**Repo:** [${info.name}](${info.githubLink})\n\n`;
        readmeContent += `**Version:** ${info.version}`;
        if (info.changelogPath) {
            readmeContent += ` [see changelog](${info.changelogLink})\n`;
        }
        readmeContent += `\n##\n`;
    });

    const readmePath = path.join(monorepoPath, 'README.md');
    if (fs.existsSync(readmePath)) {
        const currentContent = fs.readFileSync(readmePath, 'utf8');
        if (currentContent === readmeContent) {
            console.log('README.md is up-to-date. No changes made.');
            return;
        }
    }

    fs.writeFileSync(readmePath, readmeContent, 'utf8');
    console.log('README.md has been updated.');

    // Commit changes with --amend
    try {
        execSync('git add README.md');
        execSync('git commit --amend --no-edit');
        console.log('README.md changes have been amended to the last commit.');
    } catch (error) {
        console.error('Error during git amend operation:', error.message);
    }
}

generateReadme();