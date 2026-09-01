# FITD — Frontend

FITD (Fit It Different) is a modern fashion e-commerce web application designed to provide customers with a simple, responsive, and user-friendly shopping experience.

The frontend provides the customer-facing shopping interface as well as the administrative dashboard for managing the store.

## Features

### Customer Features

* Browse products
* Browse products by category
* Filter products
* Search products
* View product details
* Select product variants such as size, color, or shade
* Add products to cart
* Update cart quantities
* Remove products from cart
* Add products to wishlist
* User registration and login
* Profile management
* Profile picture support
* Change password
* Forgot password functionality
* Password reset through email
* Checkout
* Order placement
* View order history
* View order details
* Track order status
* Contact the store
* Responsive design for desktop, tablet, and mobile devices

### Admin Features

* Admin dashboard
* View store statistics
* View total products
* View orders by status
* View recent orders
* Manage products
* Create products
* Update products
* Delete products
* Manage categories
* Manage inventory
* Manage orders
* Update order status
* View customer information

### Owner Features

The owner has additional access to:

* Total revenue statistics
* User management
* Administrative controls
* Store management overview

## Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* TanStack React Query
* TanStack Form
* Axios
* Zod

### Authentication

Authentication is handled using JWT tokens provided by the backend API.

The frontend stores the authentication token and user information locally and uses them to maintain the user's session.

## Project Structure

```text
fitted-frontend/
│
├── public/
│   └── images/
│
├── src/
│   ├── app/
│   │   ├── account/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   ├── products/
│   │   ├── wishlist/
│   │   └── dashboard/
│   │
│   ├── components/
│   │   ├── Navbar
│   │   ├── Footer
│   │   ├── ProductCard
│   │   ├── BreadCrumbs
│   │   ├── CartDrawer
│   │   └── ...
│   │
│   ├── hooks/
│   │
│   ├── lib/
│   │   ├── axios.ts
│   │   └── validation/
│   │
│   ├── providers/
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── category.service.ts
│   │   ├── order.service.ts
│   │   └── dashboard.service.ts
│   │
│   ├── store/
│   │   └── ...
│   │
│   └── types/
│
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables

Create a `.env.local` file in the frontend root directory.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production, replace the local backend URL with the deployed backend URL.

Example:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

Do not commit `.env.local` to GitHub.

## Installation

Clone the repository and install the dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

## Production Build

Create a production build:

```bash
npm run build
```

Start the production application:

```bash
npm start
```

## API Communication

The frontend communicates with the Express backend through Axios.

The API layer is organized into service files such as:

* Authentication service
* Product service
* Category service
* Order service
* Dashboard service

TanStack React Query is used for fetching, caching, and synchronizing server-side data.

## Validation

Zod is used to validate user input before requests are sent to the backend.

Examples include:

* Login validation
* Registration validation
* Product validation
* Category validation
* Password validation
* Checkout validation

This provides users with immediate feedback and helps prevent invalid requests.

## Responsive Design

The interface is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile devices

The styling uses Tailwind CSS with a minimal fashion-oriented visual design.

## Deployment

The frontend can be deployed as a Next.js application.

The production deployment requires the frontend environment variable to point to the deployed backend API.

Example:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

The frontend and backend are deployed separately.

## Security Considerations

* Authentication uses JWT tokens.
* Passwords are never displayed in the frontend.
* Sensitive environment variables are not committed to GitHub.
* User input is validated before submission.
* Authentication state is checked before accessing protected functionality.
* Administrative functionality is restricted according to the user's role.

## Project Goal

The goal of FITD is to provide a complete e-commerce experience for a fashion store while offering administrators an efficient interface for managing products, categories, inventory, customers, and orders.
