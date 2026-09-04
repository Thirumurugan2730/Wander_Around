# Wander Around

> *"Every day is filled with little moments. Some are beautiful. Some are ordinary. Some mean nothing to anyone else. But today, they're here. Wander through moments shared by people around the world. Tomorrow, they're gone."*

**Wander Around** is an ephemeral daily journal and wandering canvas. People from around the world post a single snapshot or quiet thought from their day. Others wander through those moments floating across an atmospheric living sky. At midnight, yesterday's moments dissolve completely, and a fresh sky begins.

Traditional social media platforms are built around permanent archives, follower counts, like counters, comment threads, and engagement algorithms designed to maximize screen time. Wander Around is intentionally different: it is an interactive piece of cinematic art designed for presence, quiet reflection, and the beauty of today.

---

## Table of Contents

1. [Core Concept](#1-core-concept)
2. [Complete User Flow](#2-complete-user-flow)
3. [Landing Page](#3-landing-page)
4. [Wandering Experience](#4-wandering-experience)
5. [Memory Interaction & Same-Screen Expansion](#5-memory-interaction--same-screen-expansion)
6. [Sharing a Day](#6-sharing-a-day)
7. [Photo Processing Pipeline](#7-photo-processing-pipeline)
8. [Daily Photo Limit & Quota System](#8-daily-photo-limit--quota-system)
9. [Backend Architecture](#9-backend-architecture)
10. [Database Architecture](#10-database-architecture)
11. [Supabase Storage Architecture](#11-supabase-storage-architecture)
12. [API Reference Documentation](#12-api-reference-documentation)
13. [Midnight Cleanup & Lifecycle Reset](#13-midnight-cleanup--lifecycle-reset)
14. [Frontend Architecture](#14-frontend-architecture)
15. [Mobile Responsiveness & Touch Ergonomics](#15-mobile-responsiveness--touch-ergonomics)
16. [Animation System & GPU Performance](#16-animation-system--gpu-performance)
17. [Visual Design Philosophy](#17-visual-design-philosophy)
18. [Project Structure](#18-project-structure)
19. [Environment Variables](#19-environment-variables)
20. [Local Development Guide](#20-local-development-guide)
21. [Docker Deployment](#21-docker-deployment)
22. [Production Architecture](#22-production-architecture)
23. [Security Architecture](#23-security-architecture)
24. [Complete Data Lifecycle](#24-complete-data-lifecycle)
25. [Why Wander Around Is Different](#25-why-wander-around-is-different)
26. [Future Considerations](#26-future-considerations)
27. [Developer & Contributor Guidelines](#27-developer--contributor-guidelines)

---

## 1. Core Concept

The application is structured around three fundamental rhythms:

```
    ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
    │  See Today   │         │ Share Today  │         │   Tomorrow   │
    │              │         │              │         │              │
    │ Wander the   │   ──►   │ Leave a note │   ──►   │ Everything   │
    │ living sky   │         │ or photo     │         │ disappears   │
    └──────────────┘         └──────────────┘         └──────────────┘
```

- **See Today**: Open the sky to see today's memories drifting by as billowy clouds carried by the wind.
- **Share Today**: Contribute a small piece of your day—a photograph, a handwritten reflection, or both.
- **Tomorrow**: At midnight (`Asia/Kolkata` IST), the slate wipes clean. Stored photos and database records are permanently deleted, leaving an open sky for the new day.

### What Wander Around Does NOT Have

| Traditional Social Feature | Wander Around Approach |
|---|---|
| Followers & Following | **None**. Everyone shares the same sky. |
| Likes & Reaction Counters | **None**. Moments are appreciated as they pass, without scoring. |
| Comments & Reply Threads | **None**. No arguments, spam, or social pressure. |
| User Profiles & History | **None**. No permanent archive or profile to maintain. |
| Direct Messages (DMs) | **None**. An open, quiet public art installation. |
| Push Notifications | **None**. You visit when you want to wander. |
| Hashtags & Search Queries | **None**. Pure serendipitous discovery. |
| Engagement Algorithm | **None**. Natural chronological sky stream. |

---

## 2. Complete User Flow

### 2.1 The Wandering Journey

```text
User opens Wander Around
        │
        ▼
Landing Page (Atmospheric introduction & philosophy)
        │
        ▼  [Clicks "Start Wandering"]
Today's Sky Canvas (/wander)
        │
        ▼  [Fetches GET /api/posts/today]
Sequential One-by-One Cloud Stream
  - 5 vertical altitude lanes (safe margins, no clipping)
  - Left → Right gentle drift
  - 5-second recurring breeze wave
  - Memories embedded inside cloud silhouettes
        │
        ▼  [User Taps / Clicks a Memory Cloud]
Same-Screen Memory Expansion (Focus Modal)
  - Zero navigation away from canvas
  - View full-resolution photo or complete handwritten diary note
  - Background sky gently pauses and blurs
        │
        ▼  [Clicks "Return to the sky" or Backing]
Seamless Return
  - Modal closes smoothly
  - Cloud positions and flight trajectories resume
```

### 2.2 The Sharing Journey

```text
User clicks "Share your day" (/share)
        │
        ▼
Selects Photo (optional, JPEG/PNG/WebP, max 50MB)
Writes Reflection (optional, max 500 characters)
Enters Name (optional, max 30 characters, defaults to "Anonymous")
        │
        ▼  [Clicks "Leave this moment in today's sky"]
Frontend Validation (Rejects empty submissions)
        │
        ▼  [POST /api/posts (multipart/form-data)]
Backend Validation & Quota Check
  1. Validates text length and magic byte headers
  2. Pre-checks daily photo limit (100 photos/day)
  3. Proportionally resizes photo to max width 1600px
  4. Encodes and compresses to WebP (~800KB–1MB)
  5. Uploads WebP to Supabase Storage: {yyyy-MM-dd}/{UUID}.webp
  6. Acquires PostgreSQL advisory transaction lock
  7. Re-verifies quota under lock & saves post to database
        │
        ▼
Success! Memory enters today's sky for others to wander into
```

### 2.3 The Midnight Reset Journey

```text
Day N (Memories created & enjoyed across the globe)
        │
        ▼
Day Ends (Midnight 00:05 IST / Asia/Kolkata)
        │
        ├──► Automated Cron Trigger (@Scheduled 00:05 IST)
        │    OR Lazy Fallback Trigger on next GET /api/posts/today
        │
        ▼
CleanupService Execution
  1. Queries all posts where post_date < today
  2. Deletes associated WebP objects from Supabase Storage
  3. Deletes stale post records from PostgreSQL
        │
        ▼
Day N+1 Begins (Clean sky ready for fresh moments)
```

---

## 3. Landing Page

The Landing page (`/`) introduces the essence of Wander Around before the user enters the live sky.

- **Atmospheric Visuals**: Soft animated golden sun glows, lavender mist, and floating preview cards that give a tactile preview of memories.
- **Clear Value Proposition**: A concise headline and manifesto explaining the one-day lifecycle.
- **Dual Action Entry Points**:
  - `Start Wandering →`: Immediate entry into the living sky.
  - `Share your day`: Direct access to leave a memory.

---

## 4. Wandering Experience

The Wandering page (`/wander`) is a full-screen, fixed-viewport living sky canvas.

```text
  ┌────────────────────────────────────────────────────────────────────────┐
  │ ✦ today's sky   12 clouds drifting through today         [Nostalgic Sun]│
  │                                                                        │
  │  Lane 0:  ☁ (Photo Memory) ────────────────────────►                  │
  │                                                                        │
  │  Lane 1:          ☁ (Handwritten Thought) ─────────────────►           │
  │                                                                        │
  │  Lane 2:  ☁ (Photo + Caption) ───────────────────────►                 │
  │                                                                        │
  │  Lane 3:                  ☁ (Quiet Note) ──────────────────►           │
  │                                                                        │
  │  Lane 4:  ☁ (Photo Memory) ────────────────────────►                  │
  │                                                                        │
  │  ~~~~~~~~~~~~~~~~~ 5-Second Recurring Breeze Wave ~~~~~~~~~~~~~~~~~    │
  └────────────────────────────────────────────────────────────────────────┘
```

### Core Canvas Mechanics
1. **Fixed Viewport Lock**: `width: 100vw; height: 100dvh; overflow: hidden; touch-action: none; overscroll-behavior: none;`. No vertical scrolling, horizontal scrolling, or page bouncing.
2. **Sequential One-by-One Stream**: Clouds move strictly from **Left $\to$ Right** across 5 vertical altitude lanes (`10%`, `26%`, `43%`, `60%`, `74%`), avoiding collisions and overlap trains.
3. **Continuous Traversal**: Clouds enter from off-screen left (`translate3d(-360px, 0, 0)`), traverse the viewport smoothly, and exit completely off-screen right (`translate3d(calc(100vw + 360px), 0, 0)`) before recycling.
4. **Natural Mass & Motion**: Clouds glide with subtle sinusoidal vertical bobbing and gentle rotation ($\pm 3^\circ$), simulating natural atmospheric drift.

---

## 5. Memory Interaction & Same-Screen Expansion

Memories and clouds are constructed as **one unified physical sky entity** (`cloud → mist → memory → mist → cloud`), eliminating rectangular UI cards, artificial borders, and washi-tape stickers during flight.

### 5.1 The Embedded Cloud Architecture
- **Layer 1 (Backdrop Silhouette)**: Fluffy billowy cumulus SVG body with solar rim lighting.
- **Layer 2 (Mist Halo)**: Diffused radial vapor halo (`.cloud-mist-halo`) softening the boundary.
- **Layer 3 (Memory Content)**:
  - *Photographs*: Rendered with an organic elliptical radial gradient mask (`mask-image: radial-gradient(...)`) that dissolves all 4 edges into cloud mist, graded with warm vintage golden-hour tones (`sepia(0.12)`).
  - *Handwritten Reflections*: Rendered in cursive ink (`Caveat`) with soft atmospheric text glows directly in cloud vapor.
- **Layer 4 (Vapor Overlay)**: Soft translucent mist passing over the memory face.
- **Layer 5 (Foreground Cloud Wisps)**: Foreground SVG puffs that billow over the lower 25–35% of the memory, cradling it from beneath.

### 5.2 Same-Screen Modal Focus View
When clicked or tapped:
1. The memory smoothly zooms into an expanded focus view (`<ExpandedMoment />`) on the **same screen**.
2. Background sky movement pauses and blurs gently.
3. The user can view the full uncropped photograph or read the complete handwritten story.
4. Clicking the **"Return to the sky"** button (or backdrop / pressing `Escape`) closes the modal and resumes the exact wandering flight path without page reloads or jumps.

---

## 6. Sharing a Day

The Share Day page (`/share`) allows anyone to contribute a moment from their day.

```text
  ┌───────────────────────────────────────────────────────────┐
  │                    Share Your Day                         │
  │         Leave a little piece of today in the sky          │
  │                                                           │
  │   ┌───────────────────────────────────────────────────┐   │
  │   │  📷 Choose or drop a photo (optional)              │   │
  │   │     JPEG, PNG, WebP up to 50MB                    │   │
  │   └───────────────────────────────────────────────────┘   │
  │                                                           │
  │   ┌───────────────────────────────────────────────────┐   │
  │   │  What happened today? (optional, max 500 chars)   │   │
  │   │  _______________________________________________  │   │
  │   └───────────────────────────────────────────────────┘   │
  │                                                           │
  │   Your Name: [ Anonymous              ] (optional, max 30)│
  │                                                           │
  │   [ ✨ Leave this moment in today's sky ]                 │
  │                                                           │
  │   ☁ 84/100 photo moments remaining today                  │
  └───────────────────────────────────────────────────────────┘
```

- **Submission Options**:
  - Photo + Text reflection
  - Photo only
  - Text reflection only
- **Validation**: Empty submissions (no photo and no text) are rejected with clear user feedback.
- **Quota Indicator**: Displays real-time remaining photo allowance fetched from `GET /api/posts/today/count`.

---

## 7. Photo Processing Pipeline

Uploaded images undergo an automated optimization pipeline before being stored:

```text
User selects image (up to 50MB)
              │
              ▼
Frontend sends multipart/form-data request
              │
              ▼
Spring Boot Backend Receives Request
              │
              ▼
ImageService Validation:
  - File size check (≤ 50MB)
  - Magic byte header inspection (JPEG: FFD8FF, PNG: 89504E47, WebP: RIFF....WEBP)
  - ImageIO decoding check
              │
              ▼
Proportional Resizing (Thumbnailator):
  - If width > 1600px, proportionally downscaled to width = 1600px
  - If width ≤ 1600px, original resolution preserved
              │
              ▼
Iterative WebP Compression (webp-imageio):
  - Iterates through quality steps: [0.85, 0.75, 0.65, 0.55, 0.45, 0.35]
  - Target file size: ≤ 1MB (1,048,576 bytes)
  - Halts at the highest quality step that meets target
              │
              ▼
Supabase Storage Upload:
  - Path: {postDate}/{UUID}.webp (e.g. 2026-09-04/9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d.webp)
  - Content-Type: image/webp
  - Uploaded via authenticated HTTP PUT using Supabase service-role key
              │
              ▼
PostgreSQL Metadata Persistence (with Advisory Lock)
```

---

## 8. Daily Photo Limit & Quota System

To keep the daily sky curated, meaningful, and sustainable, Wander Around enforces a strict limit:

$$\text{Daily Photo Limit} = \mathbf{100\text{ photos / day}}$$

- **Applies Only to Photos**: Text-only moments remain **unlimited** even after the 100-photo quota is reached.
- **Two-Phase Concurrency Enforcement**:
  1. *Fast Pre-Check*: Quick count query before performing expensive image resizing and storage upload.
  2. *Atomic Advisory Lock Check*: Re-verifies count inside a `@Transactional` block protected by a PostgreSQL transaction-scoped advisory lock (`pg_advisory_xact_lock`), guaranteeing zero race conditions under concurrent uploads.
- **Rollback Safety**: If database persistence fails after image upload, the backend automatically deletes the uploaded storage object to prevent orphaned files.
- **HTTP 409 Conflict**: When the quota is reached, the server returns status `409 Conflict` with a helpful message: *"Today's photo limit has been reached. You can still share a text-only moment."*

---

## 9. Backend Architecture

The backend is built with **Java 21** and **Spring Boot 3.3.4**, providing high reliability, strong typing, and concurrency safety.

### Responsibilities
- **Timezone Authority**: Enforces `Asia/Kolkata` (IST) as the single source of truth for date partitioning and cleanup.
- **Input Validation & Sanitization**: Validates file MIME types, file sizes, text lengths, and usernames.
- **Image Processing**: Decodes, resizes, and encodes WebP images headlessly (`-Djava.awt.headless=true`).
- **Storage Management**: Interacts with Supabase Storage REST API via Java 11+ `HttpClient`.
- **Database Operations**: Spring Data JPA / Hibernate with connection pooling (HikariCP).
- **Concurrency Control**: PostgreSQL advisory locking for quota enforcement.
- **Automated Midnight Reset**: Scheduled cron task and lazy fallback cleanup.
- **Admin Deletion**: Token-authenticated deletion with constant-time verification (`MessageDigest.isEqual`).
- **Health Checks**: Database connectivity verification (`SELECT 1`).

---

## 10. Database Architecture

The persistence layer uses **PostgreSQL** hosted on Supabase.

### Schema: `posts` Table

```sql
CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) DEFAULT 'Anonymous',
    text TEXT,
    image_path TEXT,
    has_photo BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    post_date DATE NOT NULL
);

-- Index for instant daily queries and cleanup
CREATE INDEX idx_posts_post_date ON posts(post_date);
CREATE INDEX idx_posts_post_date_has_photo ON posts(post_date, has_photo);
```

### Entity Fields (`Post.java`)

| Field | Column | Type | Description |
|---|---|---|---|
| `id` | `id` | `Long` | Primary key, auto-incrementing identity |
| `username` | `username` | `String` | Contributor name (max 30 chars, default "Anonymous") |
| `text` | `text` | `String` | Reflection content (max 500 chars, nullable) |
| `imagePath` | `image_path` | `String` | Supabase storage reference path (`{date}/{uuid}.webp`, nullable) |
| `hasPhoto` | `has_photo` | `Boolean` | Flag indicating whether memory carries a photograph |
| `createdAt` | `created_at` | `OffsetDateTime` | ISO-8601 creation timestamp with timezone offset |
| `postDate` | `post_date` | `LocalDate` | Authoritative date in `Asia/Kolkata` (e.g. `2026-09-04`) |

---

## 11. Supabase Storage Architecture

- **Bucket Name**: `moments` (public read access enabled).
- **Storage Structure**: Partitioned by date folders:
  ```text
  moments/
  ├── 2026-09-03/
  │   ├── 1a2b3c4d-....webp
  │   └── 5e6f7g8h-....webp
  └── 2026-09-04/
      ├── 9i0j1k2l-....webp
      └── 3m4n5o6p-....webp
  ```
- **CDN Resolution**: Frontend resolves relative `imagePath` values into full public CDN URLs:
  `https://<PROJECT_REF>.supabase.co/storage/v1/object/public/moments/{imagePath}`
- **Security**: Uploads and deletions are executed exclusively by the Spring Boot backend using the server-side `SUPABASE_SERVICE_ROLE_KEY`. The frontend never possesses or executes storage write credentials.

---

## 12. API Reference Documentation

### 12.1 Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Verifies Spring Boot application health and executes `SELECT 1` on PostgreSQL.
- **Response `200 OK`**:
  ```json
  {
    "status": "UP",
    "database": "UP"
  }
  ```

### 12.2 Get Today's Memories
- **Endpoint**: `GET /api/posts/today`
- **Description**: Returns all memories posted for today's date in `Asia/Kolkata`. Also triggers lazy midnight cleanup if stale posts from previous days are detected.
- **Response `200 OK`**:
  ```json
  [
    {
      "id": 101,
      "username": "Elena",
      "text": "Morning coffee watching the rain stop.",
      "imagePath": "2026-09-04/d3b07384-d113-46fb-a09c-3e129f123456.webp",
      "hasPhoto": true,
      "createdAt": "2026-09-04T08:30:00+05:30",
      "postDate": "2026-09-04"
    }
  ]
  ```

### 12.3 Get Today's Photo Quota
- **Endpoint**: `GET /api/posts/today/count`
- **Description**: Returns photo quota usage for the current day.
- **Response `200 OK`**:
  ```json
  {
    "date": "2026-09-04",
    "photosToday": 16,
    "photoLimit": 100,
    "photosRemaining": 84
  }
  ```

### 12.4 Create a New Memory
- **Endpoint**: `POST /api/posts`
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `photo` or `image` (*MultipartFile*, optional): Image file (JPEG, PNG, WebP up to 50MB).
  - `text` (*String*, optional): Reflection text (max 500 chars).
  - `username` (*String*, optional): Author name (max 30 chars, default "Anonymous").
- **Response `201 Created`**: Returns the saved `Post` object.
- **Error Responses**:
  - `400 Bad Request`: Empty submission or validation failure.
  - `409 Conflict`: Daily photo quota (100) reached.

### 12.5 Admin Delete Post
- **Endpoint**: `DELETE /api/posts/{id}`
- **Headers**: `X-Admin-Token: <SECRET_ADMIN_TOKEN>`
- **Description**: Permanently deletes a specific post from the database and removes its associated storage object from Supabase Storage.
- **Response `200 OK`**:
  ```json
  {
    "message": "Post 101 deleted successfully"
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Missing or invalid admin token.
  - `404 Not Found`: Post ID does not exist.

---

## 13. Midnight Cleanup & Lifecycle Reset

The daily reset mechanism guarantees that yesterday's memories disappear completely.

### 1. Scheduled Automated Cleanup (`CleanupService.java`)
- Configured via `@Scheduled(cron = "${daily-wander.cleanup.cron:0 5 0 * * *}", zone = "${daily-wander.cleanup.zone:Asia/Kolkata}")`.
- Fires automatically every night at **00:05 AM IST**.
- Finds all posts where `post_date < today`.
- Calls Supabase Storage REST API to delete each stored WebP file.
- Deletes the database records from PostgreSQL.

### 2. Lazy Cleanup Fallback
- On free-tier hosting (e.g. Render), backend instances may sleep due to inactivity during the midnight hour.
- Whenever `GET /api/posts/today` is invoked, the controller checks `postRepository.existsByPostDateLessThan(today)`.
- If stale posts are present, it immediately runs `cleanupService.cleanupStalePosts()`, ensuring yesterday's posts never leak into today's sky.

---

## 14. Frontend Architecture

The frontend is a single-page application built with **React 19**, **Vite**, and vanilla CSS.

### Component Structure

```text
frontend/src/
├── api/
│   └── client.js             # Robust API client with timeout and error extraction
├── components/
│   ├── CloudSilhouette.jsx   # Dual-layer SVG cloud silhouettes (4 organic variants)
│   ├── EmptyState.jsx        # First-moment invitation when sky is empty
│   ├── ExpandedMoment.jsx    # Same-screen modal focus view for opened memories
│   ├── Header.jsx            # Shared navigation header
│   ├── LoadingState.jsx      # Atmospheric loading spinner
│   ├── MomentCard.jsx        # Presentation card
│   ├── NostalgicSun.jsx      # Golden hour sun with solar aura & sunbeams
│   ├── WanderingCard.jsx     # Memory-cloud entity with mist halos & feathering
│   └── WindLayer.jsx         # 5s wind wave, airflow streams & floating motes
├── hooks/
│   ├── useWanderingLayout.js # Staggered flight lanes, depths, rotations & scales
│   └── useWanderSession.js   # Discovery session controller
├── pages/
│   ├── LandingPage.jsx       # Welcome page & manifesto
│   ├── ShareDayPage.jsx      # Photo & text upload form with live quota
│   ├── WanderingPage.jsx     # Living sky canvas (/wander)
│   └── HowItWorksPage.jsx    # Philosophy and guide
├── styles/
│   ├── index.css             # Design tokens, fonts, buttons & ambient glows
│   ├── wandering.css         # Sky canvas, altitude lanes, 5s wind & responsive rules
│   ├── cards.css             # Card presentation styles
│   └── animations.css        # Keyframe animations
└── utils/
    └── image.js              # Storage CDN URL resolver & relative time formatter
```

---

## 15. Mobile Responsiveness & Touch Ergonomics

Wander Around is designed specifically for mobile devices, not just scaled down from desktop.

### Viewport Protection & Safe Areas
- **Viewport Lock**: `height: 100dvh; min-height: 100dvh; max-height: 100dvh; width: 100vw; overflow: hidden; overscroll-behavior: none; touch-action: none;`.
- **Meta Viewport**: `viewport-fit=cover` enabled in `index.html`.
- **Safe Area Insets**: Respects `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`, `env(safe-area-inset-left)`, and `env(safe-area-inset-right)` across iOS notches, Dynamic Islands, and Android gesture bars.

### Screen Resolution Support

| Viewport Category | Resolutions Tested | Cloud Scaling Strategy |
|---|---|---|
| **Small Mobile** | `320×568`, `360×640` | Photo `120×86px`, thought text `1.10rem`, compact mist insets |
| **Standard Mobile** | `375×667`, `390×844`, `412×915`, `430×932` | Fluid scaling using `clamp()` (`clamp(126px, 33vw, 142px)`), spacious open sky |
| **Tablet** | `768×1024`, `810×1080` | Photo `148×108px`, thought text `1.28rem` |
| **Desktop / 4K** | `1280×800`, `1440×900`, `1920×1080+` | Photo `185–195px`, full cumulus silhouettes |
| **Mobile Landscape** | `@media (max-height: 500px)` | Compact altitude lanes (`9%`–`71%`), photo `112×78px`, no vertical overflow |

### Touch Targets & Expanded Modal
- Every memory cloud provides an invisible touch target of $\ge 44\text{px} \times 44\text{px}$ with `-webkit-tap-highlight-color: transparent`.
- The expanded focus modal is constrained to `min(92vw, 420px)` and max height `calc(100dvh - safe-area - 36px)` so it never overflows phone viewports.
- Photo viewports use `object-fit: contain` to preserve full photograph framing.
- Close button features a prominent $44\text{px}$ touch target with tactile tap feedback.

---

## 16. Animation System & GPU Performance

All animations are designed to run silky-smooth at 60fps, even on budget mobile hardware:

1. **100% GPU-Accelerated**: Relies exclusively on `transform: translate3d(...)`, `opacity`, and CSS `@keyframes`. Zero JavaScript requestAnimationFrame loops or in-frame React state re-renders.
2. **5-Second Gentle Breeze Wave**:
   - `wind-travel-wave`: Sweeps Left $\to$ Center $\to$ Right every 5 seconds (`animation: windWavePass 5s cubic-bezier(...) infinite`).
   - Delicate airflow curves (1.3px–2.0px stroke) and floating golden motes drift across the sky.
3. **Natural Atmospheric Depth**:
   - **Background (`depth-far`)**: Scale `0.86x`, opacity `0.82`, subtle blur `0.35px`, slower flight duration `38s–48s`.
   - **Middle (`depth-mid`)**: Main memory clouds with clear visual focus and balanced scale.
   - **Foreground (`depth-near`)**: Scale `1.06x`, crisp foreground presence.

---

## 17. Visual Design Philosophy

```text
                 ☁   ☁   ☁
            ☁                 ☁
          ☁    [PHOTOGRAPH]     ☁
         ☁   ~ cloud wisps ~     ☁
          ☁   Handwritten ink   ☁
            ☁                 ☁
                 ☁   ☁   ☁
```

> **"The cloud is the world. The memory is part of the cloud."**

- **Nostalgic Palette**: Warm pastel sky gradients (`#6FA7CD` to `#FAF2E8`), golden sunbeams, and aged paper tones.
- **Late Afternoon Sunlight**: Soft radiant sun in the upper sky with ambient solar halo.
- **Tactile Typography**:
  - `Fredoka`: Friendly, rounded geometric heading typography.
  - `Quicksand`: Soft, organic modern body copy.
  - `Caveat`: Intimate handwritten diary script for memory text and author bylines.

---

## 18. Project Structure

```text
Wander_Around/
├── .env.example                     # Environment template (never commit secrets)
├── .gitignore                       # Git ignore configuration
├── Dockerfile                       # Multi-stage production container build (Java 21)
├── pom.xml                          # Maven build specification & dependencies
├── README.md                        # Complete project documentation
├── src/                             # Spring Boot Java 21 Backend
│   └── main/
│       ├── java/com/dailywander/
│       │   ├── DailyWanderApplication.java
│       │   ├── config/
│       │   │   └── CorsConfig.java
│       │   ├── controller/
│       │   │   ├── HealthController.java
│       │   │   └── PostController.java
│       │   ├── entity/
│       │   │   └── Post.java
│       │   ├── exception/
│       │   │   └── GlobalExceptionHandler.java
│       │   ├── repository/
│       │   │   └── PostRepository.java
│       │   └── service/
│       │       ├── CleanupService.java
│       │       ├── ImageService.java
│       │       └── PostService.java
│       └── resources/
│           └── application.yml
└── frontend/                        # React 19 + Vite Frontend
    ├── index.html                   # HTML entry point with viewport-fit=cover & fonts
    ├── package.json                 # Node dependencies & scripts
    ├── vite.config.js               # Vite configuration & dev proxy
    └── src/
        ├── App.jsx                  # Route definitions
        ├── main.jsx                 # React root mounting
        ├── api/client.js            # Fetch API client
        ├── components/              # Reusable UI & sky layer components
        ├── hooks/                   # Custom layout & session hooks
        ├── pages/                   # Landing, Wander, Share, HowItWorks pages
        ├── styles/                  # Design system, CSS variables & animations
        └── utils/image.js           # Storage CDN URL resolver & time formatter
```

---

## 19. Environment Variables

Create `.env` in the root directory for local backend execution, and `frontend/.env` for frontend execution.

### Backend Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DB_URL` | **Yes** | — | PostgreSQL JDBC connection URL (`jdbc:postgresql://host:5432/postgres?sslmode=require`) |
| `DB_USERNAME` | **Yes** | — | PostgreSQL database username |
| `DB_PASSWORD` | **Yes** | — | PostgreSQL database password |
| `SUPABASE_URL` | **Yes** | — | Supabase project URL (`https://<project-ref>.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | — | Supabase service-role secret key (server-side only) |
| `SUPABASE_STORAGE_BUCKET` | No | `moments` | Name of Supabase Storage bucket |
| `ADMIN_TOKEN` | **Yes** | — | Secret token required for `DELETE /api/posts/{id}` |
| `DAILY_PHOTO_LIMIT` | No | `100` | Maximum photos permitted per day |
| `PORT` | No | `8080` | HTTP port for backend server |
| `CORS_ALLOWED_ORIGINS` | No | `http://localhost:5173,...` | Comma-separated list of allowed web origins |
| `CLEANUP_CRON` | No | `0 5 0 * * *` | Spring cron expression for midnight cleanup |
| `CLEANUP_ZONE` | No | `Asia/Kolkata` | Authoritative timezone for daily partitioning |

### Frontend Environment Variables (`frontend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | No | `""` (empty for proxy) | Base URL of Spring Boot backend (e.g. `http://localhost:8080`) |
| `VITE_SUPABASE_STORAGE_BASE` | No | Public Supabase CDN URL | Base public CDN URL for images |

> **IMPORTANT**: Never commit `.env` files or secret keys to version control.

---

## 20. Local Development Guide

### Prerequisites
- **Java 21 JDK** (Eclipse Temurin recommended)
- **Node.js 20+** and npm
- **Maven 3.9+** (or use included `./mvnw`)

### 1. Start the Backend
1. Copy template and configure credentials:
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL and Supabase credentials
   ```
2. Run the Spring Boot server:
   ```bash
   # Linux / macOS
   set -a && . ./.env && set +a && ./mvnw spring-boot:run
   ```
3. Verify health check:
   ```bash
   curl http://localhost:8080/api/health
   # Expected: {"status":"UP","database":"UP"}
   ```

### 2. Start the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
2. Start Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

### 3. Run Automated Tests
```bash
# Backend unit & integration test suite (39 tests)
./mvnw clean test

# Frontend test suite (31 tests)
cd frontend && npm test

# Frontend production bundle check
cd frontend && npm run build
```

---

## 21. Docker Deployment

The repository includes a production multi-stage `Dockerfile`:

- **Stage 1 (Builder)**: `eclipse-temurin:21-jdk` compiles the application and packages the executable JAR.
- **Stage 2 (Runtime)**: `eclipse-temurin:21-jre` minimal alpine runtime, runs under an unprivileged `wander` system user.
- **Flags**: Configured with `-XX:+UseContainerSupport`, `-XX:MaxRAMPercentage=75.0`, and `-Djava.awt.headless=true`.

### Build & Run Container Locally
```bash
# Build Docker image
docker build -t wander-around-backend .

# Run container with environment variables
docker run -p 8080:8080 --env-file .env wander-around-backend
```

---

## 22. Production Architecture

```text
                          ┌────────────────────────┐
                          │      User Browser      │
                          │   Mobile / Desktop     │
                          └───────────┬────────────┘
                                      │
                                      ▼
                          ┌────────────────────────┐
                          │         Vercel         │
                          │  React 19 + Vite SPA   │
                          └───────────┬────────────┘
                                      │ HTTPS REST API
                                      ▼
                          ┌────────────────────────┐
                          │         Render         │
                          │ Spring Boot Web Service│
                          └───────────┬────────────┘
                                      │
                         ┌────────────┴────────────┐
                         │                         │
                         ▼                         ▼
             ┌───────────────────────┐ ┌───────────────────────┐
             │   Supabase Storage    │ │  Supabase PostgreSQL  │
             │ Bucket: moments (WebP)│ │     Table: posts      │
             └───────────────────────┘ └───────────────────────┘
```

- **Frontend**: Hosted on **Vercel** with automatic continuous deployment on `git push origin main`.
- **Backend**: Hosted on **Render** as a managed Java web service.
- **Database & Storage**: Hosted on **Supabase** (PostgreSQL database with SSL mode required, Supabase Storage for WebP assets).

---

## 23. Security Architecture

1. **Zero Secret Leakage**: `SUPABASE_SERVICE_ROLE_KEY` and database credentials exist only on the backend environment. The client only receives public image paths and public CDN URLs.
2. **Protected Admin Operations**: The `DELETE /api/posts/{id}` endpoint requires `X-Admin-Token` matching via constant-time byte comparison (`MessageDigest.isEqual`), protecting against timing attacks.
3. **CORS Restrictions**: Configured via `CorsConfig.java` to restrict cross-origin requests to configured frontend production domains and local development ports.
4. **Strict Input Sanitization**: File uploads are verified via magic byte signatures (preventing file extension spoofing) and capped at 50MB. Text content is trimmed and enforced to 500 characters max.
5. **SQL Injection Prevention**: Parameterized database queries executed exclusively via Spring Data JPA / Hibernate and `JdbcTemplate`.

---

## 24. Complete Data Lifecycle

```text
1. CREATE    ──► User uploads photo and/or text reflection on /share
2. VALIDATE  ──► Backend checks magic bytes, size limits, and photo quota
3. PROCESS   ──► Thumbnailator downscales to 1600px; webp-imageio compresses to WebP
4. STORE     ──► WebP uploaded to Supabase Storage; post row saved in PostgreSQL
5. DISPLAY   ──► Post returned via GET /api/posts/today for today's sky
6. WANDER    ──► Other users discover and expand the memory drifting in the sky
7. DAY ENDS  ──► Midnight 00:05 IST arrives
8. DELETE    ──► CleanupService deletes storage WebP files and database rows
```

---

## 25. Why Wander Around Is Different

```text
Traditional Social Media:
[ Create Post ] ──► [ Chase Likes ] ──► [ Build Follower Base ] ──► [ Permanent Digital Footprint ]

Wander Around:
[ Share Moment ] ──► [ Drift Across Sky ] ──► [ Experienced by Others ] ──► [ Dissolves at Midnight ]
```

Wander Around embraces the Japanese aesthetic concept of *Mono no aware* (物の哀れ)—an appreciation of the impermanence of things. Because memories disappear at midnight:
- There is no curation anxiety or pressure to maintain a picture-perfect aesthetic.
- There are no follower counts to measure personal worth.
- Every visit to the sky is unique to today.

---

## 26. Future Considerations

The following concepts represent potential future explorations while strictly respecting the core ephemeral philosophy:

- **Audio Moments**: Optional short ambient audio recordings (e.g. rain sounds, cafe chatter) that play softly when a cloud is opened.
- **Dynamic Sky Themes**: Subtle sky color palettes matching current solar phases (dawn, midday, twilight, starry night).
- **International Daybreak Transitions**: Optional regional sunset fading transitions as midnight approaches.
- **Lightweight Moderation**: Automated NSFW content classification during the image processing pipeline.

---

## 27. Developer & Contributor Guidelines

When contributing to Wander Around, please adhere to these core principles:

1. **Preserve Ephemerality**: Never add features that create permanent user archives, follower graphs, like buttons, or public comment sections.
2. **Maintain the Living Sky Aesthetic**: Memories must remain integrated directly into cloud silhouettes. Do not revert to generic rectangular UI cards.
3. **Fixed Viewport Integrity**: The wandering canvas must remain locked to the viewport with zero vertical or horizontal document scrolling.
4. **Timezone Authority**: Always calculate daily boundaries using `Asia/Kolkata` (IST) unless an intentional architectural migration is planned.
5. **GPU Optimization**: Ensure all canvas motion uses CSS `translate3d` and `transform` properties. Avoid JavaScript frame loops.
6. **Mobile First**: Verify that all UI changes render flawlessly across small (`320px`), standard (`390px–430px`), tablet, and desktop viewports.

---

<div align="center">
  <sub>Built with care for little moments that matter today.</sub>
</div>
