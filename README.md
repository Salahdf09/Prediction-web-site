# Prediction Website

Full-stack web app for student academic prediction and orientation.

## Stack

- Frontend: React + Vite
- Backend: FastAPI + SQLAlchemy
- Database: PostgreSQL

## Project Structure

```text
frontend/                    React application
backend/Prediction-website/  FastAPI backend
```

The older duplicated files at the repository root are not used by the final app.

## Backend Setup

1. Create a PostgreSQL database, for example `prediction_db`.
2. Copy the backend environment example:

```powershell
cd backend/Prediction-website
copy .env.example .env
```

3. Edit `.env` if your PostgreSQL username, password, host, or database name is different.
4. Install Python dependencies:

```powershell
pip install -r requirements.txt
```

5. Create demo data:

```powershell
python populate_db.py
```

6. Run the backend:

```powershell
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Health check:

```text
http://localhost:8000/health
```

## Frontend Setup

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Demo Accounts

Password for all accounts:

```text
Demo123!
```

| Role | Email | Extra Code |
|---|---|---|
| Student | `demo.student@example.com` | `STD-DEMO-001` |
| Parent | `demo.parent@example.com` | `STD-DEMO-001` |
| School | `demo.school@example.com` | `SCH-DEMO-001` |
| Admin | `demo.admin@example.com` | `ADM-DEMO-001` |

The normal login page uses email and password.

## Root Commands

From the repository root:

```powershell
npm.cmd run dev:backend
npm.cmd run dev:frontend
npm.cmd run build
```
