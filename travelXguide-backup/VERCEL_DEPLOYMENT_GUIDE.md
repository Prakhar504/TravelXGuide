# TravelXGuide Vercel Deployment Guide

This guide will help you deploy your TravelXGuide project using Vercel. Since your project has both frontend (React/Vite) and backend (Node.js/Express), we'll deploy them separately.

## Prerequisites

1. **GitHub Account**: Your project should be on GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Atlas**: For database hosting
4. **Environment Variables**: Prepare your environment variables

## Step 1: Prepare Your Backend for Deployment

### 1.1 Create Backend Configuration Files

Create a `vercel.json` file in your Backend directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### 1.2 Update Backend Environment Variables

Create a `.env` file in your Backend directory with production values:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### 1.3 Update CORS Configuration

Ensure your backend CORS is configured to accept requests from your frontend domain:

```javascript
// In your server.js or corsConfig.js
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
```

## Step 2: Prepare Your Frontend for Deployment

### 2.1 Create Frontend Configuration Files

Create a `vercel.json` file in your Frontend directory:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2.2 Update Frontend Environment Variables

Create a `.env.production` file in your Frontend directory:

```env
VITE_BACKEND_URL=https://your-backend-domain.vercel.app
```

### 2.3 Update API Configuration

Ensure your frontend API calls use the production backend URL:

```javascript
// In your GlobalApi.jsx or similar file
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
```

## Step 3: Deploy Backend to Vercel

### 3.1 Connect Backend Repository

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select the Backend directory as the root directory

### 3.2 Configure Backend Deployment

1. **Framework Preset**: Select "Node.js"
2. **Root Directory**: `Backend`
3. **Build Command**: Leave empty (not needed for Node.js API)
4. **Output Directory**: Leave empty
5. **Install Command**: `npm install`

### 3.3 Set Environment Variables

In the Vercel dashboard, add these environment variables:

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Your JWT secret key
- `EMAIL_USER`: Your email address
- `EMAIL_PASS`: Your email app password
- `FRONTEND_URL`: Your frontend Vercel URL (will be set after frontend deployment)

### 3.4 Deploy Backend

1. Click "Deploy"
2. Wait for deployment to complete
3. Note your backend URL (e.g., `https://your-backend.vercel.app`)

## Step 4: Deploy Frontend to Vercel

### 4.1 Connect Frontend Repository

1. Go back to Vercel dashboard
2. Click "New Project"
3. Import the same GitHub repository
4. Select the Frontend directory as the root directory

### 4.2 Configure Frontend Deployment

1. **Framework Preset**: Select "Vite"
2. **Root Directory**: `Frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### 4.3 Set Environment Variables

Add these environment variables:

- `VITE_BACKEND_URL`: Your backend Vercel URL (from Step 3.4)

### 4.4 Deploy Frontend

1. Click "Deploy"
2. Wait for deployment to complete
3. Note your frontend URL (e.g., `https://your-frontend.vercel.app`)

## Step 5: Update Backend Environment Variables

### 5.1 Update FRONTEND_URL

1. Go to your backend project in Vercel dashboard
2. Go to Settings → Environment Variables
3. Update `FRONTEND_URL` with your frontend URL
4. Redeploy the backend

## Step 6: Test Your Deployment

### 6.1 Test Backend API

1. Visit your backend URL + `/api/health` (if you have a health endpoint)
2. Test API endpoints using Postman or similar tool

### 6.2 Test Frontend

1. Visit your frontend URL
2. Test all features including:
   - User registration/login
   - Tour creation and management
   - Guide registration
   - Admin functionality

## Step 7: Configure Custom Domain (Optional)

### 7.1 Add Custom Domain

1. In Vercel dashboard, go to your project
2. Go to Settings → Domains
3. Add your custom domain
4. Configure DNS settings as instructed

## Troubleshooting Common Issues

### Issue 1: CORS Errors
- Ensure your backend CORS configuration includes your frontend domain
- Check that environment variables are correctly set

### Issue 2: API Calls Failing
- Verify `VITE_BACKEND_URL` is correctly set in frontend
- Check that backend is properly deployed and accessible

### Issue 3: Database Connection Issues
- Verify MongoDB Atlas connection string
- Ensure IP whitelist includes Vercel's IP ranges (0.0.0.0/0 for all)

### Issue 4: File Upload Issues
- Vercel has limitations with file uploads
- Consider using cloud storage (AWS S3, Cloudinary) for file uploads

### Issue 5: Environment Variables Not Working
- Ensure variables are prefixed with `VITE_` for frontend
- Redeploy after adding new environment variables

## Important Notes

1. **File Uploads**: Vercel's serverless functions have limitations for file uploads. Consider using cloud storage services.

2. **Database**: Use MongoDB Atlas or similar cloud database service.

3. **Environment Variables**: Never commit sensitive environment variables to your repository.

4. **Build Optimization**: Ensure your build process is optimized for production.

5. **Monitoring**: Use Vercel's built-in analytics and monitoring features.

## Final URLs

After deployment, you should have:
- **Frontend**: `https://your-frontend.vercel.app`
- **Backend**: `https://your-backend.vercel.app`

## Next Steps

1. Set up monitoring and analytics
2. Configure error tracking (Sentry, etc.)
3. Set up CI/CD pipelines
4. Implement proper logging
5. Set up backup strategies for your database

Your TravelXGuide application should now be live and accessible worldwide! 