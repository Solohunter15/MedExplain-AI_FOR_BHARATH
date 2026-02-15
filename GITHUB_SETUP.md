# GitHub Repository Setup Guide

## Prerequisites Installation

### 1. Install Git
**Download Git for Windows:**
- Visit: https://git-scm.com/download/win
- Download the installer
- Run the installer with default settings
- Restart your terminal after installation

**Verify Installation:**
```bash
git --version
```

### 2. Install Node.js (if not already done)
**Download Node.js:**
- Visit: https://nodejs.org/
- Download LTS version (18.x or higher)
- Run the installer
- Restart your terminal

**Verify Installation:**
```bash
node --version
npm --version
```

## GitHub Account Setup

### 1. Create GitHub Account
- Visit: https://github.com/signup
- Create your account
- Verify your email

### 2. Configure Git
```bash
# Set your name
git config --global user.name "Your Name"

# Set your email (use your GitHub email)
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main
```

### 3. Generate SSH Key (Recommended)
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Press Enter to accept default location
# Enter a passphrase (optional but recommended)

# Copy the public key
cat ~/.ssh/id_ed25519.pub
```

**Add SSH Key to GitHub:**
1. Go to GitHub Settings → SSH and GPG keys
2. Click "New SSH key"
3. Paste your public key
4. Click "Add SSH key"

## Repository Creation

### Option 1: Create on GitHub First (Recommended)

**Step 1: Create Repository on GitHub**
1. Go to https://github.com/new
2. Repository name: `medexplain-ai`
3. Description: `A next-generation, multilingual, voice-first healthcare intelligence platform`
4. Choose: Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

**Step 2: Initialize Local Repository**
```bash
# Navigate to your project directory
cd "D:\PROJECTS\amazon hackathon"

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: MedExplain AI healthcare platform

- Next.js 14 with TypeScript
- Multilingual support (English, Malayalam, Hindi)
- Voice-first interface with TTS/STT
- AI-powered medical analysis (Kimi AI)
- Blockchain verification (Polygon/Ethereum)
- End-to-end encryption
- Accessibility-first design
- HIPAA-compliant architecture"

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/medexplain-ai.git

# Or if using SSH:
git remote add origin git@github.com:YOUR_USERNAME/medexplain-ai.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Option 2: Use GitHub CLI

**Install GitHub CLI:**
- Visit: https://cli.github.com/
- Download and install

**Create and Push Repository:**
```bash
# Navigate to project directory
cd "D:\PROJECTS\amazon hackathon"

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: MedExplain AI healthcare platform"

# Create GitHub repository and push
gh repo create medexplain-ai --public --source=. --remote=origin --push

# Or for private repository:
gh repo create medexplain-ai --private --source=. --remote=origin --push
```

## Repository Configuration

### 1. Add Repository Description
On GitHub repository page:
- Click "⚙️ Settings"
- Add description: "A next-generation, multilingual, voice-first healthcare intelligence platform"
- Add website (if you have one)
- Add topics: `healthcare`, `ai`, `blockchain`, `accessibility`, `voice-interface`, `multilingual`, `nextjs`, `typescript`

### 2. Configure Branch Protection
Settings → Branches → Add rule:
- Branch name pattern: `main`
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

### 3. Enable GitHub Actions
Settings → Actions → General:
- ✅ Allow all actions and reusable workflows

### 4. Configure Security
Settings → Security:
- ✅ Enable Dependabot alerts
- ✅ Enable Dependabot security updates
- ✅ Enable secret scanning

### 5. Add Repository Secrets
Settings → Secrets and variables → Actions → New repository secret:
- `KIMI_AI_API_KEY`: Your Kimi AI API key
- `POLYGON_RPC_URL`: Polygon network RPC URL
- `ETHEREUM_RPC_URL`: Ethereum network RPC URL

## Project Documentation

### Update README.md
Replace `YOUR_USERNAME` in README.md with your actual GitHub username.

### Create GitHub Pages (Optional)
Settings → Pages:
- Source: Deploy from a branch
- Branch: `main` / `docs` folder
- Save

## Collaboration Setup

### 1. Add Collaborators
Settings → Collaborators → Add people

### 2. Create Issue Templates
Create `.github/ISSUE_TEMPLATE/` directory with templates:
- `bug_report.md`
- `feature_request.md`
- `security_vulnerability.md`

### 3. Create Pull Request Template
Create `.github/pull_request_template.md`

### 4. Add GitHub Actions Workflows
Create `.github/workflows/` directory with:
- `ci.yml` - Continuous Integration
- `deploy.yml` - Deployment
- `security.yml` - Security scanning

## Common Git Commands

### Daily Workflow
```bash
# Check status
git status

# Add files
git add .
git add specific-file.ts

# Commit changes
git commit -m "feat: add new feature"

# Push to GitHub
git push

# Pull latest changes
git pull

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Merge branch
git merge feature/new-feature

# Delete branch
git branch -d feature/new-feature
```

### Viewing History
```bash
# View commit history
git log

# View compact history
git log --oneline

# View changes
git diff

# View specific file history
git log -- path/to/file
```

### Undoing Changes
```bash
# Discard changes in working directory
git checkout -- file.ts

# Unstage file
git reset HEAD file.ts

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

## Troubleshooting

### Issue: Git not recognized
**Solution:** Install Git and restart terminal

### Issue: Permission denied (publickey)
**Solution:** Set up SSH key and add to GitHub

### Issue: Remote already exists
**Solution:** 
```bash
git remote remove origin
git remote add origin YOUR_REPO_URL
```

### Issue: Merge conflicts
**Solution:**
1. Open conflicted files
2. Resolve conflicts manually
3. `git add .`
4. `git commit -m "Resolve merge conflicts"`

### Issue: Large files
**Solution:** Use Git LFS for files > 50MB
```bash
git lfs install
git lfs track "*.pdf"
git add .gitattributes
```

## Next Steps

After setting up the repository:

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment**
   ```bash
   copy .env.example .env
   # Edit .env with your API keys
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Create First Issue**
   - Document any bugs or features
   - Use issue templates

5. **Invite Collaborators**
   - Add team members
   - Set up code review process

6. **Set Up CI/CD**
   - Configure GitHub Actions
   - Set up automated testing
   - Configure deployment

## Resources

- **Git Documentation**: https://git-scm.com/doc
- **GitHub Docs**: https://docs.github.com/
- **GitHub CLI**: https://cli.github.com/manual/
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf

## Support

If you encounter issues:
1. Check this guide
2. Search GitHub documentation
3. Ask in project discussions
4. Contact maintainers

---

**Ready to push your code to GitHub!** 🚀

Follow the steps above to create your repository and start collaborating.