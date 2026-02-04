# Inventory Manager - Project Documentation

## 📦 Project Overview

A comprehensive web-based inventory management system built with Next.js and MongoDB. This system allows users to efficiently track products, manage stock levels, record transactions (IN/OUT), and monitor inventory data through an interactive dashboard.

---

## ✨ Key Features

### Core Functionality

- **Product Management** - Create, Read, Update, Delete products with detailed information
- **Transaction Tracking** - Record and track stock movements (IN/OUT) with user accountability
- **Real-time Inventory Updates** - Live stock level adjustments and automatic updates
- **Supplier Management** - Track and manage supplier information and contacts
- **User Authentication** - Secure login with role-based access control
- **Dashboard Analytics** - Interactive data visualization and reporting
- **Dark/Light Mode** - Responsive UI with theme switching support

---

## 📊 Database Architecture

### 4 Collections with Complete Schema

#### 1. USER Collection

User accounts and authentication management

- `_id` (ObjectId) - Primary Key
- `name` (String) - User's full name
- `email` (String) - Unique email address
- `role` (String) - admin | manager | staff
- `department` (String) - Department assignment
- `password` (String) - Hashed password
- `isActive` (Boolean) - Account active status
- `createdAt`, `updatedAt` (DateTime)

(Categories are _not_ stored as a separate collection. Each product includes a `category` string field for flexible categorization.)

#### 3. SUPPLIER Collection

Supplier information and management

- `_id` (ObjectId) - Primary Key
- `name` (String) - Supplier name
- `email` (String) - Contact email
- `phone` (String) - Contact phone number
- `address` (String) - Physical address
- `city` (String) - City name
- `state` (String) - State/Province
- `country` (String) - Country
- `paymentTerms` (String) - Payment terms (Net 30, etc.)
- `isActive` (Boolean) - Supplier active status
- `createdAt`, `updatedAt` (DateTime)

#### 4. PRODUCT Collection

Inventory items and product information

- `_id` (ObjectId) - Primary Key
- `name` (String, required) - Product name
- `description` (String) - Product description
- `price` (Number, required) - Selling price
- `costPrice` (Number, required) - Cost/purchase price
- `quantity` (Number, required) - Current stock level
- `category` (String, required) - Category name (free-text)
- `supplierId` (ObjectId, ref: Supplier, required) - Supplier reference
- `createdBy` (ObjectId, ref: User, required) - Creator user reference
- `createdAt`, `updatedAt` (DateTime)

#### 5. TRANSACTION Collection

Stock movement tracking and transaction history

- `_id` (ObjectId) - Primary Key
- `productId` (ObjectId, ref: Product, required) - Product reference
- `quantity` (Number, required) - Quantity IN/OUT
- `transactionType` (String) - IN | OUT
- `performedBy` (ObjectId, ref: User, required) - User who performed transaction
- `notes` (String) - Transaction notes/remarks
- `date` (DateTime) - Transaction date
- `createdAt`, `updatedAt` (DateTime)

### Entity Relationships

```
USER → PRODUCT (one-to-many via createdBy)
USER → TRANSACTION (one-to-many via performedBy)
SUPPLIER → PRODUCT (one-to-many via supplierId)
PRODUCT → TRANSACTION (one-to-many via productId)

Note: Categories are represented as free-text on products (no dedicated collection).
```

---

## 🔌 API Endpoints (20+ Total)

### Users API (5 endpoints)

- `POST /api/users` - Create new user
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get single user details
- `PUT /api/users/:id` - Update user information
- `DELETE /api/users/:id` - Delete user account

(No dedicated Categories API — product `category` is a string field on products.)

### Suppliers API (4 endpoints)

- `POST /api/suppliers` - Create new supplier
- `GET /api/suppliers` - List all suppliers
- `PUT /api/suppliers/:id` - Update supplier details
- `DELETE /api/suppliers/:id` - Delete supplier

### Products API (7 endpoints)

- `POST /api/products` - Create new product
- `GET /api/products` - List all products (with pagination)
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/supplier/:supplierId` - Get products by supplier
- `GET /api/products/supplier/:supplierId` - Get products by supplier

### Transactions API (6 endpoints)

- `POST /api/transactions` - Record new transaction
- `GET /api/transactions` - List all transactions
- `GET /api/transactions/:id` - Get single transaction
- `GET /api/transactions/product/:productId` - Get transactions for product
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

---

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 14+ with TypeScript
- **UI Library**: React with shadcn/ui components
- **Styling**: Tailwind CSS with dark/light mode support
- **State Management**: React Hooks
- **HTTP Client**: Fetch API

### Backend

- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Language**: TypeScript for type safety

### Database

- **Database**: MongoDB Atlas (Cloud)
- **ODM**: Mongoose for schema validation and relationships
- **Connection**: MongoDB URI via environment variables

### Development Tools

- **Package Manager**: npm/yarn
- **Version Control**: Git
- **Environment**: .env.local for configuration

---

## 📝 Development Tasks (27 Total)

### Backend Tasks (10)

- [ ] Setup MongoDB connection and validate models
- [ ] Create User API endpoints (CRUD)

- [ ] Create Supplier API endpoints (CRUD)
- [ ] Create Product API endpoints (CRUD + filters)
- [ ] Create Transaction API endpoints (CRUD)
- [ ] Implement quantity update logic on transactions
- [ ] Add error handling and validation
- [ ] Create API response standardization
- [ ] Setup environment variables (.env.local)

### Frontend Tasks (10)

- [ ] Build Entry Form component with all fields
- [ ] Implement Data Table with sorting/filtering
- [ ] Build Dashboard layout
- [ ] Add form submission handlers
- [ ] Implement data fetching hooks
- [ ] Add loading and error states UI
- [ ] Build Supplier dropdown component
- [ ] Build Supplier dropdown component
- [ ] Implement real-time quantity updates
- [ ] Add edit/delete action buttons

### Authentication & Security (5)

- [ ] Implement user authentication system
- [ ] Add role-based access control (RBAC)
- [ ] Secure API endpoints with auth middleware
- [ ] Implement password hashing with bcrypt
- [ ] Add JWT token management

### Testing & Deployment (2)

- [ ] Unit tests for API endpoints
- [ ] Integration tests for database operations
- [ ] Database indexing and optimization
- [ ] Performance testing and optimization

---

## 🚀 User Workflow

1. **User Login** - User logs into the system with credentials
2. **Dashboard View** - User sees inventory overview and recent transactions
3. **Add Product** - User clicks "Add Product" to create new inventory item
4. **Fill Form** - Form displays with category, supplier, price, quantity fields
5. **Submit Data** - User submits form data
6. **API Processing** - Backend API validates and processes request
7. **Database Update** - MongoDB stores product information
8. **Table Refresh** - Data table automatically updates with new product
9. **Confirmation** - User sees success message
10. **Record Transaction** - User can record stock movements (IN/OUT)

---

## 📁 Project Structure

```
inventory-manager-s/
├── api/                    # API routes and endpoints
│   ├── users/
│   ├── categories/
│   ├── suppliers/
│   ├── products/
│   └── transactions/
├── app/
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── parts/
│   │       ├── addMenu.tsx
│   │       ├── columns.tsx
│   │       ├── data-page.tsx
│   │       ├── data-table.tsx
│   │       ├── entryForm.tsx
│   │       └── toolbar.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/             # Reusable UI components
│   ├── ui/
│   ├── app-sidebar.tsx
│   ├── nav-*.tsx
│   └── theme-provider.tsx
├── models/                # Mongoose schemas
│   ├── UserSchema.ts
│   ├── SupplierSchema.ts
│   ├── ProductSchema.ts
│   └── TransactionSchema.ts
├── lib/
│   ├── db.js             # MongoDB connection
│   ├── Theme-Switch.ts
│   └── utils.ts
├── hooks/                # Custom React hooks
│   └── use-mobile.ts
├── public/               # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## ✅ Current Project Status

### Completed

✅ Database schemas created (users, suppliers, products, transactions)
✅ Entity relationships defined
✅ API endpoint specifications documented
✅ Project structure initialized
✅ UI component library setup (shadcn/ui)
✅ Database connection configured (db.js)
✅ Theme switching implemented

### In Progress

⏳ API endpoint implementation
⏳ Frontend component development

### Pending

❌ User authentication system
❌ Form validation
❌ Data table features (sorting, filtering)
❌ Transaction logic implementation
❌ Testing and deployment

---

## 🎯 Next Steps Priority

1. **High Priority** - Implement all API endpoints (foundation for backend)
2. **High Priority** - Build Entry Form component (critical UI)
3. **Medium Priority** - Implement Data Table with features
4. **Medium Priority** - Add user authentication system
5. **Low Priority** - Performance optimization and testing

---

## 📞 Project Information

- **Tech Lead**: Available for questions
- **Database**: MongoDB Atlas (cloud-based)
- **Deployment**: Ready for Next.js hosting (Vercel, AWS, etc.)
- **Development Timeline**: Follow task priority list
- **Team Size**: Flexible (can be done by 1-2 developers)
