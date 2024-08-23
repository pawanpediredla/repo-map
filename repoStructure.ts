import * as fs from 'fs-extra';
import * as path from 'path';
import simpleGit from 'simple-git';

const git = simpleGit();

async function cloneRepo(repoUrl: string, cloneDir: string): Promise<void> {
    console.log(`Cloning repository from ${repoUrl} into ${cloneDir}...`);
    await git.clone(repoUrl, cloneDir);
}

function printDirectoryStructure(rootDir: string, prefix: string = ''): void {
    const entries = fs.readdirSync(rootDir);

    entries.forEach(entry => {
        const fullPath = path.join(rootDir, entry);
        if (fs.statSync(fullPath).isDirectory()) {
            console.log(`${prefix}├── ${entry}/`);
            printDirectoryStructure(fullPath, prefix + '│   ');
        } else {
            console.log(`${prefix}├── ${entry}`);
        }
    });
}

async function main(repoUrl: string, cloneDir: string = 'repo_clone'): Promise<void> {
    await cloneRepo(repoUrl, cloneDir);
    console.log('\nRepository Structure:');
    printDirectoryStructure(cloneDir);
}

// Entry point of the script
const args = process.argv.slice(2);
if (args.length !== 1) {
    console.error('Usage: ts-node repoStructure.ts <repository-url>');
    process.exit(1);
}

const repoUrl = args[0];
main(repoUrl).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
