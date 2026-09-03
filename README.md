# Daily Wander — Full Stack Application

Daily Wander is a warm, intimate, daily photo journal where people around the world leave a small piece of their day. At midnight (Asia/Kolkata), yesterday disappears.

---

## 1. Production Architecture

```text
User Browser
     │
     ▼
  Vercel (React 19 + Vite SPA Frontend)
     │
     │ HTTPS REST API requests
     ▼
  Render Free/Hobby Web Service (Spring Boot 3 + Java 21)
     │
     ├──► Supabase PostgreSQL (Posts Table & Advisory Quota Locks)
     │
     └──► Supabase Storage (Bucket: moments / Processed WebP Images)
```

---

## 2. Key Features

- **Single-Focus Wander Discovery**: Explore one moment at a time via a stable client-side Fisher–Yates shuffle session with zero duplicate moments per cycle.
- **Image Processing Pipeline**: Multipart uploads are validated in-memory, resized to a max width of 1600px, converted to WebP (`.webp`), and compressed toward ~800KB–1MB before uploading to Supabase Storage.
- **100-Photo Daily Quota**: Strict server-side quota serialized via PostgreSQL transactional advisory locks (`pg_advisory_xact_lock`). Text-only moments are unlimited.
- **Midnight Cleanup (Asia/Kolkata)**: Scheduled `@Scheduled` cleanup at `00:05` IST plus lazy cleanup fallback on `GET /api/posts/today` if the server slept through midnight.
- **Admin Deletion & Global Error Handling**: Protected deletion endpoint (`DELETE /api/posts/{id}`) with constant-time token verification and standardized JSON error responses.

---

## 3. Local Development

### Prerequisites
- Java 21
- Maven 3.9+ (or use `./mvnw`)
- Node.js 20+ and npm

### Backend Setup
1. Create `.env` in the project root:
   ```env
   DB_URL=jdbc:postgresql://<POOLER_HOST>:5432/postgres?sslmode=require
   DB_USERNAME=<SUPABASE_USER>
   DB_PASSWORD=<SUPABASE_PASSWORD>
   SUPABASE_URL=https://<PROJECT_REF>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<SERVICE_ROLE_KEY>
   SUPABASE_STORAGE_BUCKET=moments
   ADMIN_TOKEN=<SECRET_ADMIN_TOKEN>
   DAILY_PHOTO_LIMIT=100
   PORT=8080
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   ```
2. Start the Spring Boot backend:
   ```bash
   set -a && . ./.env && set +a && ./mvnw spring-boot:run
   ```
3. Verify backend health:
   ```bash
   curl http://localhost:8080/api/health
   # Returns: {"status":"UP","database":"UP"}
   ```

### Frontend Setup
1. Create `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SUPABASE_STORAGE_BASE=https://<PROJECT_REF>.supabase.co/storage/v1/object/public/moments
   ```
2. Install dependencies & start Vite dev server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## 4. Production Deployment

### A. Deploy Backend to Render (Free Web Service)
1. Push this repository to GitHub.
2. In the Render Dashboard, create a **New Web Service** and select your GitHub repository.
3. Configure the service:
   - **Environment**: `Java` (or Docker)
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/daily-wander-0.0.1-SNAPSHOT.jar`
   - **Health Check Path**: `/api/health`
4. In Render's **Environment Variables** section, configure:
   - `DB_URL`: Production Supabase JDBC URL (`jdbc:postgresql://...`)
   - `DB_USERNAME`: Supabase database username
   - `DB_PASSWORD`: Supabase database password
   - `SUPABASE_URL`: Supabase project URL (`https://<project-ref>.supabase.co`)
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase server-side service-role secret key
   - `SUPABASE_STORAGE_BUCKET`: `moments`
   - `ADMIN_TOKEN`: Secret administrative token
   - `DAILY_PHOTO_LIMIT`: `100`
   - `JAVA_TOOL_OPTIONS`: `-XX:MaxRAMPercentage=70.0 -XX:InitialRAMPercentage=20.0`
   - `CORS_ALLOWED_ORIGINS`: `https://*.vercel.app,https://<your-vercel-domain>.vercel.app`
5. Deploy and copy your assigned HTTPS Render URL (e.g. `https://daily-wander-api.onrender.com`).

### B. Deploy Frontend to Vercel
1. Import the repository into Vercel.
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Configure Environment Variables in Vercel:
   - `VITE_API_BASE_URL`: `https://<your-render-backend-url>.onrender.com`
   - `VITE_SUPABASE_STORAGE_BASE`: `https://<project-ref>.supabase.co/storage/v1/object/public/moments`
5. Deploy! Vercel will build and assign your public domain.

### C. External Keep-Alive Monitoring (Free Tier Cold-Start Optimization)
Render free services spin down after 15 minutes of inactivity. To keep the service warm and responsive:
1. Create a free account at [cron-job.org](https://cron-job.org) or [UptimeRobot](https://uptimerobot.com).
2. Set up an HTTP monitor to ping `GET https://<your-render-backend-url>.onrender.com/api/health` every 10–14 minutes.
3. This generates lightweight inbound traffic and runs a live database `SELECT 1` health check without wasting client resources.

---

## 5. API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Verifies server and PostgreSQL connectivity (`SELECT 1`). |
| `GET` | `/api/posts/today` | Retrieves today's moments (with lazy midnight cleanup trigger). |
| `GET` | `/api/posts/today/count` | Returns real-time photo quota count for today. |
| `POST` | `/api/posts` | Multipart upload (`photo`, `text`, `username`). |
| `DELETE` | `/api/posts/{id}` | Protected admin delete with `X-Admin-Token` header. |

---

## 6. Automated Tests

```bash
# Run backend test suite (39 tests)
./mvnw clean test

# Run frontend test suite (23 tests)
cd frontend && npm test

# Run frontend production build
cd frontend && npm run build
```
