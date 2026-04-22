# Contributing to react-unique-id-generator

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/react-unique-id-generator.git
   cd react-unique-id-generator
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/my-feature
   ```

## Development Workflow

### Building

```bash
npm run build
```

For development with watch mode:

```bash
npm run build:watch
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Code Quality

- Write **TypeScript** — all source code is in `lib/`
- Add **tests** for any new functionality in `tests/`
- Ensure **all tests pass** before submitting a PR
- Keep the bundle **zero-dependency** — do not add runtime dependencies

## Submitting Changes

### Pull Requests

1. Update your branch with the latest `main`:
   ```bash
   git fetch origin
   git rebase origin/main
   ```
2. Push your branch to your fork:
   ```bash
   git push origin feature/my-feature
   ```
3. Open a **Pull Request** against the `main` branch
4. Fill out the PR template and describe your changes
5. Wait for review — maintainers will provide feedback

### PR Guidelines

- Keep PRs **focused** — one feature or fix per PR
- Write a clear **title** and **description**
- Reference any related **issues** (e.g., `Closes #12`)
- Ensure CI checks pass

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add batch ID generation support
fix: handle negative values in setId
docs: update API reference for generateId
test: add edge case tests for resetId
chore: update build configuration
```

## Reporting Bugs

Use the [bug report template](https://github.com/riyajath-ahamed/react-unique-id-generator/issues/new?template=bug_report.md) and include:

- A clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Your environment (React version, Node version, bundler)

## Requesting Features

Use the [feature request template](https://github.com/riyajath-ahamed/react-unique-id-generator/issues/new?template=feature_request.md) and describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
