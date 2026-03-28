# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 inventory management application with a MongoDB backend. The application features a dashboard interface with products, suppliers, and transactions management sections.

## Architecture

### Frontend Structure
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS v4 for styling with shadcn/ui components
- Responsive sidebar navigation using lucide-react icons
- Dark/light theme support via next-themes

### Backend Structure
- MongoDB with Mongoose ODM
- RESTful API routes (`/app/api/*`)
- Database models for Products, Suppliers, Users, and Transactions
- Zod validation for API request bodies
- Centralized API client (`/lib/api-client.ts`) with typed endpoints

### Data Models
1. **Product**: Name, description, category, price, costPrice, quantity, supplierId, createdBy
2. **Supplier**: Name, email, phone, address, city, state, country, paymentTerms
3. **User**: Name, email, role, department, password (hashed with bcrypt)
4. **Transaction**: productId, quantity, transactionType (IN/OUT), performedBy, notes

### Key Directories
- `/app`: Main Next.js app directory with pages and API routes
- `/components`: Reusable UI components including shadcn/ui and custom components
- `/lib`: Utility functions, database connection, and API client
- `/models`: Mongoose schema definitions
- `/hooks`: Custom React hooks for data fetching

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build production application
npm run start        # Start production server
```

### Linting
```bash
npm run lint         # Run ESLint
```

### Testing
Currently, there are no configured test scripts. To add testing:
1. Install testing libraries (e.g., Jest, React Testing Library)
2. Add test scripts to package.json
3. Create test files in `__tests__` directories

## API Structure

The application uses a RESTful API approach with the following endpoints:
- `/api/products` - CRUD operations for products
- `/api/suppliers` - CRUD operations for suppliers
- `/api/users` - CRUD operations for users
- `/api/transactions` - CRUD operations for inventory transactions

Each API route implements:
- Proper error handling with detailed error messages
- Input validation using Zod schemas
- MongoDB population for related data
- Consistent JSON response format

## Frontend Patterns

### Data Fetching
Custom hooks (`/hooks/use-api.ts`) encapsulate API interactions:
- `useProducts()` for product data
- `useSuppliers()` for supplier data
- `useUsers()` for user data
- `useTransactions()` for transaction data

Each hook provides:
- Loading state management
- Error handling
- Data refetching capability
- CRUD operation methods

### UI Components
- DataTable components with TanStack Table for data grids
- Dialog components for forms (add/edit dialogs)
- Form handling with react-hook-form and Zod validation
- Toast notifications with sonner

## Common Development Tasks

### Adding a New Entity
1. Create a new Mongoose schema in `/models/`
2. Create API routes in `/app/api/[entity]/`
3. Add API client methods in `/lib/api-client.ts`
4. Create a custom hook in `/hooks/use-api.ts`
5. Create UI components for displaying and editing the entity
6. Add navigation entry in `/components/app-sidebar.tsx`

### Modifying Existing Entities
1. Update the Mongoose schema if needed
2. Modify API routes to handle new/changed fields
3. Update validation schemas in API routes
4. Update API client methods
5. Update frontend components to display/collect new fields

## Environment Variables
The application requires the following environment variables:
- `MONGODB_URI` - MongoDB connection string
- `NEXT_PUBLIC_API_URL` - API base URL (defaults to localhost)

## Deployment
The application can be deployed to Vercel directly from the GitHub repository. Ensure environment variables are configured in the Vercel project settings.