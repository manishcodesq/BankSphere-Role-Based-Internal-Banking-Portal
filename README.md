# BankSphere

Role-based internal banking portal: accounts, deposits, withdrawals, and peer-to-peer transfers with JWT + Google OAuth authentication.

**Stack:** React (Vite) · Node.js/Express · MongoDB 

## Features

 JWT auth + Google OAuth 2.0
 Role-based access control
 Savings & Current accounts
 Deposits, withdrawals, atomic P2P transfers
 Transaction history
 bcrypt password hashing, protected REST APIs

## Architecture

```
React (Vite) → REST API (Express) → Mongoose → MongoDB
```

## Setup

```bash
git clone https://github.com/manishcodesq/BankSphere-Role-Based-Internal-Banking-Portal.git
cd BankSphere-Role-Based-Internal-Banking-Portal

# Backend
cd backend && npm install
npm run dev

# Frontend (new terminal)
cd frontend && npm install
npm run dev
```

### Backend `.env`

```env
MONGO_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=your_google_callback_url
PORT=8000
```

## API Domains

`/auth` · `/users` · `/accounts` · `/transactions`

## Deployment

Frontend → Vercel · Backend → Render · DB → MongoDB Atlas

- Live: https://banksphere-eta.vercel.app/
