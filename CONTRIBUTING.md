# Contributing to LogPose Token

## 👋 Welcome

Thank you for considering contributing to LogPose Token! This document provides guidelines and instructions for contributing to our project.

## 📜 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

1. Be respectful and inclusive
2. Focus on the project's goals
3. Maintain professional communication
4. Follow security best practices

## 🚀 Getting Started

### Prerequisites

1. Node.js (>= 18.0.0)
2. npm (>= 9.0.0)
3. Git

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/LogPoseToken.git
   cd LogPoseToken
   ```
3. Install dependencies:
   ```bash
   npm install
   cd frontend
   npm install
   ```
4. Create environment file:
   ```bash
   cp .env.example .env
   # Edit .env with your development values
   ```

## 🛠️ Development Workflow

### Branching Strategy

- `main` - production code
- `develop` - development code
- `feature/*` - new features
- `fix/*` - bug fixes
- `docs/*` - documentation updates

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes:
   - Follow code style guidelines
   - Add tests for new features
   - Update documentation

3. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: description of your changes"
   ```

4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Create a Pull Request

### Commit Message Format

Follow the Conventional Commits specification:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

### Pull Request Process

1. Update documentation
2. Add tests if needed
3. Update CHANGELOG.md
4. Get review from maintainers
5. Address review comments
6. Wait for approval

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test
npm test test/LogPoseToken.test.ts

# Run coverage
npm run coverage
```

### Writing Tests

1. Place tests in the `test/` directory
2. Name test files `*.test.ts`
3. Use descriptive test names
4. Include positive and negative cases
5. Test edge cases

## 📝 Documentation

### Code Documentation

- Use JSDoc for JavaScript/TypeScript
- Use NatSpec for Solidity
- Keep comments clear and concise
- Update README.md when needed

### API Documentation

- Document all public functions
- Include parameter descriptions
- Provide usage examples
- Note any limitations

## 🔒 Security

### Security Guidelines

1. Never commit sensitive data
2. Use environment variables
3. Follow security best practices
4. Report security issues privately

### Reporting Security Issues

Email: security@logpose.io

## 🏷️ Release Process

1. Update version number
2. Update CHANGELOG.md
3. Create release notes
4. Tag the release
5. Deploy to testnet
6. Verify deployment
7. Deploy to mainnet

## ❓ Getting Help

- Create an issue
- Join our Discord
- Email: dev@logpose.io

## 📋 Issue Templates

### Bug Report Template
```markdown
**Description:**
[Clear description of the bug]

**Steps to Reproduce:**
1. [First Step]
2. [Second Step]
3. [And so on...]

**Expected Result:**
[What you expected to happen]

**Actual Result:**
[What actually happened]

**Environment:**
- OS:
- Node version:
- npm version:
- Contract address:
```

### Feature Request Template
```markdown
**Feature Description:**
[Clear description of the proposed feature]

**Problem it Solves:**
[What problem does this solve?]

**Proposed Solution:**
[Your suggested implementation]

**Additional Context:**
[Any other relevant information]
```

## 🎨 Style Guide

### Solidity Style Guide

- Follow Solidity style guide
- Use latest stable version
- Include NatSpec comments
- Follow gas optimization practices

### TypeScript Style Guide

- Use TypeScript strict mode
- Follow ESLint configuration
- Use async/await
- Proper error handling

### React/Next.js Style Guide

- Functional components
- React hooks
- Proper prop types
- Component documentation

## 🌟 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in documentation

---

Thank you for contributing to LogPose Token! 🚀
