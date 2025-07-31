# Quick Deployment Reference

## Essential Commands

### Local Testing
```bash
# Backend
cd Backend
npm install
npm run dev

# Frontend
cd Frontend
npm install
npm run dev
```

### Production Build Testing
```bash
# Frontend
cd Frontend
npm run build
npm run preview
```

## Environment Variables Template

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travelxguide
JWT_SECRET=your_super_secret_jwt_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env.production)
```env
VITE_BACKEND_URL=https://your-backend.vercel.app
```

## Vercel Configuration Files

### Backend/vercel.json
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

### Frontend/vercel.json
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

## Deployment Steps Summary

1. **Prepare Backend**
   - Create `vercel.json` in Backend directory
   - Set up MongoDB Atlas
   - Prepare environment variables

2. **Deploy Backend**
   - Go to vercel.com → New Project
   - Import GitHub repo
   - Set Root Directory: `Backend`
   - Add environment variables
   - Deploy

3. **Prepare Frontend**
   - Create `vercel.json` in Frontend directory
   - Create `.env.production` with backend URL

4. **Deploy Frontend**
   - Go to vercel.com → New Project
   - Import same GitHub repo
   - Set Root Directory: `Frontend`
   - Add `VITE_BACKEND_URL` environment variable
   - Deploy

5. **Update Backend**
   - Go to backend project settings
   - Update `FRONTEND_URL` with frontend URL
   - Redeploy backend

## Common Issues & Solutions

### CORS Error
```javascript
// Check your corsConfig.js
origin: process.env.FRONTEND_URL || "http://localhost:5173"
```

### Environment Variable Not Working
- Frontend variables must start with `VITE_`
- Redeploy after adding variables
- No spaces around `=` in .env files

### Build Failing
```bash
# Check dependencies
npm install
npm run build

# Check for missing imports
npm run lint
```

### Database Connection
- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string format
- Verify database user permissions

## Testing URLs

### Backend Health Check
```
GET https://your-backend.vercel.app/api/health
```

### Frontend Test
```
https://your-frontend.vercel.app
```

## Important Notes

- **File Uploads**: Vercel has limitations. Consider AWS S3 or Cloudinary
- **Environment Variables**: Never commit to Git
- **Database**: Use MongoDB Atlas for production
- **CORS**: Must include exact frontend domain
- **Build**: Test locally before deploying

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html) 