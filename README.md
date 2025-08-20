# News Dash

A modern, AI-powered news dashboard built with Next.js, React, and TypeScript. Visualize, filter, and personalize news from global sources with advanced analytics and summaries.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [FAQ](#faq)
- [License](#license)

---

## Overview
News Dash is a personalized dashboard for news enthusiasts, researchers, and professionals. It aggregates news from top global sources, provides AI-powered summaries, and offers interactive analytics for deeper insights.

## Features
- **Interactive Charts & Visualizations:** Pie charts, bar graphs, timelines, and word clouds for trends and sentiment.
- **AI Summaries:** Get concise, AI-generated summaries of articles using HuggingFace models.
- **Advanced Search & Filtering:** Filter by topic, country, date range, keywords, author, source, image, and word count.
- **Personalized Dashboard:** Save preferences, favorite topics, and regions.
- **Secure Authentication:** Firebase Auth for sign-in and profile management.
- **Responsive Design:** Works seamlessly on desktop and mobile.
- **Quick Searches:** One-click access to trending topics and your preferred interests.

## Tech Stack
- **Frontend:** Next.js, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **News Data:** NewsAPI.org
- **AI Summarization:** HuggingFace API

## Getting Started
### 1. Clone the Repository
```bash
git clone https://github.com/your-username/news-dash.git
cd news-dash
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your API keys:
- Firebase
- NewsAPI
- HuggingFace

### 4. Run the Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
npm start
```

## Environment Variables
Create a `.env` file in the root directory with the following keys:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
NEWS_API_KEY=your_newsapi_key
HF_API_KEY=your_huggingface_key
```

## Usage
- **Sign In:** Create an account or sign in with Google.
- **Explore News:** Browse articles, use filters, and view analytics.
- **Summarize:** Click "Summarize" on any article for an AI summary.
- **Save Preferences:** Set your favorite topics and regions for a personalized feed.

## Project Structure
```
app/
  ├── api/
  ├── dashboard/
  ├── profile/
  ├── auth/
  ├── ...
components/
  ├── charts/
  ├── ui/
  ├── ...
contexts/
lib/
hooks/
types/
public/
styles/
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## FAQ
**Q: Can I use this project for commercial purposes?**  
A: Yes, it is licensed under MIT.

**Q: How do I add new news sources?**  
A: Update the domain list in `lib/news-api.ts` or extend the API integration.

**Q: How do I deploy this project?**  
A: Deploy on Vercel, Netlify, or any platform supporting Next.js.

**Q: Is my data private?**  
A: User preferences are stored securely in Firebase Firestore.

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

**Note:** This project does not use or reference v0.dev. All code is original or open source.
