# Cold Storage System - Agent Instructions

## Build/Test Commands
- **Client Build**: `cd client && npm run build` (Vite + React)
- **Client Dev**: `cd client && npm run dev` (starts on port 5173)
- **Client Lint**: `cd client && npm run lint` (ESLint)
- **Server Start**: `cd server && node server.js` (starts on port 5000)
- **Server Dev**: `cd server && nodemon server.js`
- **Database Test**: `node test_db_connection.js` (test MongoDB connection)

## Architecture
Full-stack MERN application with separate client/server directories:
- **Frontend**: React 19 + Vite + TailwindCSS + React Router
- **Backend**: Express.js + MongoDB/Mongoose + JWT auth
- **Database**: MongoDB with collections: farmers, purchases, sales, customers, stock
- **Key Models**: Farmer, Purchase, Sale, Customer, Stock (all in `/server/models/`)
- **API Routes**: `/api/farmers`, `/api/purchases`, `/api/sales`, `/api/customers`, `/api/otp`

## Code Style
- **Backend**: CommonJS modules, camelCase, extensive console.log debugging
- **Frontend**: ES6 modules, JSX components, functional components with hooks
- **Naming**: Controllers end with 'Controller', models are singular PascalCase
- **Error Handling**: try/catch with structured JSON responses `{success, message, data}`
- **Validation**: Mongoose schemas with enums, required fields, pre-save hooks
- **Import Style**: Backend uses `require()`, Frontend uses ES6 `import`
- **File Structure**: Controllers in `/controllers/`, models in `/models/`, routes in `/routes/`
