# Frontend Architecture Guide

## Directory Structure

```
src/
├── api/                    # API services and configurations
│   ├── api.js             # Main API client
│   ├── artistsAPI.js      # Artists-specific API calls
│   ├── marketplaceAPI.js  # Marketplace-specific API calls
│   └── index.js           # API barrel exports
│
├── app/                   # Application entry point
│   ├── App.jsx           # Main app component with routing
│   ├── App.css           # Global app styles
│   └── main.jsx          # React DOM entry point
│
├── pages/                 # Page components organized by feature
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard pages
│   ├── marketplace/      # Marketplace pages
│   ├── profile/          # Profile management pages
│   └── public/           # Public pages (landing, about)
│
├── shared/               # Shared resources across pages
│   ├── components/       # Reusable components
│   │   ├── ui/          # Basic UI components (buttons, inputs, etc.)
│   │   ├── common/      # Common business components
│   │   ├── layout/      # Layout components (headers, footers)
│   │   ├── marketplace/ # Marketplace-specific components
│   │   └── sections/    # Page section components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── guards/          # Route guards (ProtectedRoute, etc.)
│   ├── constants/       # Application constants
│   ├── types/           # Type definitions
│   └── index.js         # Shared barrel exports
│
├── store/               # Redux store configuration
│   ├── slices/         # Redux Toolkit slices
│   ├── actions/        # Redux actions
│   └── store.js        # Store configuration
│
└── assets/             # Static assets
```

## Import Conventions

### Barrel Exports
Use barrel exports (index.js files) for cleaner imports:

```javascript
// ✅ Good - using barrel exports
import { Button, Input, Modal } from '../shared/components/ui';
import { ProtectedRoute, APP_ROUTES } from '../shared';

// ❌ Avoid - direct file imports when barrel exists
import Button from '../shared/components/ui/button.jsx';
import Input from '../shared/components/ui/input.jsx';
```

### Import Organization
Organize imports in this order:

```javascript
// 1. React and external libraries
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal API and store
import { api } from '../../../api';
import { useSelector, useDispatch } from 'react-redux';

// 3. Shared components and utilities
import { Button, Modal, ProtectedRoute } from '../../../shared';

// 4. Feature-specific components
import { PostCard, MarketplaceFilters } from '../components';

// 5. Relative imports (same feature)
import './ComponentName.css';
```

## Feature Organization

Each feature should be self-contained with:

```
features/marketplace/
├── components/          # Feature-specific components
├── hooks/              # Feature-specific hooks
├── utils/              # Feature-specific utilities
├── MarketplacePage.jsx # Main page component
└── index.js            # Feature barrel exports
```

## Component Naming Conventions

- **PascalCase** for component files: `UserProfile.jsx`
- **camelCase** for utility functions: `formatDate.js`
- **UPPER_SNAKE_CASE** for constants: `API_ENDPOINTS`
- **kebab-case** for CSS files: `user-profile.css`

## API Organization

- `api/api.js` - Main API client configuration
- `api/[feature]API.js` - Feature-specific API calls
- Use consistent error handling across all API calls
- Implement loading states and error boundaries

## Best Practices

1. **Single Responsibility**: Each component should have one clear purpose
2. **Feature Isolation**: Keep feature-specific code within feature directories
3. **Shared Resources**: Use shared directory for reusable components
4. **Consistent Imports**: Use barrel exports for cleaner import statements
5. **Type Safety**: Use constants and type definitions for better maintainability

## Migration Notes

When moving files to this new structure:
1. Update all import paths
2. Create appropriate barrel exports
3. Ensure components follow naming conventions
4. Test all functionality after restructuring