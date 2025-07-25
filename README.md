
#  Scalable Job Importer with BullMQ + Docker Redis + MongoDB + React UI

This project implements a scalable background job importer system using **Node.js**, **BullMQ**, **MongoDB**, **Redis (Dockerized)**, and **React** for the frontend admin UI.

It periodically fetches jobs from external XML-based APIs, processes them in the background using a queue system, and stores structured job + import history data in MongoDB.

---

## Tech Stack

- **Backend:** Node.js (Express)
- **Queue Manager:** BullMQ
- **Queue Store:** Redis (Dockerized)
- **Database:** MongoDB (Mongoose)
- **Frontend:** React (Admin UI)
- **Cron:** `node-cron`
- **Worker:** BullMQ `Worker`

---

## Features

- ✅ Fetches jobs from external XML feeds
- ✅ Converts XML to JSON and queues them
- ✅ Background processing using BullMQ worker
- ✅ Logs each import run in MongoDB
- ✅ Tracks new, updated, and failed jobs with reasons
- ✅ Redis runs inside Docker
- ✅ React admin UI shows import logs and statuses

---

## Redis in Docker

I have used **Redis running inside Docker** to simulate a scalable queue store.

### Run Redis

```bash
docker run --name job-import-redis -p 6379:6379 -d redis
```

Verify with:

```bash
docker ps
```

---

## Folder Structure

```
.
├── backend/
│   ├── config/
│   ├── cron/
│   ├── models/
│   ├── queues/
│   ├── services/
│   ├── routes/
│   ├── controllers
│   ├── app.js
|   ├──.env
├── frontend/  (React Admin UI)
│   ├── public/
│   ├── src/
│   └── package.json
└── README.md
```

---

## Sample Import Log

```json
{
  "filename": "jobicy.com",
  "total": 150,
  "new": 60,
  "updated": 85,
  "failed": 5,
  "failedReasons": [
    { "jobTitle": "UI Designer", "reason": "Missing company name" }
  ],
  "timestamp": "2025-07-24T10:00:00Z"
}
```

---

## How to Run

### Backend

1. Install dependencies

```bash
npm install
```

2. Set `.env`:

```env
MONGO_URI=your_mongodb_connection_string
REDIS_HOST=localhost
REDIS_PORT=6379
```

3. Start Server

```bash
node server.js
```

4. Start Worker

```bash
node workers/jobWorker.js
```

5. (Optional) Manually trigger cron

```bash
node cron/jobFetcher.js
```

> Cron runs every hour automatically.

---

### Frontend (React)

```bash
cd frontend
npm install
npm start
```

---

## Design Notes

- Queue-based ingestion with retry support
- Redis used via Docker
- MongoDB for persistence of job data and logs
- React UI fetches logs from Express API
- Modular folder structure to support scalability

---

## About Me

This project was built as a real-world backend + frontend assessment using queue systems, XML parsing, and admin UI.

**Shital Bankar**  
2 years of MERN stack experience  
sbankar98@gmail.com
