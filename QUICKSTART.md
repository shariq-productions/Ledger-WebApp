# Quick Start Guide

## 🚀 Running the Application

### Step 1: Start the Backend

Open a terminal and run:

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Seed initial data (optional, first time only)
python seed_data.py

# Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend is running at: `http://localhost:8000`
📚 API Docs: `http://localhost:8000/docs`

### Step 2: Start the Frontend

Open a **NEW** terminal window and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start the frontend development server
npm run dev
```

✅ Frontend is running at: `http://localhost:5173`

### Step 3: Open in Browser

Open your browser and go to: **http://localhost:5173**

---

## 📝 What to Expect

1. **Backend Terminal**: Should show "Application startup complete" and "Uvicorn running on..."
2. **Frontend Terminal**: Should show "Local: http://localhost:5173"
3. **Browser**: Should display the Ledger Web Application interface

## 🎯 First Steps After Launch

1. Click **"Add Party"** to create your first party
2. Click **"Add Transaction Type"** to create transaction types (e.g., "Payment Received" - add, "Expense Paid" - reduce)
3. Click the **"+"** button to add your first transaction
4. Watch the **Outstanding Total** update in real-time!

## ⚠️ Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Use a different port
uvicorn app.main:app --reload --port 8001
# Then update frontend/vite.config.ts proxy port to 8001
```

**Module not found errors:**
```bash
# Make sure you're in the backend directory and venv is activated
pip install -r requirements.txt
```

**Database errors:**
- Delete `ledger.db` file and restart the server (it will recreate)

### Frontend Issues

**Port 5173 already in use:**
- Vite will automatically use the next available port (check terminal output)

**Cannot connect to backend:**
- Make sure backend is running on port 8000
- Check browser console for errors
- Verify CORS settings in `backend/app/core/config.py`

**npm install fails:**
```bash
# Try clearing cache
npm cache clean --force
# Then try again
npm install
```

## 🛑 Stopping the Application

- Press `Ctrl+C` in both terminal windows to stop the servers
