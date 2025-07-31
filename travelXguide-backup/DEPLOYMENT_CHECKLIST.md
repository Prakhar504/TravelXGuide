# TravelXGuide Deployment Checklist

## Pre-Deployment Checklist

### ✅ Backend Preparation
- [ ] MongoDB Atlas account created
- [ ] MongoDB Atlas cluster set up
- [ ] Database connection string obtained
- [ ] JWT secret key generated
- [ ] Email credentials configured
- [ ] `vercel.json` file created in Backend directory
- [ ] Environment variables prepared

### ✅ Frontend Preparation
- [ ] `vercel.json` file created in Frontend directory
- [ ] Production environment variables prepared
- [ ] API base URL configured for production
- [ ] Build process tested locally

### ✅ Repository Preparation
- [ ] Code pushed to GitHub
- [ ] All sensitive data removed from repository
- [ ] `.env` files added to `.gitignore`
- [ ] `node_modules` added to `.gitignore`

## Deployment Steps

### Backend Deployment
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Configure backend project settings
- [ ] Set environment variables in Vercel
- [ ] Deploy backend
- [ ] Test backend API endpoints
- [ ] Note backend URL

### Frontend Deployment
- [ ] Create new Vercel project for frontend
- [ ] Import same GitHub repository
- [ ] Configure frontend project settings
- [ ] Set `VITE_BACKEND_URL` environment variable
- [ ] Deploy frontend
- [ ] Test frontend functionality
- [ ] Note frontend URL

### Post-Deployment
- [ ] Update backend `FRONTEND_URL` environment variable
- [ ] Redeploy backend
- [ ] Test complete application flow
- [ ] Test user registration/login
- [ ] Test tour creation
- [ ] Test guide registration
- [ ] Test admin functionality
- [ ] Test file uploads (if applicable)

## Environment Variables Checklist

### Backend Variables
- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Secret key for JWT tokens
- [ ] `EMAIL_USER` - Email address for sending emails
- [ ] `EMAIL_PASS` - Email app password
- [ ] `FRONTEND_URL` - Frontend Vercel URL

### Frontend Variables
- [ ] `VITE_BACKEND_URL` - Backend Vercel URL

## Testing Checklist

### Backend API Testing
- [ ] Health check endpoint
- [ ] User registration
- [ ] User login
- [ ] Tour creation
- [ ] Guide registration
- [ ] Admin functions
- [ ] File upload endpoints

### Frontend Testing
- [ ] Home page loads
- [ ] Navigation works
- [ ] User registration form
- [ ] User login
- [ ] Tour creation
- [ ] Guide registration
- [ ] Admin dashboard
- [ ] Responsive design

## Common Issues to Check

### CORS Issues
- [ ] Backend CORS configured for frontend domain
- [ ] Environment variables correctly set
- [ ] No trailing slashes in URLs

### Database Issues
- [ ] MongoDB Atlas IP whitelist includes Vercel
- [ ] Connection string is correct
- [ ] Database user has proper permissions

### File Upload Issues
- [ ] Consider using cloud storage (AWS S3, Cloudinary)
- [ ] Test file upload functionality
- [ ] Check file size limits

### Environment Variable Issues
- [ ] Variables prefixed with `VITE_` for frontend
- [ ] No spaces around `=` in variable definitions
- [ ] Redeploy after adding new variables

## Final URLs to Note

- **Frontend URL**: `https://your-frontend.vercel.app`
- **Backend URL**: `https://your-backend.vercel.app`
- **GitHub Repository**: `https://github.com/yourusername/travelxguide`

## Post-Deployment Tasks

- [ ] Set up monitoring (Vercel Analytics)
- [ ] Configure error tracking (Sentry)
- [ ] Set up custom domain (optional)
- [ ] Create backup strategy for database
- [ ] Document deployment process
- [ ] Share URLs with team/stakeholders

## Troubleshooting Notes

- If CORS errors occur, check environment variables
- If API calls fail, verify backend URL in frontend
- If database connection fails, check MongoDB Atlas settings
- If build fails, check for missing dependencies
- If environment variables don't work, redeploy after adding them

---

**Remember**: Always test thoroughly in production before sharing with users! 