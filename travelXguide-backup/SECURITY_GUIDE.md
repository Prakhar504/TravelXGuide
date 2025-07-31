# Security Guide for TravelXGuide

## 🔐 **IMPORTANT: Credential Security**

### What Happened
GitHub detected Google OAuth credentials in your repository and blocked the push to protect your security. This is a **good thing** - it prevented you from accidentally exposing sensitive credentials.

### ✅ **Fixed Issues**
- Removed hardcoded Google OAuth credentials from all files
- Replaced with placeholder values
- Added comprehensive `.gitignore` file
- Created environment variable templates

### 🔑 **How to Handle Credentials Properly**

#### 1. **Never Commit Real Credentials**
```bash
# ❌ WRONG - Never do this
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# ✅ CORRECT - Use placeholders
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

#### 2. **Use Environment Variables**
Create `.env` files locally (never commit them):

**Backend/.env**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
FRONTEND_URL=http://localhost:5173
```

**Frontend/.env**
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id
```

#### 3. **For Production (Vercel)**
Set these in Vercel dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `FRONTEND_URL`
- `VITE_BACKEND_URL` (for frontend)
- `VITE_GOOGLE_CLIENT_ID` (for frontend)

### 🚨 **Security Checklist**

- [ ] ✅ Removed hardcoded credentials from repository
- [ ] ✅ Added `.gitignore` to prevent future commits of sensitive files
- [ ] ✅ Created environment variable templates
- [ ] [ ] Set up proper Google OAuth credentials for production
- [ ] [ ] Configure MongoDB Atlas for production
- [ ] [ ] Set up email service credentials
- [ ] [ ] Generate secure JWT secret

### 🔧 **Next Steps for Deployment**

1. **Get New Google OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or use existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your production domain to authorized origins

2. **Set Up MongoDB Atlas**
   - Create MongoDB Atlas account
   - Create a cluster
   - Get connection string
   - Configure IP whitelist for Vercel

3. **Deploy to Vercel**
   - Follow the deployment guide
   - Set all environment variables in Vercel dashboard
   - Never commit real credentials to Git

### 📝 **Environment Variables Template**

#### Backend Production Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travelxguide
JWT_SECRET=your_super_secret_jwt_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret
FRONTEND_URL=https://your-frontend.vercel.app
```

#### Frontend Production Variables
```env
VITE_BACKEND_URL=https://your-backend.vercel.app
VITE_GOOGLE_CLIENT_ID=your_production_google_client_id
```

### 🛡️ **Security Best Practices**

1. **Use Different Credentials for Development and Production**
2. **Rotate Credentials Regularly**
3. **Use Strong, Unique Secrets**
4. **Monitor for Unauthorized Access**
5. **Never Share Credentials in Chat or Email**
6. **Use Environment Variables for All Secrets**

### 🚀 **Ready to Deploy**

Now that we've fixed the security issues, you can:

1. **Commit the changes** (credentials are now safe)
2. **Push to GitHub** (should work now)
3. **Follow the deployment guide** to deploy to Vercel
4. **Set up production credentials** in Vercel dashboard

### 📞 **Need Help?**

If you need help setting up:
- Google OAuth credentials
- MongoDB Atlas
- Email service
- Vercel deployment

Refer to the detailed deployment guides in:
- `VERCEL_DEPLOYMENT_GUIDE.md`
- `DEPLOYMENT_CHECKLIST.md`
- `QUICK_DEPLOYMENT_REFERENCE.md`

---

**Remember**: Security first! Always use environment variables and never commit real credentials to your repository. 