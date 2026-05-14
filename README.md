# Burn IT Out Fitness 🔥

A secure Next.js course platform for Burn IT Out Fitness.

---

## 🚀 Local Setup Guide

### Prerequisites
- Node.js 18+
- MySQL 8.0+

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd burnit-next
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up the Database

Create a new MySQL database:

```sql
CREATE DATABASE burnit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Import the schema and seed data:

```bash
mysql -u root -p burnit_db < database/schema.sql
```

> This creates all tables and adds a sample admin account + starter course.

### 4. Configure Environment Variables

Copy the example env file:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=burnit_db
JWT_SECRET=any_long_random_string
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)


---

## 📁 Database Schema

All tables are defined in [`database/schema.sql`](./database/schema.sql):

| Table          | Description                              |
|----------------|------------------------------------------|
| `users`        | Registered users with roles (admin/user) |
| `courses`      | Available fitness courses                |
| `modules`      | Chapters/sections within a course        |
| `videos`       | Lessons (YouTube videos) in each module  |
| `user_courses` | Tracks which users are assigned courses  |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** MySQL with `mysql2`
- **Auth:** JWT (HTTP-only cookies)
- **Styling:** Vanilla CSS
