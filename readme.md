# Commit AI

A command-line application built with Node.js that generates git commit messages using OpenAI's GPT-3 model. This app runs git diff in the current working directory, sends the output to the GPT-3 model, and presents multiple commit message suggestions. The user can then choose a message, and the app will commit the changes using the selected message.

## Prerequisites

- Node.js (latest version): https://nodejs.org/en/download/
- A valid OpenAI API key: https://beta.openai.com/signup/

## Installation

1. Clone the repository:

```bash
git clone https://github.com/tommyle/commit_ai_nodejs.git
```

2. Change to the cloned directory:

```bash
cd commit_ai_nodejs
```

3. Install dependencies:

```bash
npm install
```

## Usage

1. Set your OpenAI API key:

```bash
npm run build-and-run --set_api_key
```

   You'll be prompted to enter your API key, which will be saved to a local file for future use.

2. Run the app to generate a commit message and commit the changes:

```bash
npm run start app.js
```

   The app will display multiple commit message suggestions based on the `git diff` output. Choose a message and the app will commit the changes using the selected message.

### Optional arguments

- `--help` or `-h`: Display help information.

```bash
npm run start app.js --help
```

- `--show_diff` or `-d`: Show the git diff output.

```bash
npm run start app.js --show_diff
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.