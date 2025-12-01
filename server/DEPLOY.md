# Deploying to Google Cloud Run

This guide will help you deploy the Venus Consultancy backend to Google Cloud Run.

> **💡 PowerShell Users (Windows):** This guide shows commands for both Bash and PowerShell. PowerShell uses backticks `` ` `` for line continuation instead of backslashes `\`. All commands are provided in both formats.

## 🚀 Quick Start

If you're familiar with Cloud Run, here's the fastest way to deploy using the `env.yaml` file:

```bash
# 1. Set your project
gcloud config set project venusglobal-847ea

# 2. Enable required APIs
gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com

# 3. Update env.yaml with your values (if needed)
# Edit server/env.yaml and update any values you need

# 4. Deploy using env.yaml file
cd server

# For PowerShell (Windows) - use backticks for line continuation
gcloud run deploy venus-backend `
  --source . `
  --region us-central1 `
  --platform managed `
  --allow-unauthenticated `
  --port 8080 `
  --memory 512Mi `
  --cpu 1 `
  --env-vars-file env.yaml

# Or as a single line (works in both PowerShell and Bash)
gcloud run deploy venus-backend --source . --region us-central1 --platform managed --allow-unauthenticated --port 8080 --memory 512Mi --cpu 1 --env-vars-file env.yaml
```

For detailed instructions and all configuration options, continue reading below.

---

## Prerequisites

1. Google Cloud SDK (gcloud) installed and configured
2. Docker installed (for local testing)
3. A Google Cloud Project with billing enabled
4. Cloud Run API enabled

## Step 1: Set Up Google Cloud Project

```bash
# Login to Google Cloud
gcloud auth login

# Set your project
gcloud config set project venusglobal-847ea

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## Step 2: Configure Environment Variables

You'll need to set environment variables in Cloud Run. The easiest way is to use the `env.yaml` file (recommended), or you can set them during deployment via command line or Cloud Console.

### Using env.yaml File (Recommended)

The `server/env.yaml` file contains all environment variables in YAML format. This is the cleanest way to manage your configuration.

**File Structure:**
```yaml
# Environment variables for Google Cloud Run deployment
# Note: This file is used with --env-vars-file flag in gcloud run deploy

MONGO_URI: "your-mongodb-connection-string"
ACCESS_SECRET: "your-access-secret"
REFRESH_SECRET: "your-refresh-secret"
NODE_ENV: "production"
CORS_ALLOWED_ORIGINS: "https://venushiring.ca,https://venus-consultancy.vercel.app"
# ... more variables
```

**Security Note:** 
- ⚠️ **DO NOT commit `env.yaml` to git if it contains real secrets!**
- Consider creating `env.yaml.example` as a template
- Add `env.yaml` to `.gitignore` if it contains sensitive data
- Use Secret Manager for highly sensitive data (see Step 4, Option D)

**To use env.yaml:**
1. Copy `env.example` to `env.yaml` if you don't have one
2. Update all values in `env.yaml` with your production values
3. Use `--env-vars-file env.yaml` when deploying (see Step 3, Option A)

### Manual Configuration (Alternative)

### Required Environment Variables (Minimum)

These are **required** for the application to start:

- `ACCESS_SECRET` - JWT access token secret (generate a strong random string)
- `REFRESH_SECRET` - JWT refresh token secret (different from ACCESS_SECRET)
- `NODE_ENV=production`
- `PORT` - Server port (Cloud Run sets this automatically to 8080, but you can override)

### Recommended Environment Variables

For full functionality, also set these:

- `CORS_ALLOWED_ORIGINS` - Comma-separated list of allowed origins (e.g., `https://venushiring.ca,https://venus-consultancy.vercel.app`)
- `MONGO_URI` - MongoDB connection string (if using MongoDB)
- `CLIENT_ORIGIN` - Primary client origin URL

### Email Configuration (Optional but Recommended)

- `EMAIL_SERVICE` - Email service provider (`gmail`, `zoho`, or `custom`)
- `EMAIL_USER` - Email address for sending emails
- `EMAIL_PASS` - Email password or app-specific password
- `SMTP_HOST` - SMTP server hostname
- `SMTP_PORT` - SMTP port (usually 465 or 587)
- `SMTP_SECURE` - Use secure connection (`true` or `false`)
- `CONTACT_EMAIL` - Email address for contact form submissions
- `JOB_APPLICATION_EMAIL` - Comma-separated list of emails for job applications
- `FRONTEND_URL` - Frontend URL for email links

### Other Optional Variables

- `SEED_ADMIN_PASSWORD` - Password for seeding admin user (optional)
- `SEED_RECRUITER_PASSWORD` - Password for seeding recruiter user (optional)
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds (default: 900000 = 15 minutes)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 200)
- `YOUTUBE_API_KEY` - YouTube Data API v3 key (if using YouTube features)

### Generate Secure Secrets

Generate secure secrets using:

```bash
# Generate ACCESS_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate REFRESH_SECRET (run again for a different value)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use the provided script:
```bash
cd server
node generate-secrets.js
```

## Step 3: Build and Deploy

### Option A: Using env.yaml File (Recommended - Easiest)

This is the **cleanest and easiest** method. The `env.yaml` file contains all your environment variables in a structured format.

**1. Review and update `env.yaml`:**

Make sure `server/env.yaml` has all the correct values for your deployment:
- Update `MONGO_URI` with your MongoDB connection string
- Verify `ACCESS_SECRET` and `REFRESH_SECRET` are set (already configured)
- Update `CORS_ALLOWED_ORIGINS` with your frontend URLs
- Update email configuration if needed

**2. Deploy using the env.yaml file:**

**For Bash/Linux/Mac:**
```bash
cd server

gcloud run deploy venus-backend \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --env-vars-file env.yaml
```

**For PowerShell (Windows):**
```powershell
cd server

gcloud run deploy venus-backend `
  --source . `
  --region us-central1 `
  --platform managed `
  --allow-unauthenticated `
  --port 8080 `
  --memory 512Mi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 10 `
  --env-vars-file env.yaml
```

**Or as a single line (works in both):**
```bash
cd server
gcloud run deploy venus-backend --source . --region us-central1 --platform managed --allow-unauthenticated --port 8080 --memory 512Mi --cpu 1 --min-instances 0 --max-instances 10 --env-vars-file env.yaml
```

**Benefits of using env.yaml:**
- ✅ All environment variables in one place
- ✅ Easy to version control (but don't commit secrets!)
- ✅ No need to escape special characters in command line
- ✅ Works the same on Windows, Mac, and Linux
- ✅ Easy to update - just edit the file and redeploy

**Note:** Make sure `env.yaml` is not committed to git if it contains sensitive data. Consider using `env.yaml.example` as a template and adding `env.yaml` to `.gitignore`.

### Option B: Using gcloud CLI with --set-env-vars

This method passes environment variables directly in the command:

**For Bash/Linux/Mac:**
```bash
cd server

gcloud run deploy venus-backend \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production,ACCESS_SECRET=your-access-secret-here,REFRESH_SECRET=your-refresh-secret-here,CORS_ALLOWED_ORIGINS=https://venushiring.ca,https://venus-consultancy.vercel.app"
```

**For PowerShell (Windows):**
```powershell
cd server

gcloud run deploy venus-backend `
  --source . `
  --region us-central1 `
  --platform managed `
  --allow-unauthenticated `
  --port 8080 `
  --memory 512Mi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 10 `
  --set-env-vars "NODE_ENV=production,ACCESS_SECRET=your-access-secret-here,REFRESH_SECRET=your-refresh-secret-here,CORS_ALLOWED_ORIGINS=https://venushiring.ca,https://venus-consultancy.vercel.app"
```

**Note:** PowerShell uses backticks `` ` `` for line continuation, not backslashes `\`. This method can be cumbersome with many variables, so using `env.yaml` is recommended.

### Option C: Using Docker Build

**For Bash/Linux/Mac:**
```bash
cd server

# Build the Docker image
docker build -t gcr.io/venusglobal-847ea/venus-backend .

# Push to Google Container Registry
docker push gcr.io/venusglobal-847ea/venus-backend

# Deploy to Cloud Run
gcloud run deploy venus-backend \
  --image gcr.io/venusglobal-847ea/venus-backend \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --env-vars-file env.yaml
```

**For PowerShell (Windows):**
```powershell
cd server

# Build the Docker image
docker build -t gcr.io/venusglobal-847ea/venus-backend .

# Push to Google Container Registry
docker push gcr.io/venusglobal-847ea/venus-backend

# Deploy to Cloud Run
gcloud run deploy venus-backend `
  --image gcr.io/venusglobal-847ea/venus-backend `
  --region us-central1 `
  --platform managed `
  --allow-unauthenticated `
  --port 8080 `
  --memory 512Mi `
  --cpu 1 `
  --env-vars-file env.yaml
```

### Option D: Using Cloud Build (CI/CD)

```bash
# Submit build to Cloud Build
gcloud builds submit --config cloudbuild.yaml
```

## Step 4: Set Environment Variables (After Initial Deployment)

### Option A: Using env.yaml File (Recommended)

If you're using `env.yaml`, simply update the file and redeploy:

```bash
# 1. Edit env.yaml with your changes
# Edit server/env.yaml

# 2. Update the service with the new env.yaml
cd server
gcloud run services update venus-backend \
  --region us-central1 \
  --env-vars-file env.yaml
```

### Option B: Using gcloud CLI

If you need to update specific environment variables:

```bash
# Update specific environment variables
gcloud run services update venus-backend \
  --region us-central1 \
  --update-env-vars "ACCESS_SECRET=your-secret,REFRESH_SECRET=your-secret,CORS_ALLOWED_ORIGINS=https://venushiring.ca"
```

### Option C: Using Cloud Console (Easier for Multiple Variables)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **Cloud Run** → **venus-backend**
3. Click **"Edit & Deploy New Revision"**
4. Go to **"Variables & Secrets"** tab
5. Add/update environment variables:
   - Click **"Add Variable"** for each environment variable
   - Enter the variable name and value
6. Click **"Deploy"**

### Option D: Using Secret Manager (Recommended for Sensitive Data)

For sensitive data like passwords and API keys, use Google Secret Manager:

```bash
# Create secrets in Secret Manager
echo -n "your-access-secret" | gcloud secrets create access-secret --data-file=-
echo -n "your-refresh-secret" | gcloud secrets create refresh-secret --data-file=-
echo -n "your-email-password" | gcloud secrets create email-password --data-file=-
echo -n "your-mongodb-uri" | gcloud secrets create mongo-uri --data-file=-

# Grant Cloud Run access to secrets
# For Bash:
gcloud secrets add-iam-policy-binding access-secret \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# For PowerShell:
gcloud secrets add-iam-policy-binding access-secret `
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" `
  --role="roles/secretmanager.secretAccessor"

# Deploy with secrets
# For Bash:
gcloud run deploy venus-backend \
  --region us-central1 \
  --update-secrets ACCESS_SECRET=access-secret:latest,REFRESH_SECRET=refresh-secret:latest

# For PowerShell:
gcloud run deploy venus-backend `
  --region us-central1 `
  --update-secrets ACCESS_SECRET=access-secret:latest,REFRESH_SECRET=refresh-secret:latest
```

**Note:** Replace `PROJECT_NUMBER` with your actual project number. Find it with:
```bash
gcloud projects describe venusglobal-847ea --format="value(projectNumber)"
```

## Step 5: Get the Service URL

After deployment, get your service URL:

```bash
gcloud run services describe venus-backend \
  --region us-central1 \
  --format 'value(status.url)'
```

The URL will be something like: `https://venus-backend-xxxxx-uc.a.run.app`

## Step 6: Update Frontend API URL

Update your frontend `.env` file or environment variables to point to the Cloud Run URL:

```
VITE_API_URL=https://venus-backend-xxxxx-uc.a.run.app
```

## Important Notes

1. **Firebase Service Account**: The Firebase service account key is hardcoded in `src/config/firebase.js`. For production, consider:
   - Using Google Cloud Secret Manager
   - Using environment variables
   - Using Cloud Run's built-in service account

2. **CORS Configuration**: Make sure `CORS_ALLOWED_ORIGINS` includes your production frontend URL. Multiple origins should be comma-separated without spaces or with spaces after commas.

3. **File Uploads**: The `uploads` directory is created in the container, but files won't persist between deployments. Consider using Cloud Storage for file uploads:
   ```bash
   # Create a Cloud Storage bucket
   gsutil mb -p venusglobal-847ea -l us-central1 gs://venus-backend-uploads
   ```

4. **Health Check**: The `/api/health` endpoint can be used for health checks. Cloud Run will automatically check this endpoint.

5. **Scaling**: Cloud Run automatically scales based on traffic. Adjust `--min-instances` and `--max-instances` as needed:
   - `--min-instances 0` - Scale to zero when no traffic (cost-effective)
   - `--min-instances 1` - Always keep at least 1 instance running (faster response, higher cost)
   - `--max-instances 10` - Maximum concurrent instances

6. **Memory and CPU**: Adjust based on your needs:
   - `--memory 512Mi` - Minimum recommended
   - `--memory 1Gi` - For better performance
   - `--cpu 1` - Standard
   - `--cpu 2` - For CPU-intensive operations

7. **Timeout**: Cloud Run has a default timeout of 300 seconds (5 minutes). Increase if needed:
   ```bash
   gcloud run services update venus-backend \
     --region us-central1 \
     --timeout 600
   ```

## Troubleshooting

### View Logs

```bash
# View recent logs
gcloud run services logs read venus-backend --region us-central1

# Follow logs in real-time
gcloud run services logs tail venus-backend --region us-central1

# View logs with more details
gcloud run services logs read venus-backend --region us-central1 --limit 50
```

### Check Service Status

```bash
# Get service details
gcloud run services describe venus-backend --region us-central1

# Get service URL
gcloud run services describe venus-backend --region us-central1 --format 'value(status.url)'

# List all revisions
gcloud run revisions list --service venus-backend --region us-central1
```

### Test the Deployed Service

```bash
# Get the service URL
SERVICE_URL=$(gcloud run services describe venus-backend --region us-central1 --format 'value(status.url)')

# Test health endpoint
curl $SERVICE_URL/api/health

# Test with authentication (if needed)
curl -H "Authorization: Bearer YOUR_TOKEN" $SERVICE_URL/api/jobs
```

### Common Issues

#### Issue: Service fails to start
**Solution:**
- Check logs: `gcloud run services logs read venus-backend --region us-central1`
- Verify all required environment variables are set
- Check that `ACCESS_SECRET` and `REFRESH_SECRET` are not using default values

#### Issue: CORS errors
**Solution:**
- Verify `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Check that origins are comma-separated correctly
- Ensure frontend is using the correct API URL

#### Issue: Database connection errors
**Solution:**
- Verify `MONGO_URI` is set correctly
- Check MongoDB Atlas IP whitelist includes Cloud Run IPs (or allow all IPs: `0.0.0.0/0`)
- Verify database credentials are correct

#### Issue: Email not sending
**Solution:**
- Verify email environment variables are set
- Check SMTP credentials
- For Gmail, use an app-specific password
- Check Cloud Run logs for email errors

### Test Locally with Docker

Before deploying, test the Docker image locally:

```bash
cd server

# Build the image
docker build -t venus-backend .

# Run locally with environment variables
docker run -p 8080:8080 \
  -e PORT=8080 \
  -e NODE_ENV=production \
  -e ACCESS_SECRET=test-secret \
  -e REFRESH_SECRET=test-secret \
  -e CORS_ALLOWED_ORIGINS=http://localhost:5173 \
  venus-backend

# Test the local container
curl http://localhost:8080/api/health
```

### Rollback to Previous Revision

If a deployment fails, rollback to a previous revision:

```bash
# List revisions
gcloud run revisions list --service venus-backend --region us-central1

# Rollback to a specific revision
gcloud run services update-traffic venus-backend \
  --region us-central1 \
  --to-revisions REVISION_NAME=100
```

## Security Best Practices

1. **Secrets Management**: Use Google Secret Manager for sensitive data
2. **Service Account**: Use Cloud Run's service account for Firebase access
3. **HTTPS Only**: Cloud Run provides HTTPS by default
4. **Authentication**: Consider using Cloud IAM for service-to-service auth
5. **Rate Limiting**: Already configured in the app

