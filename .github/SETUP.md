# GitHub Actions CI/CD Pipeline Setup Guide

## 🚀 Overview

This comprehensive CI/CD pipeline includes:

1. **Code Quality & Security Checks**
2. **Backend Testing & Building**
3. **Frontend Testing & Building**
4. **Integration Tests**
5. **Performance Tests**
6. **Deploy to Staging**
7. **Deploy to Production**
8. **Post-Deployment Monitoring**

## 📋 Required GitHub Repository Settings

### 1. Repository Secrets

Navigate to your GitHub repository → Settings → Secrets and variables → Actions

#### Required Secrets:

**None required for basic GitHub Pages deployment!** 🎉

#### Optional Secrets (for enhanced features):

```bash
# Notification Services (Optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Database Configuration (for production deployments if using external DB)
PROD_MONGO_URL=mongodb://prod-user:prod-pass@prod-host:27017/proddb
STAGING_MONGO_URL=mongodb://staging-user:staging-pass@staging-host:27017/stagingdb

# API Keys for External Services (if used in your app)
OPENAI_API_KEY=your-openai-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### 2. Environment Configuration

Create environments in your repository:
- Go to Settings → Environments
- Create two environments: `staging` and `production`
- For `production` environment, add protection rules:
  - Required reviewers
  - Wait timer (optional)
  - Restrict to main branch

### 3. GitHub Pages Setup

1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` (will be created automatically)
4. Folder: `/` (root)

**Your app will be available at:**
- **Staging**: `https://yourusername.github.io/repository-name/staging/`
- **Production**: `https://yourusername.github.io/repository-name/`

## 🔧 Branch Protection Rules

Set up branch protection for `main` branch:

1. Go to Settings → Branches
2. Add rule for `main` branch:
   - Require a pull request before merging
   - Require status checks to pass before merging
   - Include these status checks:
     - `Code Quality & Security`
     - `Backend Testing & Building`
     - `Frontend Testing & Building`
     - `Integration Tests`
   - Restrict pushes that create files

## 📁 Local Development Setup

### Prerequisites

Ensure your local environment has these files:

```bash
# Backend Environment (.env)
backend/.env:
MONGO_URL=mongodb://localhost:27017/gamedb
DB_NAME=gamedb
SECRET_KEY=your-local-secret-key

# Frontend Environment (.env)
frontend/.env:
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Package Scripts

Add these scripts to your `package.json` files:

**Frontend** (`frontend/package.json`):
```json
{
  "scripts": {
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
    "test:coverage": "react-scripts test --coverage --watchAll=false"
  }
}
```

**Backend**: Update your requirements.txt to include testing dependencies:
```
pytest>=8.0.0
pytest-cov>=4.1.0
pytest-asyncio>=0.21.0
httpx>=0.25.0
black>=24.1.1
isort>=5.13.2
flake8>=7.0.0
mypy>=1.8.0
bandit>=1.7.5
```

## 🔄 Workflow Triggers

The pipeline runs on:

- **Push to `main`**: Full production deployment
- **Push to `develop`**: Staging deployment
- **Pull Requests**: Code quality and testing only
- **Manual trigger**: Via GitHub Actions UI
- **Schedule**: Security scans run weekly

## 📊 Monitoring and Notifications

### Built-in Monitoring

- **Code Coverage**: Reports uploaded to Codecov
- **Security Scans**: Results in GitHub Security tab
- **Performance**: Lighthouse reports
- **Dependencies**: Automated updates via Dependabot

### Custom Monitoring

Add your monitoring endpoints in the workflow:

```yaml
# In post-deployment-monitoring job
- name: Health Check Production
  run: |
    curl -f https://yourdomain.com/api/health || exit 1
```

## 🐛 Troubleshooting

### Common Issues

1. **Tests Failing**: 
   - Check if all test files exist
   - Verify environment variables are set correctly

2. **Build Failures**:
   - Ensure all dependencies are in requirements.txt/package.json
   - Check Node.js/Python versions match

3. **Deployment Issues**:
   - Verify GitHub Pages is enabled
   - Check domain configuration in repository secrets

4. **Docker Issues**:
   - Ensure Dockerfile exists in correct location
   - Check image registry permissions

### Debug Commands

Run these locally to test before pushing:

```bash
# Backend Testing
cd backend
python -m pytest tests/ -v --cov=.

# Frontend Testing  
cd frontend
yarn test --coverage --watchAll=false

# Code Quality
cd backend
black --check .
isort --check-only .
flake8 .

cd frontend
yarn lint
```

## 🚀 Getting Started

1. **Push to GitHub**: Commit all the workflow files to your repository
2. **Configure Secrets**: Add required secrets in GitHub Settings
3. **Set Up Environments**: Create staging and production environments
4. **Enable GitHub Pages**: Configure Pages in repository settings
5. **Create First PR**: Open a pull request to test the pipeline
6. **Monitor**: Check Actions tab for workflow status

## 📈 Advanced Features

### Custom Deployment Targets

Modify the deployment jobs to integrate with:
- **AWS S3/CloudFront**
- **Vercel**
- **Netlify**
- **Docker Registry**
- **Kubernetes**

### Additional Integrations

Add steps for:
- **Database Migrations**
- **CDN Cache Invalidation**
- **Search Index Updates**
- **Background Job Deployments**

## 🔒 Security Best Practices

1. **Never commit secrets** to the repository
2. **Use environment-specific secrets**
3. **Regularly rotate API keys**
4. **Review dependency updates** from Dependabot
5. **Monitor security scan results**

## 📞 Support

If you encounter issues:

1. Check the Actions tab for detailed logs
2. Verify all secrets are configured correctly
3. Ensure branch protection rules are set up
4. Review the workflow files for any customization needs

---

**Happy Deploying! 🎉**