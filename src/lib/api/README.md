# API Integration Layer

This directory contains all API-related code for connecting the frontend to the backend API.

## Structure

```
lib/api/
├── client.ts          # Axios instance with interceptors
├── types.ts          # TypeScript types and interfaces
└── services/         # API service modules
    ├── authService.ts
    ├── clientsService.ts
    ├── operationsService.ts
    └── index.ts
```

## Usage

### Basic Usage

```typescript
import { authService } from '../lib/api/services';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password'
});
```

### With React Context

```typescript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { login, user, isAuthenticated } = useAuth();
  
  // Use auth methods
}
```

### Direct Service Usage

```typescript
import { clientsService } from '../lib/api/services';

// Fetch clients
const clients = await clientsService.getAll({ page: 1, limit: 10 });
```

## Adding New Services

1. Create a new service file in `services/`
2. Export it from `services/index.ts`
3. Use it in your components

See `INTEGRATION.md` for detailed examples.

