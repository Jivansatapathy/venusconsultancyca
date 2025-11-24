# Deploying to Google Cloud Run

This guide will help you deploy the Venus Consultancy backend to Google Cloud Run.

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

You'll need to set environment variables in Cloud Run. These should be set during deployment or via the Cloud Console.

Required environment variables:
- `ACCESS_SECRET` - JWT access token secret
- `REFRESH_SECRET` - JWT refresh token secret
- `PORT` - Server port (Cloud Run sets this automatically, but you can override)
- `NODE_ENV=production`
- `CORS_ALLOWED_ORIGINS` - Comma-separated list of allowed origins
- `SEED_ADMIN_PASSWORD` - (Optional, for seeding)
- `SEED_RECRUITER_PASSWORD` - (Optional, for seeding)

## Step 3: Build and Deploy

### Option A: Using gcloud CLI (Recommended)

```bash
cd server

# Build and deploy in one command
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
  --set-env-vars "NODE_ENV=production,ACCESS_SECRET=your-access-secret,REFRESH_SECRET=your-refresh-secret,CORS_ALLOWED_ORIGINS=https://venushiring.ca,https://venus-consultancy.vercel.app,http://localhost:5173"
```

### Option B: Using Docker Build

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
  --cpu 1
```

### Option C: Using Cloud Build (CI/CD)

```bash
# Submit build to Cloud Build
gcloud builds submit --config cloudbuild.yaml
```

## Step 4: Set Environment Variables (After Initial Deployment)

If you need to update environment variables after deployment:

```bash
gcloud run services update venus-backend \
  --region us-central1 \
  --update-env-vars "ACCESS_SECRET=your-secret,REFRESH_SECRET=your-secret"
```

Or use the Cloud Console:
1. Go to Cloud Run → venus-backend
2. Click "Edit & Deploy New Revision"
3. Go to "Variables & Secrets" tab
4. Add/update environment variables
5. Deploy

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

2. **CORS Configuration**: Make sure `CORS_ALLOWED_ORIGINS` includes your production frontend URL

3. **File Uploads**: The `uploads` directory is created in the container, but files won't persist between deployments. Consider using Cloud Storage for file uploads.

4. **Health Check**: The `/api/health` endpoint can be used for health checks

5. **Scaling**: Cloud Run automatically scales based on traffic. Adjust `--min-instances` and `--max-instances` as needed.

## Troubleshooting

### View Logs
```bash
gcloud run services logs read venus-backend --region us-central1
```

### Check Service Status
```bash
gcloud run services describe venus-backend --region us-central1
```

### Test Locally with Docker
```bash
docker build -t venus-backend .
docker run -p 8080:8080 \
  -e PORT=8080 \
  -e NODE_ENV=production \
  -e ACCESS_SECRET=test-secret \
  -e REFRESH_SECRET=test-secret \
  venus-backend
```

## Security Best Practices

1. **Secrets Management**: Use Google Secret Manager for sensitive data
2. **Service Account**: Use Cloud Run's service account for Firebase access
3. **HTTPS Only**: Cloud Run provides HTTPS by default
4. **Authentication**: Consider using Cloud IAM for service-to-service auth
5. **Rate Limiting**: Already configured in the app

