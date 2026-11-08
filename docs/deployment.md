## 🚀 Vercel Deployment Checklist

This checklist covers the essential steps for a smooth production deployment on Vercel, referencing common pre-deployment considerations for environment variables and build configurations.

### 1. Environment Variables

Set these in your Vercel project settings under **Settings > Environment Variables**.

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `/api` | **Required.** Points to the internal mock API. |
| `NEXT_PUBLIC_APP_NAME` | `TQMS-Pulse` | Optional. Used in metadata. |

### 2. Build & Development Settings

- **Framework Preset:** Next.js (auto-detected).
- **Build Command:** `next build` (default).
- **Output Directory:** `.next` (default).
- **Install Command:** `npm install` (default).
- **Node.js Version:** 20.x.

### 3. Pre-Deployment Checks

Before pushing to your production branch (`main`), verify the following:

- [ ] `npm run build` completes successfully in your local environment.
- [ ] `npx tsc --noEmit` passes with zero TypeScript errors.
- [ ] `npm run lint` passes with no errors.
- [ ] The application runs correctly in a local production build (`npm run build && npm start`).
- [ ] All secret or environment-specific values are **not** hard-coded in the source.

### 4. Deployment Steps

1. Commit your final changes and push to your connected GitHub repository.
2. Vercel will automatically trigger a new deployment.
3. Monitor the build logs for any errors.
4. Once deployed, Vercel will provide a unique preview URL.
5. Perform a **final smoke test** on the live URL:
   - Log in with the sample credentials.
   - Create a new check user.
   - Issue a new queue receipt.
   - Check in the vehicle.
   - View a report and test the CSV export.

### 5. Post-Deployment (Optional)

- **Custom Domain:** Add your custom domain in Vercel's **Domains** settings.
- **Analytics:** Enable Vercel Analytics for production monitoring.
- **Vercel Configuration (`vercel.json`):** If you need custom headers (e.g., CORS) or rewrites for a future real backend, add a `vercel.json` file as documented in the deployment guide.

---

## ✅ Final Review

This completes all deliverables for the assessment. The project now includes:

1. **Complete Source Code:** A full Next.js application with a feature-based architecture.
2. **Functional Application:** All workflows are implemented and interactive.
3. **Mock Backend:** A realistic, documented API with persistent data.
4. **Comprehensive `README.md`:** Setup, architecture, and usage instructions.
5. **System Analysis:** A detailed document of the legacy system and improvement decisions.
6. **Architecture Decision Records:** Four ADRs explaining key technical choices.
7. **Mock API Contract:** A formal specification of the backend endpoints.
8. **Deployment Guide:** A checklist for a successful Vercel deployment.

You are now ready to submit the project. Good luck with your assessment.