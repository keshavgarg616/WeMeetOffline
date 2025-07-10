# WeMeetOffline 🎉

WeMeetOffline is a full-stack web application built with **Angular** and **Node.js** to promote meaningful connections through virtual and in-person events. Users can create, join, and manage events—making it easy to meet like-minded people offline or online.

Available at https://wemeetoffline.web.app/

## 🛠️ Tech Stack

-   **Frontend**: Angular 20
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB Atlas
-   **Authentication**: JWT, Firebase
-   **Email Services**: Nodemailer with SMTP
-   **SMS Services**: Twilio
-   **File Upload**: Filestack

## 🚀 Features

-   🔐 User authentication (signup/login/reset/verify) (Google/Github login available)
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
# MongoDB Configuration
MongoDBUsername=yourMongoUsername
MongoDBPswd=yourMongoPassword
MongoDBClusterString=cluster0.xxxxxx

# Security Settings
SALT_WORK_FACTOR=yourSaltWorkFactor          # Used for password hashing
EMAIL_HASH_SECRET=yourEmailHashSecret        # Used to encrypt email addresses
ENCRYPTION_ALGORITHM=aes-256-cbc             # Used for auth code encryption
ENCRYPTION_KEY=your32ByteEncryptionKey       # Must be 32 bytes
ENCRYPTION_IV=your16ByteEncryptionIV         # Must be 16 bytes
JWT_SECRET=yourJWTSecretKey                  # Used to sign JWTs

# Email Configuration
EMAIL_USER=yourEmail@example.com
EMAIL_PASS=yourEmailPassword
EMAIL_NAME=YourAppName
EMAIL_SMTP_HOST=smtp.example.com
EMAIL_SMTP_PORT=587

# Frontend URL
FRONTEND_URL=https://your-frontend-url.com

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@example.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Twilio Configuration
TWILIO_ACCOUNT_SID=yourTwilioSID
TWILIO_AUTH_TOKEN=yourTwilioAuthToken
TWILIO_PHONE_NUMBER=+1234567890
```

## 🌐 Frontend Configuration (environment.ts)

In `frontend/src/environments/environment.ts`, configure your environment like so:

```ts
export const environment = {
	BACKEND_URL: "https://your-backend-url.com",
	FILESTACK_API_KEY: "yourFilestackApiKey",
	firebaseConfig: {
		apiKey: "yourFirebaseApiKey",
		authDomain: "your-app.firebaseapp.com",
		projectId: "yourFirebaseProjectId",
		storageBucket: "your-app.appspot.com",
		messagingSenderId: "yourSenderId",
		appId: "yourAppId",
	},
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
npm install --legacy-peer-deps
npm start
```

Visit: `http://localhost:4200`

## 📸 Screenshots

-   Login
    ![Login](Screenshots/image.png)
-   Sign Up
    ![Sign Up](Screenshots/image-1.png)
-   Home
    ![Home](Screenshots/image-2.png)
-   Event Page
    ![Event](Screenshots/image-3.png)
-   User Profile
    ![Profile](Screenshots/profile.png)

## 📬 Contact

Made with ❤️ by [Keshav Garg](https://github.com/keshavgarg616)
