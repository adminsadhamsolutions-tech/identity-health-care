# API Structure and Deployment Guide

## Backend API Endpoints

All API endpoints are located in `/backend/api/` directory as individual PHP files:

### Public Endpoints

```
GET  /backend/api/about.php          - Get about section content
GET  /backend/api/hero.php           - Get hero slides list
GET  /backend/api/blogs.php          - Get all blogs
GET  /backend/api/blogs.php?id=1     - Get single blog by ID
GET  /backend/api/testimonials.php   - Get all testimonials
GET  /backend/api/gallery.php        - Get all gallery items
POST /backend/api/appointments.php   - Book appointment
POST /backend/api/login.php          - Admin login
```

### Protected Endpoints (Requires Authorization Header)

```
PUT    /backend/api/about.php        - Update about section
POST   /backend/api/hero.php         - Create hero slide
PUT    /backend/api/hero.php         - Update hero slide
DELETE /backend/api/hero.php?id=1    - Delete hero slide
POST   /backend/api/blogs.php        - Create blog
PUT    /backend/api/blogs.php        - Update blog
DELETE /backend/api/blogs.php?id=1   - Delete blog
POST   /backend/api/testimonials.php - Create testimonial
PUT    /backend/api/testimonials.php - Update testimonial
DELETE /backend/api/testimonials.php?id=1 - Delete testimonial
POST   /backend/api/gallery.php      - Add gallery item
PUT    /backend/api/gallery.php      - Update gallery item
DELETE /backend/api/gallery.php?id=1 - Delete gallery item
GET    /backend/api/appointments.php - Get all appointments (Admin only)
```

## CORS Configuration

All endpoints include proper CORS headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## Authentication

Protected endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <token>
```

Token is obtained from login endpoint and stored in localStorage.

## Frontend API Module

Base URL configuration in `frontend/src/api.js`:

```javascript
const baseURL = process.env.REACT_APP_API_URL || 'https://www.identityphysiocare.in/backend/api';
```

All API calls automatically append `.php` extension to endpoint names:
- `get('/about.php')` → `https://www.identityphysiocare.in/backend/api/about.php`
- `post('/hero.php', data, true)` → `https://www.identityphysiocare.in/backend/api/hero.php`

## Deployment Notes

### For Hostinger:

1. Ensure `.htaccess` file is uploaded to `/backend/` directory
2. Verify mod_rewrite is enabled on the server
3. Database credentials must be updated in `/backend/db.php`
4. Set environment variables on Hostinger control panel

### For Vercel (Frontend):

1. Environment variable must be set:
   ```
   REACT_APP_API_URL=https://www.identityphysiocare.in/backend/api
   ```

2. Build and deploy:
   ```bash
   npm run build
   ```

## Error Handling

All endpoints return JSON with proper HTTP status codes:

- **200**: Success
- **201**: Created (POST successful)
- **400**: Bad request (missing/invalid data)
- **401**: Unauthorized (invalid token)
- **404**: Not found
- **405**: Method not allowed
- **422**: Unprocessable entity (validation error)
- **500**: Server error

## Common Issues and Solutions

### Issue: "Unexpected token '<'" Error
**Cause**: API returning HTML error page instead of JSON (usually 404)
**Solution**: Ensure endpoint URLs include `.php` extension

### Issue: CORS Error
**Cause**: Missing or incorrect CORS headers
**Solution**: All endpoints have been updated with proper CORS headers

### Issue: 307 Temporary Redirect
**Cause**: Old `.htaccess` was redirecting `/api/*` to `api.php`
**Solution**: Updated `.htaccess` to allow direct file access

### Issue: API calls fail on mobile
**Cause**: Using localhost instead of production domain
**Solution**: All endpoints use production domain `https://www.identityphysiocare.in`

## Testing Endpoints

Use curl or Postman to test:

```bash
# Get about section
curl https://www.identityphysiocare.in/backend/api/about.php

# Login
curl -X POST https://www.identityphysiocare.in/backend/api/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'

# Create blog (with token)
curl -X POST https://www.identityphysiocare.in/backend/api/blogs.php \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"...","description":"...","content":"...","media_url":"..."}'
```

## File Structure

```
backend/
├── api.php                    (Legacy - not used, can be kept for reference)
├── db.php                     (Database configuration)
├── .htaccess                  (Routing configuration)
├── api/
│   ├── .htaccess             (API directory security)
│   ├── about.php             (About section endpoints)
│   ├── hero.php              (Hero slides endpoints)
│   ├── blogs.php             (Blog management endpoints)
│   ├── testimonials.php      (Testimonial endpoints)
│   ├── gallery.php           (Gallery management endpoints)
│   ├── appointments.php      (Appointment booking)
│   └── login.php             (Authentication)
└── [database files]

frontend/
├── src/
│   ├── api.js               (API module - centralized axios client)
│   ├── components/
│   │   ├── About.jsx        (Uses /about.php)
│   │   ├── Hero.jsx         (Uses /hero.php)
│   │   ├── Appointment.jsx  (Uses /appointments.php)
│   │   └── Admin/
│   │       ├── Dashboard.jsx (Coordinates all endpoints)
│   │       ├── AboutManager.jsx (Uses /about.php)
│   │       ├── Heromanger.jsx (Uses /hero.php)
│   │       └── [other managers]
│   ├── .env                 (Environment variables)
│   └── .env.example         (Example .env)
└── vite.config.js
```

## Recent Changes

1. **Created individual endpoint files** for all resources in `/backend/api/`
2. **Fixed CORS headers** - consistent across all endpoints
3. **Updated .htaccess** - removed problematic redirect rule causing 307 errors
4. **Updated frontend API module** - correct baseURL without `/api.php`
5. **Updated all components** - using `.php` extensions in endpoint calls
6. **Fixed environment variables** - correct REACT_APP_API_URL in .env files
