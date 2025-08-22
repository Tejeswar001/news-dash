# News Dash Monorepo

This project is now split into two main directories:

- `frontend/` — Next.js frontend (React)
- `backend/` — Flask backend (Python)

## Getting Started

### Frontend (Next.js)

1. Go to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

### Backend (Flask)

1. Go to the backend directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```
3. Set environment variables (e.g., in `.env`):
   - `NEWS_API_KEY` — your NewsAPI key
   - `HF_API_KEY` — your Hugging Face API key
4. Start the Flask server:
   ```bash
   python app.py
   ```

## API Endpoints

- `GET /api/news` — Fetch news articles
- `POST /api/summarize` — Summarize article text

## Notes

- Update your frontend API calls to use the Flask backend endpoints.
- Make sure both servers are running for full functionality.
