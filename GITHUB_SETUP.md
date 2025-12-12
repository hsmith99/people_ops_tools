# GitHub Setup Instructions

Your repository is ready to be pushed to GitHub! Follow these steps:

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named `people_ops_tools` (or your preferred name)
3. **Do NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
cd /Users/harrison/people_ops_tools

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/people_ops_tools.git

# Rename main branch if needed
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under "Source", select:
   - **Branch**: `main` (or `master`)
   - **Folder**: `/ (root)`
4. Click **Save**

## Step 4: Access Your Documentation Site

After a few minutes, your site will be available at:
```
https://YOUR_USERNAME.github.io/people_ops_tools/
```

## Alternative: Manual GitHub Pages Setup

If you prefer not to use GitHub Actions:

1. Go to repository **Settings** → **Pages**
2. Under "Source", select:
   - **Deploy from a branch**
   - **Branch**: `main` (or `master`)
   - **Folder**: `/ (root)`
3. Click **Save**

## Updating the Site

To update the documentation site:

```bash
# Make your changes to files
git add -A
git commit -m "Update documentation"
git push
```

The site will automatically update within a few minutes.

## Troubleshooting

### Site not loading?
- Wait 5-10 minutes after first push (GitHub needs time to build)
- Check repository Settings → Pages to ensure it's enabled
- Verify the branch name matches (main vs master)

### Want to use a custom domain?
- Add a `CNAME` file with your domain name
- Configure DNS settings as GitHub instructs

## File Structure

Your repository includes:
- `index.html` - Main documentation site
- `Code.gs` - Apps Script code
- All `.md` documentation files
- Templates and guides

All files are ready to be viewed on GitHub Pages!

