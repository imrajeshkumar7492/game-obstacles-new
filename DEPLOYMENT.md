# GitHub Pages Deployment Configuration

This repository is configured to deploy to GitHub Pages using the **default GitHub Pages URL** format:

## Default URLs
- **Production**: `https://imrajeshkumar7492.github.io/game-obstacles-new/`
- **Staging**: `https://imrajeshkumar7492.github.io/game-obstacles-new/staging/`

## Configuration Details

### Custom Domain Removal
This repository has been specifically configured to **remove any custom domain** configuration and use the standard GitHub Pages hosting:

1. **Workflow Configuration**: The GitHub Actions workflow (`.github/workflows/simple-deploy.yml`) includes steps to:
   - Remove any CNAME files before and after build
   - Explicitly disable custom domain with `cname: false`
   - Output the correct default GitHub Pages URLs

2. **Build Process**: The build process ensures no custom domain files are included in the deployment

### Deployment Process

1. **Automatic Deployment**: 
   - Push to `main` branch → Production deployment
   - Push to `develop` branch → Staging deployment

2. **Manual Deployment**: Use workflow dispatch in GitHub Actions

### Repository Settings

To ensure the default GitHub Pages URL is used:

1. Go to repository **Settings** → **Pages**
2. Set **Source** to "Deploy from a branch"
3. Select **Branch**: `gh-pages`
4. **Remove any custom domain** if present in the settings
5. Save changes

### Troubleshooting

If the custom domain `freejobalerts.me` still appears:

1. **Check Repository Settings**: Go to Settings → Pages and remove any custom domain
2. **Re-run Deployment**: Trigger a new deployment via GitHub Actions
3. **Clear DNS Cache**: The old domain may be cached

### Workflow Features

- ✅ Removes CNAME files automatically
- ✅ Disables custom domain configuration
- ✅ Builds with optimized settings
- ✅ Deploys to correct GitHub Pages URLs
- ✅ Provides clear deployment information

---

**Note**: This configuration specifically prevents custom domain usage and ensures the app is hosted at the standard GitHub Pages URL.