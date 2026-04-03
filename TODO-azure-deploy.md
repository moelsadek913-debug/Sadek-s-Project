# Azure Deployment TODO

## Completed:
- [x] Created `.github/workflows/azure-static-web-apps.yml` with azure/login equivalent (built-in to static-web-apps-deploy) and build/deploy.

## Next:
1. Create Azure Static Web App:
   - Go to https://portal.azure.com > Create resource > Web > Static Web App (preview)
   - Source: GitHub, authorize repo `YOUR_USERNAME/AUC-Frontend-Final-Submition` (adjust path)
   - Branch: main
   - App location: /
   - Output location: dist
   - Create > Copy the generated **CLIENT_SECRET** 
2. In GitHub repo: Settings > Secrets and variables > Actions > New repository secret
   - Name: `AZURE_STATIC_WEB_APP_NAME_xxxx_CLIENT_SECRET` (match Azure name)
   - Secret: paste client secret
3. Commit/push this workflow: `git add .github/workflows/azure-static-web-apps.yml && git commit -m "Add Azure Static Web Apps workflow" && git push origin main`
4. Deployment auto-starts (check GitHub Actions tab or Azure portal)

## Verify:
- Build works: `ng build --configuration production`
- Deploy URL from Azure portal.

App ready! Buffer warning ignorable (Node 20+ in workflow).

