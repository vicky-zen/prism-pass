# Prism Pass - Secure Password Manager

> [!CAUTION]
> Status: Under Development

Prism Pass is a secure and user-friendly application designed to manage logins, card details, personal information, and notes. Built with advanced encryption, it offers features such as strong password generation, biometric authentication, offline access, and backup/restore functionality.

## Features

- **Secure Storage**: Safely store logins, card details, personal information, and notes.
- **Strong Password Generator**: Create strong, unique passwords effortlessly.
- **Biometric Authentication**: Enhance security with fingerprint or face recognition.
- **Offline Access**: Manage your data without an internet connection.
- **Backup & Restore**: Easily back up and restore your data when needed.

## Tech Stack

- **Frontend**: React Native with Expo.
- **Backend**: Node.js and Express.js.
- **Database**: PostgreSQL for secure and scalable storage.
- **Encryption**: AES-256 / RSA for maximum data security.

## Folder Structure

```plain
prism-pass
└───.vscode
└───frontend # React Native app
└───backend # Node.js API with TypeScript
└───README.md
└─── .gitignore
```

## Prerequisites

- Node.js (v22 or higher)
- PostgreSQL (v17 or higher)

## Getting Started

### Clone the Repository

```plain
git clone https://github.com/vicky-zen/prism-pass.git
cd prism-pass
```

### Backend Setup

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `backend` folder and add:

```env
# Application Settings
APP_PORT=3000
APP_ENV=development

# Database Configuration (PostgreSQL preferred)
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name

# Encryption & Security
ENCRYPT_KEY=your_encryption_key
JWT_SECRET_KEY=your_jwt_secret_key

# Queue Configurations (Redis)
QUEUE_REDIS_HOST=your_redis_host
QUEUE_REDIS_PORT=6379  # Default Redis port (Change if you have a custom setup)
QUEUE_REDIS_PASSWORD=your_redis_password
QUEUE_REDIS_KEY_PREFIX=your_redis_key_prefix

# Email Configuration (for sending emails)
EMAIL_HOST=smtp.your-email-provider.com
EMAIL_PORT=465  # Use 465 for SSL or 587 for TLS (commonly used)
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=your_email_address
EMAIL_FROMNAME=Your App Name
```

4. Start the backend server:

```bash
npm start
```

### Frontend Setup

1. **Navigate to the frontend folder**:

```bash
cd ../frontend
```

2. **Install dependencies**:

```bash
npm install
```

3. **Start the React Native app**:

```bash
npm start
```

## Usage

1. Run the backend server first (`backend` folder).
2. Launch the `frontend` app using an emulator or physical device.
3. Register or log in to manage your secure data.

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch for your feature:

```bash
git checkout -b feature-name
```

3. Commit your changes and push them to your fork.
4. Submit a pull request for review.
