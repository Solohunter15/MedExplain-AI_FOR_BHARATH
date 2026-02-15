# Contributing to MedExplain AI

Thank you for your interest in contributing to MedExplain AI! We're building a platform to make healthcare accessible to everyone, especially underserved populations.

## 🌟 How to Contribute

### Reporting Bugs
1. Check if the bug has already been reported in [Issues](https://github.com/YOUR_USERNAME/medexplain-ai/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, Node version)

### Suggesting Features
1. Check existing [Issues](https://github.com/YOUR_USERNAME/medexplain-ai/issues) and [Discussions](https://github.com/YOUR_USERNAME/medexplain-ai/discussions)
2. Create a new issue with:
   - Clear use case
   - How it benefits users (especially accessibility)
   - Proposed implementation (optional)

### Code Contributions

#### Getting Started
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/medexplain-ai.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Make your changes
6. Test thoroughly
7. Commit with clear messages
8. Push to your fork
9. Create a Pull Request

#### Development Guidelines

**Code Style**
- Follow the existing code style
- Use TypeScript for type safety
- Write meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

**Accessibility Requirements**
- All features must be keyboard accessible
- Maintain WCAG 2.1 AA compliance
- Test with screen readers
- Ensure touch targets are at least 44x44px
- Support voice navigation where applicable

**Security Requirements**
- Never commit API keys or secrets
- Follow HIPAA compliance guidelines
- Encrypt sensitive data
- Validate all user inputs
- Log security-relevant events

**Testing**
- Write unit tests for new features
- Test on multiple browsers
- Test on mobile devices
- Test with assistive technologies
- Verify multilingual support

**Commit Messages**
Follow conventional commits:
```
feat: add prescription analysis feature
fix: resolve voice recognition bug
docs: update API documentation
style: format code with prettier
refactor: simplify encryption service
test: add tests for upload component
chore: update dependencies
```

#### Pull Request Process
1. Update README.md if needed
2. Update documentation
3. Ensure all tests pass
4. Request review from maintainers
5. Address review feedback
6. Squash commits if requested

## 🎯 Priority Areas

We especially welcome contributions in:
- **Accessibility**: Improving features for elderly and low-literacy users
- **Localization**: Adding support for more languages
- **Voice Interface**: Enhancing voice recognition and synthesis
- **Security**: Strengthening encryption and privacy features
- **Performance**: Optimizing for low-bandwidth connections
- **Documentation**: Improving guides and tutorials

## 📋 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors, regardless of age, body size, disability, ethnicity, gender identity, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards
**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what's best for the community
- Showing empathy towards others

**Unacceptable behavior includes:**
- Harassment, trolling, or discriminatory comments
- Publishing others' private information
- Any conduct that could be considered inappropriate in a professional setting

### Enforcement
Violations may result in temporary or permanent ban from the project. Report issues to the maintainers.

## 🏥 Healthcare-Specific Guidelines

### Medical Accuracy
- Always include disclaimers that AI analysis is not medical advice
- Recommend consulting healthcare professionals
- Cite sources for medical information
- Be cautious with health recommendations

### Privacy & Compliance
- Follow HIPAA guidelines for US healthcare data
- Comply with GDPR for EU users
- Never log or store sensitive medical information unnecessarily
- Implement proper data retention policies

### Cultural Sensitivity
- Respect diverse cultural approaches to healthcare
- Use culturally appropriate language and imagery
- Consider regional healthcare practices
- Avoid assumptions about health literacy

## 🚀 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Modern browser with Web Speech API support

### Environment Setup
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/medexplain-ai.git
cd medexplain-ai

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure your API keys in .env

# Start development server
npm run dev
```

### Project Structure
See [structure.md](.kiro/steering/structure.md) for detailed project organization.

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

## 📚 Resources

- [Requirements Document](requirements.md)
- [Design System](design.md)
- [Product Overview](.kiro/steering/product.md)
- [Tech Stack](.kiro/steering/tech.md)
- [Project Structure](.kiro/steering/structure.md)

## 💬 Communication

- **Issues**: Bug reports and feature requests
- **Discussions**: General questions and ideas
- **Pull Requests**: Code contributions
- **Email**: [Your contact email]

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for helping make healthcare accessible to everyone! 🏥💚