# ProOmo - Influencer Platform

This is a professional influencer marketing platform that connects creators/influencers with brands/businesses for paid promotions.

## Tech Stack

**Backend:** Django REST Framework, PostgreSQL, JWT Authentication (via Supabase integration)
**Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, Axios, Zustand (for state)
**Auth:** Supabase (Email/Password + Google OAuth)
**Database:** Supabase PostgreSQL
**Storage:** (Future: Cloudinary or AWS S3 for image uploads)
**Deployment:** Docker-ready configuration

## Getting Started

To run this project locally using Docker, follow these steps:

### 1. Clone the Repository

```bash
git clone [your-repo-url]
cd proomo
```

### 2. Environment Variables

Create a `.env` file in the `backend/` directory and add your Django secret key:

```
# backend/.env
DJANGO_SECRET_KEY=your_super_secret_django_key_here
DJANGO_DEBUG=True
```
**Note:** For production, ensure `DJANGO_DEBUG` is `False` and `DJANGO_SECRET_KEY` is a strong, unique value.

The Supabase environment variables for the frontend are already set in `docker-compose.yml`.

### 3. Build and Run with Docker Compose

From the root directory of the project, run:

```bash
docker-compose up --build
```

This command will:
- Build the Docker images for both the backend and frontend.
- Start the PostgreSQL database, Django backend, and Next.js frontend services.
- Run Django database migrations automatically.

### 4. Access the Application

Once all services are up:
- **Frontend:** Access the Next.js application at `http://localhost:3000`
- **Backend (Django):** The Django API will be running at `http://localhost:8000`
- **PostgreSQL:** The database will be accessible on port `5432`

### 5. Supabase Setup (Already Handled by Dyad)

The necessary Supabase client and database schema (profiles table, new user trigger) have been set up for you.

### 6. Next Steps

- Register a new user via the frontend `/auth/register` page.
- Explore the authentication flow.
- Start building out the Creator Profile and Offers modules!