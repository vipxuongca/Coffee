## Requirement
- NodeJS
- MongoDB, a database named shop-users should be created

CART SCHEMA
- `userId` (String, required, unique): Identifier for the user owning the cart.
- `items` (Array of Cart Items, default: empty array): List of items in the cart.
CART ITEM SCHEMA
- `productId` (String, required): Identifier for the product.
- `quantity` (Number, required, minimum 1): Quantity of the product in the cart.
- Timestamps: Records creation and update times automatically.

## Installation
install using
`npm install`, then
`npm start`
to start the application
or `npm run dev` for the developing environment

## API endpoints
- **Cart API Endpoints**
  - `GET /api/cart` — Get the user's cart.
  - `POST /api/cart/add` — Add product(s) to cart (requires quantity in body).
  - `PUT /api/cart/update/` — Increase product quantity in cart.
  - `PUT /api/cart/update/decrease/` — Decrease product quantity in cart.
  - `DELETE /api/cart/remove/` — Remove a product from the cart.
  - `DELETE /api/cart/clear` — Clear all items from the cart.
