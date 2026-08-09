# Uber MERN Clone

A full-stack ride-hailing web application that replicates the core Uber experience — user and captain authentication, live ride booking, real-time driver matching within a radius, live location tracking, OTP-verified ride start, and a complete ride lifecycle. Built with the **MERN stack** plus **Socket.io** for real-time communication.

The entire geolocation stack (map display, geocoding, routing, autocomplete) uses **free, open-source services** — no paid API keys required.

---

## Highlights

- **Dual role system** — separate authentication and flows for **Riders** and **Captains** (drivers)
- **Real-time everything** — Socket.io powers live ride notifications and location updates
- **Live driver matching** — captains within **2 km** of the pickup point are notified instantly via Haversine geo-query
- **Full ride lifecycle** — request → fare estimate → driver accept → OTP verification → start → complete
- **No API keys needed** — Leaflet + OpenStreetMap for the map, Nominatim for geocoding, OSRM for routing
- **JWT-based auth** — secure httpOnly cookie + Bearer token strategy, bcrypt-hashed passwords
- **Modern React stack** — React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Redux Toolkit, GSAP animations

---

## Features

### Riders
- Sign up / log in / log out
- Live map with current location marker (geolocation)
- Address autocomplete while typing
- Pick pickup & destination, get real distance and multi-vehicle fare estimates (auto / car / motorcycle)
- Book a ride and watch for an available captain
- Ride confirmation popup, in-ride screen, and OTP shown to share with the captain

### Captains
- Sign up with vehicle details (color, plate, capacity, type) / log in / log out
- Continuous live location broadcasting to the server (every 10 seconds)
- Receive new-ride requests for trips within 2 km of their location
- Accept rides, view the OTP on the confirmation popup, and start the ride
- Finish rides and return to the home screen

### System
- REST API with input validation and error handling
- JWT authentication middleware for both user and captain routes
- Fare calculation engine (base + per-km + per-minute rates per vehicle)
- 6-digit OTP ride verification
- Responsive, animated mobile-first UI

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React 18, TypeScript, Vite 6, Tailwind CSS 3, shadcn/ui (Radix), Redux Toolkit + RTK Query, react-router-dom 7, react-hook-form + Zod, GSAP, Leaflet |
| **Backend** | Node.js, Express 4, Socket.io 4 |
| **Database** | MongoDB + Mongoose 8 |
| **Auth** | JWT (jsonwebtoken), bcrypt, cookie-parser |
| **Maps (free)** | Leaflet + OpenStreetMap tiles, Nominatim (geocoding/autocomplete), OSRM (routing) |

---

## Project Structure

```
Uber_MERN/
├── Backend/                 # Express + Socket.io API server (CommonJS)
│   ├── server.js            # HTTP server + socket.io initialization
│   ├── index.js             # Express app, middleware, route mounting
│   ├── socket.js            # Socket.io handlers (join, location updates)
│   ├── models/              # Mongoose models: user, captain, ride
│   ├── controllers/         # user, captain, map, ride controllers
│   ├── routes/              # user, captain, map, ride route definitions
│   ├── services/            # map-service (geocoding/routing), ride-service (fare/OTP)
│   ├── middlewares/         # auth-middleware (JWT verification)
│   ├── db/                  # MongoDB connection
│   └── .env                 # environment variables
└── Frontend/                # React + TypeScript + Vite SPA
    ├── vite.config.ts       # Vite config with `@` -> src alias
    ├── tailwind.config.js   # Tailwind + shadcn theme tokens
    └── src/
        ├── main.tsx         # React entry point
        ├── App.tsx          # Route definitions
        ├── lib/             # shared utilities (cn helper)
        └── Components/
            ├── Pages/       # Start, login/signup, Home, CaptainHome, Riding, etc.
            ├── components/  # ride panels, LiveLocation (Leaflet map), popups
            ├── Redux/       # store, slices (user, captain, socket), RTK Query API
            ├── ui/          # shadcn/ui primitives
            └── Utils/       # Axios instance, interfaces, helpers, hooks
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later — uses native `fetch`)
- [MongoDB](https://www.mongodb.com/) running locally (default: `mongodb://127.0.0.1:27017/uber-app`)
- npm (bundled with Node.js)

### 1. Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
PORT=5003
MONGODB_URI="mongodb://127.0.0.1:27017/uber-app"
JWT_SECRET="your-secret-key"
FRONT_END_URL="http://localhost:5173"
```

Start the server (nodemon auto-reloads on changes):

```bash
npm start
```

Server runs at `http://localhost:5003`.

### 2. Frontend setup

```bash
cd Frontend
npm install
```

Create a `.env` file in `Frontend/`:

```env
VITE_BACKEND_URL=http://localhost:5003
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173`.

> **No Google Maps API key needed** — the map uses Leaflet with free OpenStreetMap tiles.

---

## API Reference

Base URL: `http://localhost:5003`

### Authentication

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/users/register` | — | Register a rider |
| POST | `/users/login` | — | Rider login |
| GET | `/users/profile` | rider | Get rider profile |
| GET | `/users/logout` | — | Log out rider |
| POST | `/captains/register` | — | Register a captain (with vehicle) |
| POST | `/captains/login` | — | Captain login |
| GET | `/captains/profile` | captain | Get captain profile |
| GET | `/captains/logout` | — | Log out captain |
| GET | `/auth/validate-user` | rider | Validate rider token |
| GET | `/auth/validate-captain` | captain | Validate captain token |

### Maps

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/maps/get-coordinates?address=` | rider | Geocode an address (Nominatim) |
| GET | `/maps/get-distance-time?pickup=&destination=` | rider | Route distance & duration (OSRM) |
| GET | `/maps/get-suggestions?query=` | rider | Address autocomplete suggestions |

### Rides

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/rides/create` | rider | Create a ride & notify nearby captains |
| GET | `/rides/get-fare?pickup=&destination=` | — | Fare estimate for all vehicle types |
| POST | `/rides/confirm` | captain | Accept a ride (returns the OTP) |
| GET | `/rides/start-ride?rideID=&otp=` | captain | Verify OTP and start the ride |
| POST | `/rides/end-ride` | captain | Complete the ride |

---

## Real-time Flow (Socket.io)

Socket events exchanged between the browser and the backend:

| Event | Direction | Purpose |
| --- | --- | --- |
| `join` | client → server | Register socket ID against a user/captain |
| `update-captain-location` | client → server | Push captain location (every 10s) |
| `new-ride` | server → captains | Notify captains within 2 km of a new ride |
| `ride-confirm` | server → rider | Ride accepted by a captain |
| `ride-started` | server → rider | OTP verified, ride is ongoing |
| `ride-ended` | server → rider | Ride completed |

**Booking flow:**
1. Rider enters pickup & destination → backend computes distance + fare (OSRM + fare engine).
2. Rider creates the ride → backend broadcasts `new-ride` to captains within 2 km (Haversine).
3. A captain accepts → `ride-confirm` notifies the rider.
4. The captain reads the OTP from the confirmation popup and enters it → backend verifies → `ride-started` redirects both to the in-ride screen.
5. Captain finishes the ride → `ride-ended` returns the rider home.

---

## Maps & Geolocation (No API Keys)

| Need | Service |
| --- | --- |
| Map display | **Leaflet** + OpenStreetMap tile server |
| Geocoding (address → lat/lon) | **Nominatim** (OpenStreetMap) |
| Routing (distance / duration) | **OSRM** public router |
| Address autocomplete | **Nominatim** search |

Nominatim requires a descriptive `User-Agent` header, which the backend sets on every request.

---

## Environment Variables

### Backend (`.env`)
| Variable | Description |
| --- | --- |
| `PORT` | Server port (default 5003) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JSON Web Tokens |
| `FRONT_END_URL` | Allowed CORS / Socket.io origin |

### Frontend (`.env`)
| Variable | Description |
| --- | --- |
| `VITE_BACKEND_URL` | Backend base URL (e.g. `http://localhost:5003`) |

---

## Security Notes

- Passwords are hashed with **bcrypt** (10 salt rounds).
- JWT is stored in an **httpOnly cookie** (`secure`, `sameSite: none`) and mirrored in `localStorage` for the `Authorization: Bearer` header.
- The captain-in-radius query only matches captains with a location set.
- The ride OTP is stored with `select: false` and is only surfaced on confirmation.

> **Warning:** do not commit real secrets (e.g. `JWT_SECRET`, database credentials) to version control. Use a `.env.example` file instead.

---

## Roadmap / Future Improvements

- Payments integration (Razorpay fields already exist in the ride model)
- Admin dashboard & role management
- Ride history for users and captains
- Captain status toggling (active / inactive) and ride ratings
- Route polyline display on the map
- Automated tests (backend unit/integration, frontend component tests)

---

## License

This project is for educational purposes. It is not affiliated with or endorsed by Uber Technologies, Inc.
