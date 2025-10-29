# Setup Instructions

## Prerequisites

Ensure you have:
- Node.js 18+ installed
- npm 9+ installed

Check versions:
```bash
node -version
npm -version
```

## Installation Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Copy the example file:
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_LINKEDIN_CLIENT_ID=your-linkedin-client-id
```

### 3. Run Development Server

```bash
npm run dev
```

Open: http://localhost:3000

## OAuth Setup (Optional)

### Google OAuth

1. Visit: https://console.cloud.google.com/
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 Client ID
5. Add redirect URI: `http://localhost:3000/auth/google/callback`
6. Copy Client ID to `.env`

### LinkedIn OAuth

1. Visit: https://www.linkedin.com/developers/
2. Create a new app
3. Add redirect URL: `http://localhost:3000/auth/linkedin/callback`
4. Copy Client ID to `.env`

## Building for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- --port 3001
```

**Module not found?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Can't connect to backend?**
- Check backend is running on port 8080
- Verify `VITE_API_BASE_URL` in `.env`

---

Need help? Check `README.md` for full documentation.

