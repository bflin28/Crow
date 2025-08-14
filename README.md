# Crow - Secure Escrow Services

A modern React web application for secure escrow services with traditional payment processing and blockchain state tracking (account abstraction). Built with React 18, TypeScript, and Vite for optimal performance.

## Features

- **No Crypto Wallet Required**: Users never see MetaMask prompts or interact with crypto directly
- **Secure Payment Processing**: Payments handled via traditional bank transfers (Plaid integration planned)
- **Blockchain State Tracking**: Smart contracts track escrow progress using account abstraction for gas fees
- **Modern React Architecture**: React 18 with TypeScript, hooks, and context management
- **Fast Development**: Vite for instant hot reloading
- **Authentication System**: Secure item authentication by certified experts

## Architecture Overview

### User-Facing Layer
- Traditional payment processing (bank transfers, ACH)
- Email-based user identification
- Web-based authentication flow
- No cryptocurrency wallet interaction

### Backend Layer (Account Abstraction)
- Smart contracts deployed and managed by backend
- Gas fees paid by service (not users)
- Blockchain used only for transparent state tracking
- Users identified by email, not wallet addresses

## Getting Started

### Prerequisites
- Node.js (version 20.19.0 or higher recommended)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
This starts the development server with hot reloading at `http://localhost:5173`

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure
```
crow/
├── src/          # Source files
├── public/       # Static assets
├── .github/      # GitHub configuration and Copilot instructions
└── README.md     # Project documentation
```

## Technology Stack
- **Frontend**: React 18, JavaScript (ES6+)
- **Build Tool**: Vite
- **Linting**: ESLint
- **Package Manager**: npm
