# Vault — Password Manager Client

A modern, secure password manager web application built with Next.js. Generate strong passwords, store credentials safely, and manage your digital vault with a clean glassmorphic UI.

![Vault](./public/screenshot.png)

## Features

- 🔐 **Password Generator** — Generate strong passwords with customizable character sets and length
- 🗄️ **Password Vault** — Securely store, edit, and delete credentials
- 🔍 **Search** — Instantly search saved passwords by name, username, or URL
- 📊 **Password Strength** — Visual strength indicator (Weak / Fair / Strong) on every saved entry
- 📥 **CSV Import** — Import passwords from Chrome, Bitwarden, or any standard password manager export
- 📤 **CSV Export** — Export your vault as a CSV file
- 🔒 **JWT Authentication** — Secure login and registration with token expiry
- 🛡️ **Zero-knowledge vault** — Encrypt/decrypt locally; server never sees plaintext vault secrets
- 🎨 **Glassmorphic UI** — Dark theme with glassmorphic design throughout

## Tech Stack

- **Framework** — Next.js 15 (Page Router)
- **Language** — TypeScript
- **Styling** — Tailwind CSS v4, Material UI
- **HTTP Client** — Axios
- **CSV Parsing** — PapaParse
- **Authentication** — JWT (via backend)

## Getting Started

### Prerequisites
- Node.js 18+
- A running instance of the [Vault server](https://github.com/ashwin586/vault-server)

### Installation

```bash
# Clone the repository
git clone https://github.com/ashwin586/vault-client.git
cd vault-client

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env` file in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Running the App

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
vault-client/
├── public/               # Static assets (SVG logo, images)
├── src/
│   ├── components/       # Reusable UI components
│   ├── context/          # React context providers (Toast)
│   ├── hooks/            # Custom React hooks (useAuthRedirect, useProtectedRoute)
│   ├── lib/              # Axios instance and config
│   ├── pages/            # Next.js pages (page router)
│   │   ├── auth/         # Login and Register
│   │   ├── home/         # Password Generator
│   │   ├── profile/      # Profile and Manage Passwords
│   │   ├── _app.tsx      # App wrapper
│   │   ├── _document.tsx # Document wrapper
│   │   └── index.tsx     # Entry point
│   ├── styles/           # Global CSS
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Helper functions (crypto, passwordStrength, auth)
├── .env                  # Environment variables
├── next.config.ts        # Next.js configuration
└── tsconfig.json         # TypeScript configuration
```

## Related

- [Vault Server](https://github.com/ashwin586/vault-server) — Express.js REST API