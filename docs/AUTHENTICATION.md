# Authentication Implementation

This document describes the authentication implementation that matches the API backend.

## Overview

The frontend authentication is fully integrated with the API backend, supporting:
- JWT access tokens and refresh tokens
- Automatic token refresh on expiration
- Protected routes
- User session management

## API Endpoints

### Public Endpoints (No Auth Required)
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

### Protected Endpoints (Auth Required)
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout user

## Response Format

All API responses follow this structure:

```typescript
{
  success: boolean;
  data: T;
  error?: {
    message: string;
    code?: string;
  };
}
```

## Login Response

```typescript
{
  success: true,
  data: {
    user: {
      id: number;
      email: string;
      name?: string;
      role: string;
      accountId?: number | null;
      isActive: boolean;
    };
    accessToken: string;
    refreshToken: string;
    expiresIn: number; // seconds
  }
}
```

## Token Management

### Storage
- `accessToken` - Stored in localStorage
- `refreshToken` - Stored in localStorage
- `tokenExpiresAt` - Expiration timestamp in localStorage
- `user` - User object in localStorage

### Automatic Token Refresh
The API client automatically refreshes tokens when:
1. A 401 error occurs
2. A refresh token is available
3. The request is retried with the new access token

If refresh fails, the user is automatically logged out and redirected to `/signin`.

## Usage

### Using Auth Context

```typescript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        email: 'user@example.com',
        password: 'password123'
      });
      // User is now logged in
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <button onClick={handleLogin}>Login</button>;
  }

  return (
    <div>
      <p>Welcome, {user?.email}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Direct Service Usage

```typescript
import { authService } from '../lib/api/services';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Get current user
const user = await authService.getCurrentUser();

// Refresh token manually
const tokens = await authService.refreshToken(refreshToken);

// Forgot password
await authService.forgotPassword('user@example.com');

// Reset password
await authService.resetPassword(token, 'newPassword123');
```

## Protected Routes

To protect a route, check authentication status:

```typescript
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router';

function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <div>Protected Content</div>;
}
```

## Error Handling

The API client handles errors automatically:
- 401 errors trigger token refresh
- Failed refresh logs out the user
- All errors are properly typed and can be caught

```typescript
try {
  await authService.login(credentials);
} catch (error) {
  // error.message contains the error message
  // error.status contains the HTTP status code
  console.error('Login error:', error.message);
}
```

## Token Expiration

Tokens are automatically checked on app initialization:
- If access token is expired, refresh token is used
- If refresh fails, user is logged out
- Expiration time is stored and checked before making requests

## Security Notes

1. **Tokens are stored in localStorage** - Consider using httpOnly cookies for production
2. **Automatic refresh** - Tokens are refreshed automatically to maintain session
3. **Error handling** - Failed authentication attempts are handled gracefully
4. **Token validation** - Tokens are validated on each protected request

## Next Steps

1. Update SignIn form to use `useAuth().login()`
2. Update SignUp form (if registration endpoint exists)
3. Add forgot/reset password UI
4. Add route protection to protected pages
5. Add loading states during authentication

