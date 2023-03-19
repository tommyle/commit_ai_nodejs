import * as fs from 'fs/promises';
import * as childProcess from 'child_process';
import axios from 'axios';
import { ArgumentParser } from 'argparse';

const apiKeyFilePath = '.commit_ai_api_key';

(async () => {
    await checkGitInstallation();

    const parser = new ArgumentParser({
        description: 'Git Commit Message AI',
    });

    parser.add_argument('--set_api_key', { help: 'Set a new OpenAI API key', action: 'store_true' });
    parser.add_argument('--show_diff', { help: 'Show the git diff output', action: 'store_true' });

    const args = parser.parse_args();

    if (args.set_api_key) {
        await setApiKey();
    } else {
        const apiKey = await getApiKey();

        if (!apiKey) {
            console.error('Error: No API key found. Please set an API key using the --set_api_key option.');
            process.exit(1);
        }

        const gitDiffOutput = await getGitDiff();

        if (args.show_diff) {
            console.log(`Git diff output:\n${gitDiffOutput}`);
        }

        if (gitDiffOutput.trim().length === 0) {
            console.log("No changes found. Don't forget to stage your changes!");
        } else {
            const commitMessage = await generateCommitMessage(gitDiffOutput, apiKey);
            console.log(`Generated commit message: ${commitMessage}`);
            await commitChanges(commitMessage);
        }
    }
    process.exit(1);
})();

async function checkGitInstallation() {
    try {
        const gitVersionResult = childProcess.execSync('git --version').toString();
        if (!gitVersionResult) {
            throw new Error('Git not found');
        }
    } catch (e) {
        console.error('Error: Git is not installed or not found in your system\'s PATH.');
        process.exit(1);
    }
}

async function setApiKey() {
    const apiKey = await new Promise < string > ((resolve) => {
        process.stdin.setEncoding('utf8');
        process.stdout.write('Enter your OpenAI API key: ');
        process.stdin.once('data', (data) => resolve(data.toString().trim()));
    });

    if (apiKey) {
        await fs.writeFile(apiKeyFilePath, apiKey);
        console.log('API key saved successfully.');
    } else {
        console.error('Error: Invalid API key. Please try again.');
    }
}

async function getApiKey(): Promise<string | null> {
    try {
        const apiKey = await fs.readFile(apiKeyFilePath, 'utf8');
        return apiKey.trim();
    } catch (e) {
        return null;
    }
}

async function getGitDiff(): Promise<string> {
    return childProcess.execSync('git diff --cached').toString();
}

async function generateCommitMessage(diff: string, apiKey: string): Promise<string> {
    const url = 'https://api.openai.com/v1/engines/text-davinci-003/completions';

    try {
        const response = await axios.post(
            url,
            {
                prompt: `Generate a git commit message for this diff:\n${diff}\n`,
                max_tokens: 50,
                n: 3,
                stop: null,
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            }
        );

        const choices = response.data.choices;

        console.log('Generated commit messages:');
        for (let i = 0; i < choices.length; i++) {
            console.log(`${i + 1}: ${choices
            [i].text.trim()}`);
        }

        let selectedIndex: number;
        do {
            selectedIndex = parseInt(await new Promise < string > ((resolve) => {
                process.stdout.write(`Select a commit message (1-${choices.length}): `);
                process.stdin.once('data', (data) => resolve(data.toString().trim()));
            }), 10);
        } while (isNaN(selectedIndex) || selectedIndex < 1 || selectedIndex > choices.length);

        const selectedCommitMessage = choices[selectedIndex - 1].text.trim();
        return selectedCommitMessage;
    } catch (error) {
        console.error(`Error: Failed to generate commit message.Status code: ${ error.response.status }`);
        console.error(error.response.data);
        process.exit(1);
    }
}

async function commitChanges(commitMessage: string) {
    try {
        childProcess.execSync(`git commit -a -m "${commitMessage}"`);
        console.log('Changes committed successfully.');
    } catch (e) {
        
        console.error(`Error: Failed to commit changes.\n${ e.stderr }`);
    }
}