# Database Design - Myntra Clone

## Database

MongoDB

---

# Collections

## 1. Users Collection

### Purpose

Stores customer and admin account information.

### Fields

| Field         | Type     | Description          |
| ------------- | -------- | -------------------- |
| _id           | ObjectId | Unique identifier    |
| firstName     | String   | User first name      |
| lastName      | String   | User last name       |
| email         | String   | Unique email address |
| password      | String   | Hashed password      |
| phone         | String   | Contact number       |
| address       | Object   | Shipping address     |
| role          | String   | user/admin           |
| isActive      | Boolean  | Account status       |
| wishlistItems | Array    | Wishlist products    |
| cartItems     | Array    | Cart products        |
| createdAt     | Date     | Creation timestamp   |
| updatedAt     | Date     | Update timestamp     |

### Address Structure

```js
address: {
  street: String,
  city: String,
  state: String,
  pincode: String
}
```

### Wishlist Structure

```js
wishlistItems: [
  {
    productId: ObjectId
  }
]
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

Stores all products managed by Admin.

### Fields

| Field         | Type          | Description                                 |
| ------------- | ------------- | ------------------------------------------- |
| _id           | ObjectId      | Unique identifier                           |
| name          | String        | Product name                                |
| description   | String        | Product description                         |
| category      | String        | Men, Women, Kids, Beauty, Home, Electronics |
| subCategory   | String        | T-Shirts, Jeans, Mobile, Shoes etc.         |
| brand         | String        | Nike, Apple, Samsung, Puma etc.             |
| price         | Number        | Original price                              |
| discountPrice | Number        | Discounted price                            |
| stock         | Number        | Available inventory                         |
| sizes         | Array[String] | Available sizes                             |
| colors        | Array[String] | Available colors                            |
| images        | Array[String] | Cloudinary image URLs                       |
| averageRating | Number        | Average product rating                      |
| reviewsCount  | Number        | Total reviews count                         |
| totalViews    | Number        | Number of product views                     |
| isFeatured    | Boolean       | Featured on homepage                        |
| isActive      | Boolean       | Product availability                        |
| createdAt     | Date          | Creation timestamp                          |
| updatedAt     | Date          | Update timestamp                            |

### Example Sizes

```js
sizes: ["S", "M", "L", "XL"]
```

```js
sizes: ["7", "8", "9", "10"]
```

### Example Colors

```js
colors: ["Black", "White", "Blue"]
```

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
| rating    | Number   | Rating (1–5 stars)   |
| comment   | String   | Review text          |
| createdAt | Date     | Creation timestamp   |
| updatedAt | Date     | Update timestamp     |

---

## 4. Orders Collection

### Purpose

Stores customer orders and payment information.

### Fields

| Field           | Type     | Description                                        |
| --------------- | -------- | -------------------------------------------------- |
| _id             | ObjectId | Unique identifier                                  |
| userId          | ObjectId | Reference to User                                  |
| orderItems      | Array    | Purchased products                                 |
| shippingAddress | Object   | Delivery address                                   |
| paymentMethod   | String   | Razorpay, COD                                      |
| paymentStatus   | String   | pending, completed, failed                         |
| orderStatus     | String   | pending, processing, shipped, delivered, cancelled |
| totalPrice      | Number   | Order amount                                       |
| taxPrice        | Number   | Tax amount                                         |
| shippingPrice   | Number   | Shipping charge                                    |
| razorpayOrderId | String   | Razorpay payment reference                         |
| createdAt       | Date     | Creation timestamp                                 |
| updatedAt       | Date     | Update timestamp                                   |

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

### Shipping Address Structure

```js
shippingAddress: {
  street: String,
  city: String,
  state: String,
  pincode: String
}
```

---

# Relationships

## User → Orders

```text
1 User → Many Orders
```

---

## User → Reviews

```text
1 User → Many Reviews
```

---

## Product → Reviews

```text
1 Product → Many Reviews
```

---

## User → Wishlist

```text
1 User → Many Wishlist Items
```

---

## User → Cart

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
* brand
* price

## Orders

* userId
* createdAt
* orderStatus

## Reviews

* productId
* userId

---

# Business Rules

### User Roles

```text
user
admin
```

Admin acts as Vendor/Seller for this project.

---

### Product Ratings

* Ratings are stored in Reviews collection.
* Product collection stores:

  * averageRating
  * reviewsCount

These values are updated whenever a review is added, updated, or deleted.

---

### Product Images

* Images are stored in Cloudinary.
* MongoDB stores only image URLs.

Example:

```js
images: [
  "https://res.cloudinary.com/xyz/image/upload/product1.jpg"
]
```

---

### Order Price Snapshot

Orders store:

```js
priceAtPurchase
```

This ensures historical order data remains correct even if product prices change later.

---

### Wishlist

Users can:

* Add products to wishlist
* Remove products from wishlist
* Move products from wishlist to cart

---

### Cart (Bag)

Users can:

* Add products to cart
* Update quantity
* Remove products
* Checkout and create orders


