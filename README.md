# Identity Health Care

A modern full-stack healthcare website for a women-focused wellness studio.

## Project structure

- `/frontend` – React web app with public landing pages and admin dashboard
- `/backend` – PHP REST API with secure endpoints and MySQL data storage
- `database.sql` – MySQL schema and sample data

## Frontend setup

1. Open a terminal in `c:\xampp\htdocs\identitiyhos\frontend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and confirm API URL:
   ```env
   REACT_APP_API_URL=http://localhost/identitiyhos/backend/api.php
   ```
4. Start the React app:
   ```bash
   npm start
   ```
5. Open the site at `https://identityphysiocare.in`

## Backend setup

1. Place the `backend` folder inside your XAMPP `htdocs` directory (already in project root).
2. Import the database schema into MySQL using phpMyAdmin or the command line.
   - If using CLI:
     ```bash
     mysql -u root -p < database.sql
     ```
   - If no password is set for root, omit `-p`.
3. Confirm the database name is `identity_health_care` and tables exist.
4. Ensure PHP is running in XAMPP and the backend folder is accessible at:
   `http://localhost/identitiyhos/backend/api.php`

## Admin access

- Username: `admin`
- Password: `Admin@123`

To log in, visit:

- `https://identityphysiocare.in/admin/login`

## API endpoints

- `POST /api/appointments` – submit appointment requests
- `GET /api/blogs` – list blogs
- `GET /api/blogs/{id}` – single blog details
- `POST /api/blogs` – create blog (admin)
- `PUT /api/blogs/{id}` – update blog (admin)
- `DELETE /api/blogs/{id}` – delete blog (admin)
- `GET /api/testimonials` – fetch testimonials
- `POST /api/testimonials` – add testimonial (admin)
- `GET /api/gallery` – gallery items
- `POST /api/gallery` – add gallery media (admin)
- `GET /api/appointments` – view requests (admin)
- `POST /api/login` – admin authentication

## Notes

- The React app uses Axios for API calls and React Router for page navigation.
- The backend uses PDO with prepared statements for secure database access.
- All API responses are JSON.

## Troubleshooting

- If the frontend cannot reach the backend, ensure the `REACT_APP_API_URL` value in `.env.local` matches the XAMPP path.
- If API calls return `401`, refresh your admin login and ensure the token is stored in local storage.
- To update backend database settings, edit `backend/db.php`.
