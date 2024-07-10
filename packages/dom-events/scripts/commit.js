import inquirer from 'inquirer';
import { exec, execSync } from 'child_process';

const commitQuestions = [
    {
        type: 'list',
        name: 'type',
        message: 'Commit type:',
        choices: [
            'feat',
            'fix',
            'refactor',
            'test',
            'docs',
            'style',
            'chore',
            'revert',
        ],
        default: 'fix',
    },
    {
        type: 'input',
        name: 'message',
        message: 'Commit message:',
        when: (answers) => answers.type !== 'revert',
        validate: function (value) {
            if (!value.length) return 'Please enter a commit message.';
            const words = value.split(' ');
            return words.length > 4 ? true : 'Please enter a longer commit message.';
        },
    }
];

const gitAddQuestions = [
    {
        type: 'confirm',
        name: 'addChanges',
        message: 'You have untracked files. Do you want to add them?',
        default: true,
    }
]

exec('git ls-files --others --exclude-standard', async (err, stdout, stderr) => {
    if (err) {
        console.error('Error executing git ls-files:', err);
        return;
    }
    let shouldAddFiles = false;
    if (stdout) shouldAddFiles = await promptGitAdd();
    if (shouldAddFiles) performGitAdd();
    promptCommit();
});

function performGitAdd() {
    return execSync('git add .', (err, stdout, stderr) => {
        if (err) {
            console.error('Error executing git add:', err);
            return;
        }
    });
}

function promptGitAdd() {
    return inquirer.prompt(gitAddQuestions)
}

function promptCommit() {
    inquirer.prompt(commitQuestions).then(({ type, message }) => {
        console.log(`Executing git commit -m "${type}: ${message}"`);
        /* exec(`git commit -m "${type}: ${message}"`, (error) => {
            if (error) console.error(`Error executing git commit: ${error}`);
        }); */
    });
}
