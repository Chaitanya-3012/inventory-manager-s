# Inventory Management System (IMS)

A comprehensive web-based inventory management application built with Next.js 15, MongoDB, and TypeScript. This system allows businesses to efficiently track products, manage stock levels, record transactions, and monitor inventory through an interactive dashboard.

## 🚀 Features

### Core Functionality
- **Product Management** - Create, read, update, and delete products with detailed information
- **Transaction Tracking** - Record and track stock movements (IN/OUT) with user accountability
- **Real-time Inventory Updates** - Live stock level adjustments and automatic updates
- **Supplier Management** - Track and manage supplier information and contacts
- **User Authentication** - Secure login with role-based access control
- **Dashboard Analytics** - Interactive data visualization and reporting
- **Documentation** - Comprehensive about page with system documentation
- **Dark/Light Mode** - Responsive UI with theme switching support
- **CSV Export** - Export products, suppliers, and transactions data

### Security & Access Control
- **User Authentication** - Secure login with JWT-based session management
- **Role-Based Access** - Admin, manager, and staff roles with appropriate permissions
- **Data Validation** - Comprehensive input validation and sanitization
- **Protected Routes** - Middleware protection for authenticated areas

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Library**: React with shadcn/ui components
- **Styling**: Tailwind CSS with dark/light mode support
- **State Management**: React Hooks
- **Data Tables**: TanStack Table for efficient data rendering
- **Forms**: React Hook Form with Zod validation

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based session management
- **Validation**: Zod schema validation

### Development Tools
- **Package Manager**: npm
- **Version Control**: Git
- **Build Tool**: Turbopack

## 📁 Project Structure

```
inventory-manager/
├── app/                     # Next.js app directory
│   ├── api/                 # API routes
│   ├── dashboard/           # Dashboard pages and components
│   │   ├── about/           # About page with documentation
│   │   ├── products/        # Product management
│   │   ├── suppliers/       # Supplier management
│   │   ├── transactions/    # Transaction tracking
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # Reusable UI components
├── contexts/                # React context providers
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions and helpers
├── models/                  # Mongoose database models
├── public/                  # Static assets
└── styles/                  # Global styles
```

## 🗄️ Database Schema

### User Collection
- `_id` (ObjectId) - Primary Key
- `name` (String) - User's full name
- `email` (String) - Unique email address
- `role` (String) - admin | manager | staff
- `department` (String) - Department assignment
- `password` (String) - Hashed password
- `isActive` (Boolean) - Account active status
- `createdAt`, `updatedAt` (DateTime)

### Supplier Collection
- `_id` (ObjectId) - Primary Key
- `name` (String) - Supplier name
- `email` (String) - Contact email
- `phone` (String) - Contact phone number
- `address` (String) - Physical address
- `city` (String) - City name
- `state` (String) - State/Province
- `country` (String) - Country
- `paymentTerms` (String) - Payment terms
- `isActive` (Boolean) - Supplier active status
- `createdAt`, `updatedAt` (DateTime)

### Product Collection
- `_id` (ObjectId) - Primary Key
- `name` (String) - Product name
- `description` (String) - Product description
- `price` (Number) - Selling price
- `costPrice` (Number) - Cost/purchase price
- `quantity` (Number) - Current stock level
- `category` (String) - Category name
- `supplierId` (ObjectId) - Supplier reference
- `createdBy` (ObjectId) - Creator user reference
- `createdAt`, `updatedAt` (DateTime)

### Transaction Collection
- `_id` (ObjectId) - Primary Key
- `productId` (ObjectId) - Product reference
- `quantity` (Number) - Quantity IN/OUT
- `transactionType` (String) - IN | OUT
- `performedBy` (ObjectId) - User who performed transaction
- `notes` (String) - Transaction notes
- `date` (DateTime) - Transaction date
- `createdAt`, `updatedAt` (DateTime)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inventory-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   AUTH_SECRET=your_jwt_secret_key
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Start production server**
   ```bash
   npm run start
   ```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `AUTH_SECRET`
3. Deploy!

### Other Platforms
The application can be deployed to any Node.js hosting platform that supports Next.js applications.

## 🛠️ Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `AUTH_SECRET` | Secret key for JWT token signing | Yes |
| `NEXT_PUBLIC_API_URL` | API base URL | Optional |

## 👥 User Roles

- **Admin** - Full access to all features and user management
- **Manager** - Access to product, supplier, and transaction management
- **Staff** - Limited access to view and record transactions

## 📱 Responsive Design

The application features a fully responsive design that works on:
- Desktop browsers
- Tablets
- Mobile devices

## 🎨 UI Components

The application uses shadcn/ui components for a consistent and modern user interface:
- Data tables with sorting, filtering, and pagination
- Modal dialogs for forms
- Navigation sidebar
- Dark/light theme toggle
- Responsive layout

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based session management
- Input validation and sanitization
- Protected API routes
- Role-based access control

## 📈 Performance Optimizations

- Server-side rendering with Next.js
- Code splitting and lazy loading
- Efficient database queries with Mongoose
- Optimized data fetching with React hooks
- Turbopack for fast development builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please open an issue on the GitHub repository or contact the development team.