# Crave — Food Delivery Frontend

React + Vite frontend for the Food Delivery System and Food Recommendation Assistant.

## Requirements

- Node.js 18+
- The Express backend from `food-delivery-backend`
- MongoDB running for live data

## Run locally

1. Extract this project.
2. Open a terminal inside `food-delivery-frontend`.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Optional: copy `.env.example` to `.env`. By default the app uses `http://localhost:5000/api`.
5. Start the frontend:

   ```bash
   npm run dev
   ```

6. Start the backend in a separate terminal using its README instructions.
7. Open the local URL Vite prints (usually `http://localhost:5173`).

## Pages

- `/` — home and featured food
- `/foods` — searchable food catalog with category and budget filters
- `/foods/:id` — food details
- `/recommendations` — preference-based recommendations
- `/admin` — add, edit, update, search, and delete food records

If the backend is unreachable, customer pages show sample preview data. The admin page disables editing sample rows because they are not database records.

## API configuration

Set `VITE_API_URL` in `.env` if the backend URL differs from `http://localhost:5000/api`.

## Important

## Accounts and permissions

The app includes email/password registration and sign-in without Firebase. New accounts are customers by default. The backend creates an initial admin account from `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `backend/.env`; see the root `README-AUTH-SETUP.md` for credentials and setup. Change the sample admin password and set a private `JWT_SECRET` before deployment. Admin-only menu editing and order records are enforced by the backend. Favorites are currently a local UI interaction and are not persisted.
