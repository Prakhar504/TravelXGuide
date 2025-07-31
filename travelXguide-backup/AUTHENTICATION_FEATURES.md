# Authentication & User Management Features

## Overview
This document outlines the comprehensive authentication and user management system implemented for the TravelXGuide application.

## Features Implemented

### 1. OAuth Login (Google)
- **Google OAuth Integration**: Users can sign in using their Google accounts
- **Automatic Account Linking**: Existing email accounts are linked with Google OAuth
- **Profile Picture Sync**: Google OAuth accounts automatically sync profile pictures

#### Implementation Details:
- Frontend: Google OAuth script loaded dynamically
- Backend: `/api/auth/oauth-login` endpoint handles Google OAuth authentication
- Automatic account creation for new Google OAuth users
- Pre-verified accounts for Google OAuth users (no email verification required)

### 2. Email Verification on Registration
- **Automatic OTP Generation**: 6-digit OTP sent immediately after registration
- **Email Templates**: Professional HTML email templates for verification
- **OTP Expiration**: 24-hour expiration for security
- **Resend Functionality**: Users can request new OTP codes
- **Verification Status**: Clear indication of account verification status

#### Implementation Details:
- Backend: `/api/auth/send-verify-otp` and `/api/auth/verify-account` endpoints
- Frontend: Dedicated OTP verification form with resend functionality
- Email templates stored in `Backend/config/emailTemplates.js`

### 3. Forgot Password & Reset Flow
- **Multi-step Process**: Email → OTP → New Password
- **Password Strength Validation**: Real-time password strength indicators
- **Security Features**: 15-minute OTP expiration, secure password requirements
- **User-friendly Interface**: Clear progress indicators and error messages

#### Implementation Details:
- Backend: `/api/auth/send-reset-otp` and `/api/auth/reset-password` endpoints
- Frontend: `ResetPassword.jsx` component with step-by-step flow
- Password requirements: 8+ chars, uppercase, lowercase, numbers, special chars

### 4. Role-based Access Control
- **Three User Roles**: Traveler, Guide, Admin
- **Role Selection**: Users choose role during registration
- **Role-based Features**: Different access levels and functionality
- **Profile Management**: Role-specific profile information

#### Implementation Details:
- Database: Role field in user model with enum validation
- Frontend: Role selection dropdown in registration form
- Backend: Role validation in registration endpoint

## Database Schema Enhancements

### User Model (`Backend/models/userModels.js`)
```javascript
{
  // Basic Info
  name: String (required),
  email: String (required, unique),
  password: String (required),
  
  // Role-based Access
  role: {
    type: String,
    enum: ['traveler', 'guide', 'admin'],
    default: 'traveler'
  },
  
  // OAuth Integration
  oauthProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  oauthId: String,
  profilePicture: String,
  
  // Email Verification
  verifyOtp: String,
  verifyOtpExpireAt: Number,
  isAccountVerified: Boolean (default: false),
  emailVerifiedAt: Date,
  
  // Password Reset
  resetOtp: String,
  resetOtpExpireAt: Number,
  
  // Account Status
  isActive: Boolean (default: true),
  isBlocked: Boolean (default: false),
  lastLoginAt: Date,
  
  // Additional Info
  phone: String,
  dateOfBirth: Date,
  location: String,
  bio: String,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication Routes (`Backend/routes/authRoutes.js`)

#### Registration & Login
- `POST /api/auth/register` - User registration with role selection
- `POST /api/auth/login` - Traditional email/password login
- `POST /api/auth/oauth-login` - Google OAuth login
- `POST /api/auth/logout` - User logout

#### Email Verification
- `POST /api/auth/send-verify-otp` - Send verification OTP
- `POST /api/auth/verify-account` - Verify email with OTP

#### Password Management
- `POST /api/auth/send-reset-otp` - Send password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `POST /api/auth/change-password` - Change password (authenticated users)

#### Profile Management
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

#### Authentication Check
- `GET /api/auth/is-auth` - Check authentication status

## Frontend Components

### 1. Enhanced Signup Component (`my-vue-app/src/Routes/signup.jsx`)
- **Dual Mode**: Toggle between signup and login
- **Google OAuth Button**: Google login option
- **Role Selection**: Dropdown for traveler/guide/admin roles
- **Email Verification**: Integrated OTP verification flow
- **Loading States**: Professional loading indicators
- **Error Handling**: Comprehensive error messages

### 2. Password Reset Component (`my-vue-app/src/Routes/ResetPassword.jsx`)
- **Multi-step Flow**: Email → OTP → New Password
- **Password Strength**: Real-time validation with visual indicators
- **Security Features**: Password requirements checklist
- **User Experience**: Clear progress and error states

### 3. User Profile Component (`my-vue-app/src/Routes/UserProfile.jsx`)
- **Profile Management**: Edit personal information
- **Password Change**: Secure password update functionality
- **Account Status**: Display verification and account status
- **Role Information**: Show user role and permissions
- **Account Actions**: Logout and security settings

## Security Features

### 1. Password Security
- **Hashing**: bcrypt with salt rounds
- **Strength Requirements**: 8+ characters, mixed case, numbers, special chars
- **Validation**: Real-time password strength checking

### 2. Token Security
- **JWT Tokens**: 7-day expiration
- **HTTP-only Cookies**: Secure cookie storage
- **CSRF Protection**: SameSite cookie attributes

### 3. Account Security
- **Email Verification**: Required for local accounts
- **Account Blocking**: Admin can block suspicious accounts
- **Login Tracking**: Last login timestamp recording

### 4. OAuth Security
- **Provider Validation**: Only Google OAuth supported
- **Account Linking**: Secure linking of existing accounts
- **Profile Sync**: Safe profile picture handling

## Environment Variables Required

### Backend (`.env`)
```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Alternative Email Configuration (if not using SMTP)
SENDER_EMAIL=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/travelxguide

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Frontend (`.env` - Vite Environment Variables)
```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here

# Backend URL (if needed)
VITE_BACKEND_URL=http://localhost:5000
```

**Important**: In Vite, environment variables must be prefixed with `VITE_` and accessed using `import.meta.env.VITE_VARIABLE_NAME`.

## Usage Examples

### 1. User Registration
```javascript
// Register a new user
const response = await axios.post('/api/auth/register', {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  role: 'traveler'
});
```

### 2. Google OAuth Login
```javascript
// Google OAuth login
const response = await axios.post('/api/auth/oauth-login', {
  provider: 'google',
  oauthId: 'google-user-id',
  name: 'John Doe',
  email: 'john@gmail.com',
  profilePicture: 'https://example.com/photo.jpg'
});
```

### 3. Password Reset
```javascript
// Send reset OTP
await axios.post('/api/auth/send-reset-otp', {
  email: 'john@example.com'
});

// Reset password
await axios.post('/api/auth/reset-password', {
  email: 'john@example.com',
  otp: '123456',
  newPassword: 'NewSecurePass123!'
});
```

## Error Handling

### Common Error Responses
```javascript
{
  success: false,
  message: "Error description"
}
```

### Error Types
- **Validation Errors**: Missing required fields, invalid formats
- **Authentication Errors**: Invalid credentials, expired tokens
- **Account Errors**: Blocked accounts, unverified emails
- **Network Errors**: Connection issues, timeout errors

## Best Practices

### 1. Security
- Always validate user input on both frontend and backend
- Use HTTPS in production
- Implement rate limiting for OTP requests
- Regular security audits and updates

### 2. User Experience
- Clear error messages and loading states
- Responsive design for all devices
- Accessibility compliance
- Progressive enhancement

### 3. Performance
- Optimize database queries with indexes
- Implement caching for user sessions
- Lazy load OAuth scripts
- Minimize bundle size

## Future Enhancements

### 1. Additional OAuth Providers
- Facebook OAuth integration (if needed)
- Twitter OAuth integration
- LinkedIn OAuth integration
- Apple Sign-In for iOS users

### 2. Advanced Security
- Two-factor authentication (2FA)
- Biometric authentication
- Device fingerprinting
- Suspicious activity detection

### 3. User Experience
- Social login buttons with better styling
- Remember me functionality
- Auto-login for returning users
- Profile picture upload functionality

### 4. Admin Features
- User management dashboard
- Role assignment interface
- Account blocking/unblocking
- User analytics and reporting

## Testing

### Manual Testing Checklist
- [ ] User registration with all roles
- [ ] Email verification flow
- [ ] Google OAuth login
- [ ] Password reset process
- [ ] Profile editing and updates
- [ ] Password change functionality
- [ ] Logout and session management
- [ ] Error handling and validation
- [ ] Mobile responsiveness
- [ ] Accessibility compliance

### Automated Testing
- Unit tests for authentication functions
- Integration tests for API endpoints
- E2E tests for complete user flows
- Security testing for OAuth flows

## Deployment Considerations

### 1. Environment Setup
- Configure production email service
- Set up Google OAuth application
- Configure HTTPS certificates
- Set up monitoring and logging

### 2. Database Migration
- Run database migrations for new schema
- Back up existing user data
- Test migration in staging environment

### 3. Security Review
- Audit all authentication flows
- Review Google OAuth configuration
- Test security headers
- Verify HTTPS enforcement

This comprehensive authentication system provides a secure, user-friendly foundation for the TravelXGuide application with room for future enhancements and scalability. 