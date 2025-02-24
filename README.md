# 🤓 Emoji Maker

An AI-powered emoji generator built with Next.js 14, Clerk Authentication, and Replicate API.

## ✨ Features

- 🎨 Generate custom emojis using AI
- 🔐 User authentication with Clerk
- 💾 Persistent storage of generated emojis
- ❤️ Like and save your favorite emojis
- 🌓 Dark mode support
- 🎯 User-specific emoji collections

## 🛠️ Tech Stack

- **Framework:** Next.js 14 with App Router
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Authentication:** Clerk
- **State Management:** Zustand
- **AI Integration:** Replicate API
- **Font:** Geist

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn
- A Clerk account for authentication
- A Replicate API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tanashway/emojimaker.git
cd emojimaker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```env
REPLICATE_API_TOKEN=your_replicate_api_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

1. Sign up/Sign in using Clerk authentication
2. Enter a prompt describing the emoji you want to create
3. Wait for the AI to generate your custom emoji
4. Like and save your favorite emojis
5. Access your saved emojis anytime by logging in

## 📝 Environment Variables

- `REPLICATE_API_TOKEN`: Your Replicate API key
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `CLERK_SECRET_KEY`: Your Clerk secret key

## 📁 Project Structure

```
emojimaker/
├── app/
│   ├── api/
│   │   └── generate/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── emoji-generator-form.tsx
│   ├── emoji-grid.tsx
│   └── ui/
├── lib/
│   └── store.ts
└── public/
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
