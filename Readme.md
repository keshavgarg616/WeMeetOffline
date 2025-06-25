# WeMeetOffline 🎉

WeMeetOffline is a full-stack web application built with **Angular** and **Node.js** to promote meaningful connections through virtual and in-person events. Users can create, join, and manage events—making it easy to meet like-minded people offline or online.  
  
Available at https://wemeetoffline.web.app/
  
## 🛠️ Tech Stack

-   **Frontend**: Angular 20
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB Atlas
-   **Authentication**: JWT
-   **Email Services**: Nodemailer with SMTP
-   **File Upload**: Filestack

## 🚀 Features

-   🔐 User authentication (signup/login/reset/verify)
-   🗓️ Event creation with time, tags, and banner image
-   🎫 Event registration and withdrawal
-   🧑‍🤝‍🧑 Participant visibility for registered users
-   📧 Email verification and password reset
-   🌍 Support for both virtual and physical events

## 🔧 Project Structure

```
WeMeetOffline/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── schemas/
│   ├── .env                  ← Backend environment config
│   └── index.js              ← Server entry point
│
├── frontend/
│   └── src/
│       ├── environments/
│       │   └── environment.ts ← Frontend API key and backend URL config
│       └── app/              ← All Angular components and services
```

## ⚙️ Backend Configuration (.env)

Create a `.env` file inside the `backend/` directory with the following:

```dotenv
MongoDBUsername=yourMongoUsername
MongoDBPswd=yourMongoPassword
MongoDBClusterString=yourMongoClusterURL
SALT_WORK_FACTOR=yourSaltWorkFactor

EMAIL_HASH_SECRET=yourEmailHashSecret

# Encryption for passwords/tokens
ENCRYPTION_ALGORITHM=AES-256-CBC
ENCRYPTION_KEY=your32CharEncryptionKey
ENCRYPTION_IV=your16CharIV

JWT_SECRET=yourJWTSecret

# SMTP Email Setup
EMAIL_USER=yourEmail@example.com
EMAIL_PASS=yourEmailPassword
EMAIL_NAME=yourEmailName
EMAIL_SMTP_HOST=smtp.example.com
EMAIL_SMTP_PORT=587

FRONTEND_URL=http://localhost:4200
```

## 🌐 Frontend Configuration (environment.ts)

In `frontend/src/environments/environment.ts`, configure your environment like so:

```ts
export const environment = {
	BACKEND_URL: "http://localhost:3000",
	FILESTACK_API_KEY: "your-filestack-api-key",
};
```

## 🧪 Setup Instructions

### 1. Backend

```bash
cd backend
npm install
npm start
```

Ensure your MongoDB cluster is online and `.env` is properly filled.

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

Visit: `http://localhost:4200`

## 📸 Screenshots

TO_DO

## TO DO

Implement edit event page at /edit-event  

## 📬 Contact

Made with ❤️ by [@keshavgarg616](https://github.com/keshavgarg616)
