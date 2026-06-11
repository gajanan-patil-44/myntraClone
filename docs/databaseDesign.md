# Database Design - Myntra Clone

## Database

MongoDB

---

# Collections

## 1. Users Collection

### Purpose

Stores customer and admin account information.

### Fields

| Field     | Type     | Description        |
| --------- | -------- | ------------------ |
| _id       | ObjectId | Unique identifier  |
| firstName | String   | User first name    |
| lastName  | String   | User last name     |
| email     | String   | Unique email       |
| password  | String   | Hashed password    |
| phone     | String   | Contact number     |
| address   | Object   | Shipping address   |
| role      | String   | user/admin         |
| cartItems | Array    | User cart products |
| createdAt | Date     | Creation timestamp |
| updatedAt | Date     | Update timestamp   |

### Address Structure

```js
address: {
  street: String,
  city: String,
  state: String,
  pincode: String
}
```

### Cart Structure

```js
cartItems: [
  {
    productId: ObjectId,
    quantity: Number
  }
]
```

---

## 2. Products Collection

### Purpose

Stores product information managed by admin.

### Fields

| Field         | Type          | Description                 |
| ------------- | ------------- | --------------------------- |
| _id           | ObjectId      | Unique identifier           |
| name          | String        | Product name                |
| description   | String        | Product description         |
| brand         | String        | Brand name                  |
| category      | String        | Men/Women/Kids/Home/Beauty  |
| subCategory   | String        | T-Shirts, Jeans, Shoes etc. |
| price         | Number        | Original price              |
| discountPrice | Number        | Discounted price            |
| stock         | Number        | Available quantity          |
| images        | Array[String] | Cloudinary image URLs       |
| averageRating | Number        | Average rating              |
| reviewsCount  | Number        | Total reviews               |
| totalViews    | Number        | Product views               |
| isActive      | Boolean       | Product availability        |
| createdAt     | Date          | Creation timestamp          |
| updatedAt     | Date          | Update timestamp            |

---

## 3. Reviews Collection

### Purpose

Stores product reviews and ratings.

### Fields

| Field     | Type     | Description          |
| --------- | -------- | -------------------- |
| _id       | ObjectId | Unique identifier    |
| userId    | ObjectId | Reference to User    |
| productId | ObjectId | Reference to Product |
| rating    | Number   | Rating (1-5)         |
| comment   | String   | Review text          |
| createdAt | Date     | Creation timestamp   |

---

## 4. Orders Collection

### Purpose

Stores customer orders and payment information.

### Fields

| Field           | Type     | Description                                    |
| --------------- | -------- | ---------------------------------------------- |
| _id             | ObjectId | Unique identifier                              |
| userId          | ObjectId | Reference to User                              |
| orderItems      | Array    | Purchased products                             |
| shippingAddress | Object   | Delivery address                               |
| paymentStatus   | String   | pending/completed/failed                       |
| orderStatus     | String   | pending/processing/shipped/delivered/cancelled |
| totalPrice      | Number   | Order amount                                   |
| taxPrice        | Number   | Tax amount                                     |
| shippingPrice   | Number   | Shipping charge                                |
| razorpayOrderId | String   | Razorpay reference                             |
| createdAt       | Date     | Creation timestamp                             |
| updatedAt       | Date     | Update timestamp                               |

### Order Item Structure

```js
orderItems: [
  {
    productId: ObjectId,
    name: String,
    image: String,
    priceAtPurchase: Number,
    quantity: Number
  }
]
```

---

# Relationships

## User → Order

```text
1 User → Many Orders
```

---

## User → Review

```text
1 User → Many Reviews
```

---

## Product → Review

```text
1 Product → Many Reviews
```

---

## User → Cart Items

```text
1 User → Many Cart Items
```

---

# Indexes

## Users

* email (unique)
* role

## Products

* name
* category
* subCategory
* price

## Orders

* userId
* createdAt

## Reviews

* productId
* userId
