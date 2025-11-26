# CRUD Implementation - Accounts & Platform Users

This document describes the CRUD (Create, Read, Update, Delete) implementation for Accounts and Platform Users.

## Overview

Complete CRUD functionality has been implemented for:
- **Accounts** - Management of account entities
- **Platform Users** - Management of platform user entities

## Implementation Details

### 1. API Services

#### Accounts Service (`src/lib/api/services/accountsService.ts`)
- `getAll()` - List all accounts with pagination and search
- `getById()` - Get account by ID
- `create()` - Create new account
- `update()` - Update existing account
- `delete()` - Delete account (soft delete)

#### Platform Users Service (`src/lib/api/services/platformUsersService.ts`)
- `getAll()` - List all platform users with pagination, search, and filters
- `getById()` - Get platform user by ID
- `create()` - Create new platform user
- `update()` - Update existing platform user
- `delete()` - Delete platform user (soft delete)

### 2. Validation Schemas

#### Accounts (`src/lib/validations/accounts.schema.ts`)
- `createAccountSchema` - Validation for creating accounts
  - Required: name, email
  - Optional: phone, document, status, currency, planId, ownerId, password
  - Conditional: password required if ownerId not provided
- `updateAccountSchema` - Validation for updating accounts (all fields optional)

#### Platform Users (`src/lib/validations/platformUsers.schema.ts`)
- `createPlatformUserSchema` - Validation for creating platform users
  - Required: name, email, password, role
  - Optional: phone, isActive, twoFa
- `updatePlatformUserSchema` - Validation for updating platform users (all fields optional)

### 3. Pages & Components

#### Accounts

**List Page** (`src/pages/Accounts/AccountsList.tsx`)
- Displays accounts in a table
- Search functionality
- Pagination support
- Actions: Edit, Delete
- Status badges (Active/Inactive)
- Currency display

**Form Page** (`src/pages/Accounts/AccountForm.tsx`)
- Create new account
- Edit existing account
- Form validation with React Hook Form + Yup
- Fields: name, email, phone, document, status, currency
- Password field (only for create, conditional)

#### Platform Users

**List Page** (`src/pages/PlatformUsers/PlatformUsersList.tsx`)
- Displays platform users in a table
- Search functionality
- Pagination support
- Actions: Edit, Delete
- Role badges (Owner, Admin, Agent, Viewer)
- Status badges (Active/Inactive)

**Form Page** (`src/pages/PlatformUsers/PlatformUserForm.tsx`)
- Create new platform user
- Edit existing platform user
- Form validation with React Hook Form + Yup
- Fields: name, email, phone, password, role, isActive, twoFa
- Password optional on edit

### 4. Routes

All routes are protected (require authentication):

```
/accounts                    - List accounts
/accounts/new               - Create new account
/accounts/:id/edit          - Edit account

/platform-users             - List platform users
/platform-users/new         - Create new platform user
/platform-users/:id/edit    - Edit platform user
```

## Features

### List Pages
- ✅ Pagination
- ✅ Search/Filter
- ✅ Loading states
- ✅ Error handling
- ✅ Empty states
- ✅ Action buttons (Edit, Delete)
- ✅ Status/Role badges

### Form Pages
- ✅ React Hook Form integration
- ✅ Yup validation
- ✅ Create and Edit modes
- ✅ Loading states
- ✅ Error handling
- ✅ Form field validation
- ✅ Success redirect

### API Integration
- ✅ Full CRUD operations
- ✅ Error handling
- ✅ Type safety
- ✅ Pagination support
- ✅ Search support

## Usage

### Accessing the Pages

1. **Accounts**:
   - Navigate to `/accounts` to see the list
   - Click "Nova Conta" to create
   - Click edit icon to edit
   - Click delete icon to delete

2. **Platform Users**:
   - Navigate to `/platform-users` to see the list
   - Click "Novo Usuário" to create
   - Click edit icon to edit
   - Click delete icon to delete

### Form Validation

All forms use Yup validation with the following rules:

**Accounts:**
- Name: Required, minimum 1 character
- Email: Required, valid email format
- Password: Required if ownerId not provided, minimum 8 characters
- Status: ACTIVE or INACTIVE
- Currency: BRL, USD, EUR, or GBP

**Platform Users:**
- Name: Required, minimum 2 characters
- Email: Required, valid email format
- Password: Required on create, optional on update, minimum 8 characters
- Role: owner, admin, agent, or viewer
- isActive: Boolean
- twoFa: Boolean

## API Endpoints Used

### Accounts
- `GET /api/accounts` - List accounts
- `GET /api/accounts/:id` - Get account
- `POST /api/accounts` - Create account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Platform Users
- `GET /api/platform-users` - List platform users (requires owner/admin role)
- `GET /api/platform-users/:id` - Get platform user (requires owner/admin role)
- `POST /api/platform-users` - Create platform user (requires owner/admin role)
- `PUT /api/platform-users/:id` - Update platform user (requires owner/admin role)
- `DELETE /api/platform-users/:id` - Delete platform user (requires owner/admin role)

## Notes

- Platform Users endpoints require `owner` or `admin` role
- All routes are protected and require authentication
- Delete operations are soft deletes
- Forms use React Hook Form for state management
- Validation uses Yup schemas
- All text is in Portuguese (PT-BR)

