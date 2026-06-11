# API Documentation - Myntra Clone

## Authentication APIs

| Endpoint           | Method | Purpose                    |
| ------------------ | ------ | -------------------------- |
| /api/auth/register | POST   | Register a new user        |
| /api/auth/login    | POST   | Login user                 |
| /api/auth/profile  | GET    | Get logged-in user profile |
| /api/auth/profile  | PATCH  | Update user profile        |

---

## Product APIs

| Endpoint          | Method | Purpose                        |
| ----------------- | ------ | ------------------------------ |
| /api/products     | GET    | Get all products               |
| /api/products/:id | GET    | Get single product details     |
| /api/products     | POST   | Create a new product (Admin)   |
| /api/products/:id | PATCH  | Update product details (Admin) |
| /api/products/:id | DELETE | Delete product (Admin)         |

---

## Review APIs

| Endpoint                        | Method | Purpose                               |
| ------------------------------- | ------ | ------------------------------------- |
| /api/reviews                    | POST   | Add a product review                  |
| /api/reviews/product/:productId | GET    | Get reviews for a product             |
| /api/reviews/:id                | PATCH  | Update own review                     |
| /api/reviews/:id                | DELETE | Delete own review or admin moderation |

---

## Cart APIs

| Endpoint                    | Method | Purpose                         |
| --------------------------- | ------ | ------------------------------- |
| /api/cart                   | GET    | Get logged-in user's cart       |
| /api/cart/add               | POST   | Add product to cart             |
| /api/cart/update            | PATCH  | Update product quantity in cart |
| /api/cart/remove/:productId | DELETE | Remove product from cart        |
| /api/cart/clear             | DELETE | Clear entire cart               |

---

## Order APIs

| Endpoint              | Method | Purpose                     |
| --------------------- | ------ | --------------------------- |
| /api/orders           | POST   | Create a new order          |
| /api/orders/my-orders | GET    | Get logged-in user's orders |
| /api/orders/:id       | GET    | Get single order details    |

---

## Payment APIs

| Endpoint                  | Method | Purpose                 |
| ------------------------- | ------ | ----------------------- |
| /api/payment/create-order | POST   | Create Razorpay order   |
| /api/payment/verify       | POST   | Verify Razorpay payment |

---

## Admin APIs

| Endpoint                     | Method | Purpose                  |
| ---------------------------- | ------ | ------------------------ |
| /api/admin/users             | GET    | Get all users            |
| /api/admin/orders            | GET    | Get all orders           |
| /api/admin/orders/:id/status | PATCH  | Update order status      |
| /api/admin/dashboard         | GET    | Get dashboard statistics |

---

# Authorization Rules

## Public APIs

* View products
* View product details
* View product reviews

## User APIs

* Manage profile
* Manage cart
* Create orders
* Add reviews
* Update own reviews
* Delete own reviews

## Admin APIs

* Manage products
* View all users
* View all orders
* Update order status
* Moderate reviews
* View dashboard statistics
