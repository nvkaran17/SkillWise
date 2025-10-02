# Contributing to SkillWise

Thank you for your interest in contributing to SkillWise! We welcome contributions from the community and are grateful for your help in making this project better.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please treat all contributors and users with respect.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find that the issue has already been reported. When creating a bug report, please include:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** and what behavior you expected
- **Include screenshots** if applicable
- **Specify your environment** (OS, browser, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternatives** you've considered

### Pull Requests

1. **Fork the repository**
2. **Create a new branch** from `main`: `git checkout -b feature/your-feature-name`
3. **Make your changes** following our coding standards
4. **Add tests** for your changes if applicable
5. **Ensure all tests pass**
6. **Update documentation** as needed
7. **Commit your changes** with a clear commit message
8. **Push to your fork**: `git push origin feature/your-feature-name`
9. **Create a Pull Request**

### Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm run install-all`
3. Set up environment variables (see README.md)
4. Start development servers: `npm run dev`

### Coding Standards

- **JavaScript/JSX**: Follow ESLint configuration
- **CSS**: Use modern CSS features and maintain consistency
- **Commit Messages**: Use clear, descriptive commit messages
- **Code Comments**: Add comments for complex logic
- **File Naming**: Use consistent naming conventions

### Testing

- Write tests for new features
- Ensure existing tests pass
- Test on multiple browsers/devices
- Verify responsive design

### Documentation

- Update README.md if needed
- Add inline code comments
- Update API documentation
- Include examples for new features

## Project Structure Guidelines

### Frontend (`/frontend`)
- Components should be in `/src/components/`
- Each component should have its own CSS file
- Use React hooks and functional components
- Follow responsive design principles

### Backend (`/backend`)
- Routes should be in `/routes/`
- Controllers should be in `/controllers/`
- Middleware should be in `/middleware/`
- Utilities should be in `/utils/`

## Release Process

1. Version is updated in package.json
2. CHANGELOG.md is updated
3. Release notes are created
4. Tags are created for releases

## Questions?

If you have questions about contributing, please:

1. Check existing issues and documentation
2. Create a new issue with the "question" label
3. Reach out to maintainers

Thank you for contributing to SkillWise! 🚀