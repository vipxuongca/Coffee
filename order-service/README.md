## Requirement
- NodeJS
- MongoDB, a database named shop-users should be created

ORDER ITEM SCHEMA
  - productId
  - quantity
  - price

ORDER SCHEMA
  - userId 
  - items
  - total
  - status
  - Timestamps

## Installation
install using
`npm install`, then
`npm start`
to start the application
or `npm run dev` for the developing environment

## API endpoints
- **Order API**  
  - `POST /api/order/create`: Create new Order. Craeted at the time the order is placed by an user
  - `GET /api/order/get-one`: Get one order of a certain user. Mostly used for the display of successful ordering
  - `GET /api/order/get-user`: Get all orders associated with a certain user. Used to display all orders an user made, either from administration dashboard, or, at the User Account
