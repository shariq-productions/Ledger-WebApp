# Ledger Web Application

A real-time ledger web application for small businesses built with FastAPI (backend) and React (frontend).

## Features

- **Admin Login**: Two admins with credentials stored in DB. JWT bearer token valid for 8 hours. Re-login required on expiry.
- **Party Management**: Add, edit, and manage business parties with billing information
- **Transaction Types**: Create reusable transaction type templates (add/reduce)
- **Transaction Management**: Add, edit, and delete transactions with real-time updates
- **Outstanding Total**: Automatically calculated total outstanding amount (₹) displayed in real-time
- **Search & Filter**: Filter transactions by party name and date range
- **Real-Time Updates**: All changes reflect instantly for all connected users via WebSocket
- **Clean UI**: Minimal, modern interface with dropdown cards (not modals)

## Tech Stack

### Backend
- Python 3.9+
- FastAPI
- SQLAlchemy (ORM)
- Pydantic (validation)
- WebSocket for real-time updates
- SQLite (default) / PostgreSQL (production)

### Frontend
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Query (state management)
- React DatePicker
- Axios (HTTP client)

## Project Structure

```
Ledger WebApp/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routers/        # API route handlers
│   │   ├── core/
│   │   │   ├── config.py       # Configuration settings
│   │   │   └── websocket_manager.py  # WebSocket connection manager
│   │   ├── db/
│   │   │   └── database.py     # Database configuration
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── services/           # Business logic layer
│   │   └── main.py             # FastAPI application entry point
│   ├── requirements.txt
│   └── seed_data.py            # Seed data script
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API and WebSocket services
│   │   ├── types/             # TypeScript type definitions
│   │   ├── App.tsx            # Main App component
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.9 or higher
- Node.js 18+ and npm/yarn
- (Optional) PostgreSQL for production

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up database:**
   The database will be created automatically when you run the application. By default, it uses SQLite (`ledger.db`).

   For PostgreSQL, create a `.env` file in the backend directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/ledger_db
   ```

5. **Seed initial data (optional):**
   ```bash
   python seed_data.py
   ```
   This creates 2 admins: **admin1** / **admin123** and **admin2** / **admin456**

6. **Run the backend server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`
   API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## Usage

1. **Start both servers** (backend and frontend) as described above.

2. **Add Parties:**
   - Click "Add Party" button (top right)
   - Fill in Party Name (mandatory), Billing Name, and Location
   - Click "Save" (confirmation alert will appear)

3. **Add Transaction Types:**
   - Click "Add Transaction Type" button (below Add Party)
   - Enter Transaction Note and select Type (add/reduce)
   - Click "Save"

4. **Add Transactions:**
   - Click the "+" button near the transaction table
   - Fill in Date, Party (searchable dropdown), Transaction Note, Type, and Amount
   - When selecting a Type, its note auto-appends to Transaction Note
   - Click "Save"

5. **Edit Transactions:**
   - Click "Edit" button on any transaction row
   - Modify fields and save

6. **Search & Filter:**
   - Use party search box to filter by party name
   - Use date pickers to filter by date range

7. **View Outstanding Total:**
   - Total Outstanding is displayed in the top left box
   - Updates automatically and in real-time for all users

## API Endpoints

### Parties
- `GET /api/v1/parties` - Get all parties
- `POST /api/v1/parties` - Create a party
- `GET /api/v1/parties/{id}` - Get party by ID
- `PUT /api/v1/parties/{id}` - Update party
- `DELETE /api/v1/parties/{id}` - Delete party
- `GET /api/v1/parties/search/{term}` - Search parties

### Transaction Types
- `GET /api/v1/transaction-types` - Get all transaction types
- `POST /api/v1/transaction-types` - Create transaction type
- `GET /api/v1/transaction-types/{id}` - Get by ID
- `PUT /api/v1/transaction-types/{id}` - Update transaction type
- `DELETE /api/v1/transaction-types/{id}` - Delete transaction type

### Transactions
- `GET /api/v1/transactions` - Get all transactions (with optional filters)
- `POST /api/v1/transactions` - Create transaction
- `GET /api/v1/transactions/{id}` - Get transaction by ID
- `PUT /api/v1/transactions/{id}` - Update transaction
- `DELETE /api/v1/transactions/{id}` - Delete transaction
- `GET /api/v1/transactions/outstanding/total` - Get outstanding total

### WebSocket
- `WS /ws` - WebSocket endpoint for real-time updates

## Key Features Explained

### Real-Time Updates
- All CRUD operations broadcast updates via WebSocket
- Multiple users see changes instantly
- Outstanding total updates automatically

### Cascade Updates
- Editing a party name updates all related transactions
- Editing a transaction type updates all related transactions

### Serial Number
- Continuous numbering (does not reset yearly)
- Automatically assigned when creating transactions

### Outstanding Total Calculation
- Sum of all "add" transactions minus sum of all "reduce" transactions
- Displayed with Indian Rupees (₹) currency symbol
- Format: DD/MM/YYYY for dates

## Development Notes

- Backend uses SQLAlchemy for ORM with proper relationships
- Frontend uses React Query for server state management
- WebSocket reconnects automatically on disconnection
- All forms show confirmation alerts before save/cancel
- Dropdown cards close on outside click or cancel

## Troubleshooting

1. **Backend won't start:**
   - Check if port 8000 is available
   - Verify Python version (3.9+)
   - Check database connection if using PostgreSQL

2. **Frontend won't connect:**
   - Ensure backend is running on port 8000
   - Check CORS settings in `backend/app/core/config.py`
   - Verify proxy settings in `frontend/vite.config.ts`

3. **WebSocket not working:**
   - Check browser console for errors
   - Verify WebSocket URL in `frontend/src/services/websocket.ts`
   - Ensure backend WebSocket endpoint is accessible

## License

This project is for demonstration purposes.
