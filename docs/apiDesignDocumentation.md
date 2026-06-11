# API Documentation - Myntra Clone

## Base URL

```text
/api
```

---

# Authentication APIs

### Purpose

Manage user registration, login, and profile.

| Endpoint       | Method | Purpose                       |
| -------------- | ------ | ----------------------------- |
| /auth/register | POST   | Register a new user           |
| /auth/login    | POST   | Login user                    |
| /auth/profile  | GET    | Get logged-in user profile    |
| /auth/profile  | PATCH  | Update logged-in user profile |

---

# Product APIs

### Purpose

Manage products and product listings.

| Endpoint      | Method | Purpose                        |
| ------------- | ------ | ------------------------------ |
| /products     | GET    | Get all products               |
| /products/:id | GET    | Get single product details     |
| /products     | POST   | Create a new product (Admin)   |
| /products/:id | PATCH  | Update product details (Admin) |
| /products/:id | DELETE | Delete product (Admin)         |

### Example Filters

```text
/products?category=Men

/products?category=Men&subCategory=T-Shirts

/products?brand=Nike

/products?color=Black

/products?size=M

/products?minPrice=1000&maxPrice=5000
```

---

# Wishlist APIs

### Purpose

Manage user wishlist.

| Endpoint                    | Method | Purpose                      |
| --------------------------- | ------ | ---------------------------- |
| /wishlist                   | GET    | Get user's wishlist          |
| /wishlist/add               | POST   | Add product to wishlist      |
| /wishlist/remove/:productId | DELETE | Remove product from wishlist |

---

# Cart (Bag) APIs

### Purpose

Manage shopping cart.

| Endpoint                | Method | Purpose                  |
| ----------------------- | ------ | ------------------------ |
| /cart                   | GET    | Get user's cart          |
| /cart/add               | POST   | Add product to cart      |
| /cart/update            | PATCH  | Update product quantity  |
| /cart/remove/:productId | DELETE | Remove product from cart |
| /cart/clear             | DELETE | Clear entire cart        |

---

# Review APIs

### Purpose

Manage product reviews and ratings.

| Endpoint                    | Method | Purpose                               |
| --------------------------- | ------ | ------------------------------------- |
| /reviews                    | POST   | Add product review                    |
| /reviews/product/:productId | GET    | Get reviews for a product             |
| /reviews/:id                | PATCH  | Update own review                     |
| /reviews/:id                | DELETE | Delete own review or admin moderation |

---

# Order APIs

### Purpose

Manage customer orders.

| Endpoint          | Method | Purpose                     |
| ----------------- | ------ | --------------------------- |
| /orders           | POST   | Create new order            |
| /orders/my-orders | GET    | Get logged-in user's orders |
| /orders/:id       | GET    | Get single order details    |

---

# Payment APIs

### Purpose

Handle Razorpay payments.

| Endpoint              | Method | Purpose                 |
| --------------------- | ------ | ----------------------- |
| /payment/create-order | POST   | Create Razorpay order   |
| /payment/verify       | POST   | Verify Razorpay payment |

---

# Admin APIs

### Purpose

Administrative operations.

## User Management

| Endpoint                | Method | Purpose                  |
| ----------------------- | ------ | ------------------------ |
| /admin/users            | GET    | Get all users            |
| /admin/users/:id        | GET    | Get single user details  |
| /admin/users/:id/status | PATCH  | Activate/Deactivate user |

---

## Product Management

| Endpoint        | Method | Purpose                               |
| --------------- | ------ | ------------------------------------- |
| /admin/products | GET    | Get all products for admin management |

---

## Order Management

| Endpoint                 | Method | Purpose             |
| ------------------------ | ------ | ------------------- |
| /admin/orders            | GET    | Get all orders      |
| /admin/orders/:id        | GET    | Get single order    |
| /admin/orders/:id/status | PATCH  | Update order status |

---

## Dashboard

| Endpoint         | Method | Purpose                  |
| ---------------- | ------ | ------------------------ |
| /admin/dashboard | GET    | Get dashboard statistics |

---

# Authorization Rules

## Public APIs

* View all products
* View product details
* View product reviews

---

## User APIs

Authenticated users can:

* Manage profile
* Manage wishlist
* Manage cart
* Create orders
* View own orders
* Add reviews
* Update own reviews
* Delete own reviews

---

## Admin APIs

Admins can:

* Manage products
* Manage users
* Manage orders
* Moderate reviews
* View dashboard statistics

---

# Order Status Values

```text
pending
processing
shipped
delivered
cancelled
```

---

# Payment Status Values

```text
pending
completed
failed
```

---

# User Roles

```text
user
admin
```

Admin acts as Vendor/Seller in this project.
