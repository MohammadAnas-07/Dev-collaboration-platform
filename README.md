# 🛠️ Forge AI: Next-Gen Dev Collaboration Platform

**Forge AI** is a production-grade collaboration platform for developers, featuring deep GitHub integration, AI-powered code analysis, and a modern, high-performance UI.

![Forge Dashboard](https://github.com/MohammadAnas-07/Dev-collaboration-platform/raw/main/public/og-image.png)

## ✨ Features

- 🔐 **GitHub OAuth Integration**: Seamless login and repository synchronization.
- 📂 **Smart Repo Import**: Recursive tree-traversal to import full repository structures.
- 🤖 **Forge AI Intelligence**: Automated code reviews and AI-driven insights (Powered by GPT-4o).
- 🌓 **Mode Toggle**: High-precision Light/Dark mode with premium OKLCH color space.
- 💳 **Stripe Pro Billing**: Integrated subscription management with secure webhook handling.
- 🎨 **Glassmorphic UI**: Modern, responsive design built with Tailwind CSS v4 and Framer Motion.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL (Neon.tech recommended)
- Stripe Account (for billing)
- GitHub Developer Account (for OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MohammadAnas-07/Dev-collaboration-platform.git
   cd Dev-collaboration-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file based on `.env.example`:
   ```bash
   DATABASE_URL="your_postgresql_url"
   GITHUB_ID="your_github_client_id"
   GITHUB_SECRET="your_github_client_secret"
   NEXTAUTH_SECRET="your_nextauth_secret"
   STRIPE_API_KEY="your_stripe_key"
   OPENAI_API_KEY="your_openai_key"
   ```

4. **Initialize Database**
   ```bash
   npx prisma db push
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Prisma ORM with PostgreSQL
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS v4
- **AI**: OpenAI SDK
- **Payments**: Stripe

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
