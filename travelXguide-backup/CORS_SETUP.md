# CORS Configuration Guide for TravelXGuide

This guide explains the CORS (Cross-Origin Resource Sharing) configuration for the TravelXGuide application.

## Overview

The application has been configured with flexible CORS settings that work across different environments (development, staging, production).

## Backend CORS Configuration

### Environment Variables

Create a `.env` file in the `Backend/` directory with the following variables:

```env
# CORS Configuration
FRONTEND_URL=http://localhost:5173
FRONTEND_URL_HTTPS=https://localhost:5173
PRODUCTION_URL=https://your-production-domain.com
STAGING_URL=https://your-staging-domain.com
```

### Allowed Origins

The backend automatically allows requests from:
- `http://localhost:5173` (Vite dev server - primary)
- `https://localhost:5173` (HTTPS dev server - primary)
- `http://localhost:5174` (Alternative Vite port)
- `https://localhost:5174` (HTTPS alternative)
- `http://localhost:3000` (Create React App dev server)
- `https://localhost:3000` (HTTPS CRA dev server)
- `http://localhost:4173` (Vite preview server)
- `https://localhost:4173` (HTTPS preview)
- Your production domain (set via `PRODUCTION_URL`)
- Your staging domain (set via `STAGING_URL`)

### CORS Features

- ✅ Credentials support (cookies, authorization headers)
- ✅ Pre-flight request handling
- ✅ Multiple HTTP methods (GET, POST, PUT, DELETE, PATCH, OPTIONS)
- ✅ Custom headers support
- ✅ Socket.IO CORS integration
- ✅ Error logging for blocked origins

## Frontend CORS Configuration

### Environment Variables

Create a `.env` file in the `Frontend/` directory:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:5000

# Development Configuration
VITE_DEV_MODE=true
VITE_API_TIMEOUT=10000
```

### Vite Configuration

The frontend includes:
- ✅ Development server CORS enabled
- ✅ API proxy for development
- ✅ Request/response logging
- ✅ Timeout configuration
- ✅ Error handling

## Setup Instructions

### 1. Backend Setup

```bash
cd Backend
cp env.example .env
# Edit .env with your configuration
npm install
npm run dev
```

### 2. Frontend Setup

```bash
cd Frontend
cp env.example .env
# Edit .env with your configuration
npm install
npm run dev
```

### 3. Production Deployment

For production, update the environment variables:

**Backend (.env):**
```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
PRODUCTION_URL=https://your-frontend-domain.com
```

**Frontend (.env):**
```env
VITE_BACKEND_URL=https://your-backend-domain.com
VITE_DEV_MODE=false
```

## Troubleshooting

### Common CORS Issues

1. **"Not allowed by CORS" error**
   - Check that your frontend URL is in the allowed origins list
   - Verify environment variables are set correctly
   - Check browser console for blocked origin logs

2. **Credentials not being sent**
   - Ensure `withCredentials: true` is set in axios
   - Verify CORS credentials are enabled on backend
   - Check that cookies are being set properly

3. **Socket.IO connection issues**
   - Verify Socket.IO CORS configuration
   - Check that frontend URL is allowed in Socket.IO origins
   - Ensure WebSocket connections are not blocked by firewall

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=cors:*
```

### Testing CORS

Test your CORS configuration:

```bash
# Test from command line
curl -H "Origin: http://localhost:5174" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:5000/api/auth/login
```

## Security Considerations

1. **Never use `origin: '*'` in production**
2. **Always specify exact allowed origins**
3. **Use HTTPS in production**
4. **Regularly review and update allowed origins**
5. **Monitor CORS error logs**

## Environment-Specific Configurations

### Development
- Multiple localhost origins allowed
- Detailed error logging
- CORS debugging enabled

### Staging
- Limited to staging domain
- Error logging enabled
- Production-like configuration

### Production
- Only production domains allowed
- Minimal error logging
- Strict security settings

## API Endpoints

All API endpoints are prefixed with `/api/`:
- `/api/auth/*` - Authentication routes
- `/api/user/*` - User management routes
- `/api/admin/*` - Admin routes
- `/api/guide/*` - Guide routes
- `/api/chat/*` - Chat routes
- `/api/tour/*` - Tour routes

## Socket.IO Configuration

Socket.IO is configured with the same CORS settings as the main API:
- Real-time chat functionality
- Automatic reconnection
- Error handling

## Support

If you encounter CORS issues:
1. Check the browser console for errors
2. Review server logs for blocked origins
3. Verify environment variable configuration
4. Test with the provided curl command
5. Check network tab for failed requests 