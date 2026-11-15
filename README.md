# York University - EECS 4413 - Group G Front-End Application

Wattway Auto is a React single-page application for browsing electric vehicles and managing a shopping cart. It uses React Router for navigation and communicates with the Wattway Auto API.

## Features

- Browse the vehicle catalog and view vehicle details.
- Create an account, log in, and log out.
- Add vehicles to a cart, change quantities, remove individual items, and empty the cart.
- Check out with a shipping address and card, and view past orders and a default shipping address on the account page.
- Display loading states and API errors for data requests.

## Requirements

- Node.js and npm.
- The Wattway Auto backend running at `http://localhost:3000`.

The Vite development server proxies requests beginning with `/api` to the backend at `http://localhost:3000` (see `vite.config.js`).

## Getting started

From the project root, install dependencies and start the development server:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite in your browser. Make sure the backend is running before using features that load or modify vehicles, accounts, sessions, or carts.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot module replacement. |
| `npm run lint` | Run ESLint across the project. |
| `npm run build` | Create the production build in `dist/`. |
| `npm run preview` | Serve the production build locally for preview. |

## Application routes

| Route | Description |
| --- | --- |
| `/` | Vehicle catalog. |
| `/vehicles/:id` | Details for a vehicle, with an add-to-cart action. |
| `/register` | Create an account, optionally with a default shipping address. |
| `/login` | Log in to an account. |
| `/cart` | View and update the signed-in user's cart. |
| `/checkout` | Enter shipping and card details and place an order for the cart. |
| `/account` | Change the default shipping address and view past orders, including denied ones. |

## API usage

The frontend sends same-origin requests under `/api`; in development, Vite forwards them to the backend. Requests that include a JSON body are sent as `application/json`. When a token is available, the API helper attaches it to the request's `Authorization` header. Cart operations require a logged-in user.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/vehicles` | Load the vehicle catalog. |
| `GET` | `/api/vehicles/:id` | Load vehicle details. |
| `POST` | `/api/users` | Register an account. |
| `POST` | `/api/sessions` | Log in and receive a session token. |
| `DELETE` | `/api/sessions/current` | Log out. |
| `GET` | `/api/cart` | Load the current user's cart. |
| `POST` | `/api/cart/items` | Add a vehicle to the cart. |
| `PATCH` | `/api/cart/items/:vehicleId` | Change a cart item's quantity. |
| `DELETE` | `/api/cart/items/:vehicleId` | Remove an item from the cart. |
| `DELETE` | `/api/cart` | Empty the cart. |
| `GET` | `/api/users/me` | Load the user's account page. |
| `PATCH` | `/api/users/me` | Save the default shipping address. |
| `POST` | `/api/orders` | Place an order for the cart. |
| `GET` | `/api/orders` | Load the user's past orders. |
