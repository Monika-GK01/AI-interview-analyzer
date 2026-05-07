# Contributing to AI Interview Emotion Analyzer

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 🎯 Ways to Contribute

- **Code**: Implement features, fix bugs, improve performance
- **Documentation**: Improve guides, add examples, fix typos
- **Design**: Improve UI/UX, create mockups
- **Testing**: Write tests, report bugs, test features
- **Ideas**: Suggest features, provide feedback

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/ai-interview-analyzer.git
cd ai-interview-analyzer
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

### 3. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

## 📝 Development Guidelines

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check linting
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Commit Messages

Follow conventional commits format:

```
feat: add interview pause functionality
fix: resolve transcript saving issue
docs: update deployment guide
style: format button component
refactor: simplify analysis processor
test: add filler word detection tests
chore: update dependencies
```

### TypeScript

- Always use TypeScript, never `any` unless absolutely necessary
- Define interfaces for all data structures
- Use proper type imports

```typescript
// Good
import type { Interview } from '@/types/interview'

// Avoid
import { Interview } from '@/types/interview'
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

```typescript
// Good
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  onClick: () => void
  children: React.ReactNode
}

export default function Button({ variant = 'primary', onClick, children }: ButtonProps) {
  // Component logic
}
```

### File Organization

- Place files in appropriate directories
- Use index files for cleaner imports
- Keep related files together

```
components/
  interview/
    WebcamCapture.tsx
    AudioRecorder.tsx
    index.ts  // Export all components
```

### Naming Conventions

- **Components**: PascalCase (`Button.tsx`)
- **Utilities**: camelCase (`format.ts`)
- **Hooks**: camelCase with `use` prefix (`useInterview.ts`)
- **Types**: PascalCase (`Interview`, `AnalysisData`)
- **Constants**: UPPER_SNAKE_CASE (`FILLER_WORDS`)

## 🧪 Testing

### Manual Testing

Before submitting a PR:

1. Test your changes locally
2. Test on different screen sizes
3. Test in different browsers (Chrome, Firefox, Safari)
4. Check for console errors
5. Verify database operations work

### Automated Testing (Future)

We plan to add:
- Unit tests with Jest
- Integration tests
- E2E tests with Playwright

## 📋 Pull Request Process

### 1. Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass (when available)
- [ ] No console errors or warnings
- [ ] Documentation updated if needed
- [ ] Commit messages follow convention
- [ ] Branch is up to date with main

### 2. Submit PR

1. Push your branch to your fork
2. Open a Pull Request on GitHub
3. Fill out the PR template
4. Link related issues

### 3. PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

### 4. Review Process

- Maintainers will review your PR
- Address any requested changes
- Once approved, PR will be merged

## 🐛 Reporting Bugs

### Before Reporting

1. Check if bug already reported
2. Try to reproduce consistently
3. Test on latest version

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

**Additional context**
Any other relevant information
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
What you want to happen

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Mockups, examples, etc.
```

## 🎯 Priority Areas

### High Priority (Help Needed!)

1. **Interview Session Implementation**
   - Webcam capture component
   - Audio recorder component
   - Speech recognition integration
   - Live transcript display

2. **Report Page**
   - Analysis charts (Recharts)
   - Metrics visualization
   - Recommendations generation

3. **Testing**
   - Unit tests for analysis algorithms
   - Integration tests for API routes
   - E2E tests for user flows

### Medium Priority

1. **Mobile Optimization**
   - Responsive design improvements
   - Touch interactions
   - Mobile-specific features

2. **Performance**
   - Code splitting
   - Image optimization
   - Database query optimization

3. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

### Low Priority

1. **Advanced Features**
   - Video recording
   - AI question generation
   - Team features

2. **Integrations**
   - Calendar integration
   - Email notifications
   - Social auth providers

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Project Docs
- `README.md` - Project overview
- `PROJECT_ARCHITECTURE.md` - Architecture details
- `IMPLEMENTATION_ROADMAP.md` - Implementation guide
- `GETTING_STARTED.md` - Setup instructions

### Code Examples
- `EXAMPLE_INTERVIEW_SESSION.md` - Interview feature example
- Existing components in `components/` directory

## 🤝 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Other unprofessional conduct

## 💬 Communication

### Questions?

- **General questions**: Open a GitHub Discussion
- **Bug reports**: Open a GitHub Issue
- **Feature requests**: Open a GitHub Issue
- **Security issues**: Email (add your email)

### Response Time

- We aim to respond within 48 hours
- PRs reviewed within 1 week
- Issues triaged within 3 days

## 🏆 Recognition

Contributors will be:
- Listed in README.md
- Credited in release notes
- Mentioned in project updates

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Every contribution, no matter how small, is valuable and appreciated. Thank you for helping make this project better!

---

**Questions?** Open an issue or discussion on GitHub.

**Ready to contribute?** Pick an issue labeled `good first issue` or `help wanted`!
