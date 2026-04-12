"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Inventory Management System (IMS)</h1>
        <p className="text-muted-foreground">
          A comprehensive solution for managing inventory, suppliers, and transactions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              IMS is a modern inventory management system designed to help businesses
              track products, manage suppliers, and monitor transactions efficiently.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li>• Real-time inventory tracking</li>
              <li>• Supplier management</li>
              <li>• Transaction recording</li>
              <li>• Data export capabilities</li>
              <li>• User authentication & roles</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Next.js 14</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">MongoDB</Badge>
              <Badge variant="secondary">Tailwind CSS</Badge>
              <Badge variant="secondary">Shadcn UI</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Products Module</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The products module allows you to manage all your inventory items with detailed information.
            </p>
            <ul className="text-sm space-y-2">
              <li><strong>Add Products:</strong> Create new products with name, description, pricing, quantity, category, and supplier information</li>
              <li><strong>View Products:</strong> Browse all products in a searchable table with filtering and sorting capabilities</li>
              <li><strong>Edit Products:</strong> Update product details as needed</li>
              <li><strong>Delete Products:</strong> Remove products that are no longer needed</li>
              <li><strong>Export Data:</strong> Export product information to CSV for reporting purposes</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suppliers Module</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your suppliers and their contact information in one centralized location.
            </p>
            <ul className="text-sm space-y-2">
              <li><strong>Supplier Directory:</strong> Maintain a complete list of all suppliers</li>
              <li><strong>Contact Management:</strong> Store supplier contact details including phone, email, and address</li>
              <li><strong>Product Associations:</strong> Link suppliers to specific products</li>
              <li><strong>Performance Tracking:</strong> Monitor supplier reliability and performance metrics</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transactions Module</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Track all inventory movements including purchases, sales, and adjustments.
            </p>
            <ul className="text-sm space-y-2">
              <li><strong>Transaction Logging:</strong> Record all inventory movements with timestamps</li>
              <li><strong>Type Classification:</strong> Categorize transactions as purchases, sales, or adjustments</li>
              <li><strong>Quantity Tracking:</strong> Monitor inventory levels in real-time</li>
              <li><strong>User Accountability:</strong> Track which user performed each transaction</li>
              <li><strong>Reporting:</strong> Generate reports on transaction history and trends</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Secure authentication and role-based access control for team members.
            </p>
            <ul className="text-sm space-y-2">
              <li><strong>Authentication:</strong> Secure login with session management</li>
              <li><strong>Role-Based Access:</strong> Different permission levels (Admin, Manager, Staff)</li>
              <li><strong>User Profiles:</strong> Individual user settings and preferences</li>
              <li><strong>Audit Trail:</strong> Track user activities and changes</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>IMS - Inventory Management System © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}