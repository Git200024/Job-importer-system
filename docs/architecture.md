
# Job Importer System – Architecture Overview

##  Objective
Build a **scalable job importer system** that can:
- Fetch jobs from multiple external APIs (feeds)
- Queue them using Redis (via BullMQ)
- Process and import them into MongoDB using background workers
- Track import history (total, new, updated, failed)
- Provide an admin UI to view the import history

---

## System Components

### 1. **Frontend (React.js)**
- Built with React (Create React App)
- Communicates with backend REST APIs
- Displays job import history logs (file name, totals, new, updated, failed)


### 2. **Backend (Node.js + Express)**
- Provides endpoints like `/import`, `/import-logs`
- Connects to MongoDB for storing jobs and history
- Adds job data to Redis Queue (BullMQ)
- Exposes APIs used by frontend

### 3. **Worker (BullMQ Worker)**
- Listens to Redis Queue
- Processes job items: validates and inserts/updates MongoDB
- Logs success, update, and failure counts in the Import History collection

### 4. **Redis (BullMQ)**
- Stores job queues
- Manages job retry, failure handling

### 5. **MongoDB Atlas**
- Stores job data
- Stores import history (timestamp, file name, stats)

---

## Workflow

1. Scheduler or cron job triggers API call to fetch job feeds.
2. Each job is pushed to the Redis queue.
3. Worker listens to Redis queue and processes jobs:
   - Insert new jobs
   - Update existing ones
   - Catch and log failed jobs
4. Once processing finishes, a summary is saved to the Import Logs collection.
5. Admin UI (React) fetches and displays logs using `/import-logs` API.

---

## Why This Architecture?

- ✅ **Scalability**: Queue ensures large job feeds won’t crash the system.
- ✅ **Reliability**: Failed jobs don’t block others. They’re logged.
- ✅ **Separation of Concerns**: Frontend, backend API, and processing are decoupled.
- ✅ **Extensibility**: New feeds or validations can be added easily.

---

## Technologies Used

| Component        | Tech Stack             |
|------------------|------------------------|
| Frontend         | React                  |
| Backend API      | Node.js + Express      |
| Queue            | BullMQ + Redis         |
| DB               | MongoDB Atlas          |
| Scheduler        | node-cron              |
| Deployment       | GitHub                 |

---

## MongoDB Schema Example

**Jobs Collection:**
```json
{
  "_id": ObjectId,
  "title": "Software Engineer",
  "company": "ABC Corp",
  "location": "Remote",
  "description": "...",
  "updatedAt": ISODate
}
```

**Import Logs Collection:**
```json
{
  "filename": "feed1",
  "timestamp": ISODate,
  "total": 120,
  "new": 80,
  "updated": 30,
  "failed": 10
}
```

---

## 📁 File Structure
```
job-importer-system/
├── frontend/ (React app)
├── backend/
│   ├── routes/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── cron/
│   ├── queues/
│   └── app.js
└── docs/
    └── architecture.md
```

---

## ✅ Future Improvements
- Add pagination + filters to import log UI
- Support for XML feeds directly
- Dashboard for real-time worker status
- Retry mechanism for failed jobs
