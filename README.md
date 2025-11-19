# 🍳 AI Recipe Generator

An intelligent application that generates creative recipes from images of leftover ingredients. Works both as a web app and via WhatsApp!

## Features

- 📸 **Image Analysis**: Upload photos of your ingredients
- 🤖 **AI-Powered**: Uses GPT-4 Vision to identify ingredients and create recipes
- 📱 **WhatsApp Integration**: Send images via WhatsApp and get recipes instantly
- 🎨 **Beautiful UI**: Modern, responsive web interface
- ⚡ **Fast**: Real-time recipe generation

## How It Works

### Web App
1. Visit the website
2. Upload a photo of your leftover ingredients
3. Get 3 creative recipe suggestions instantly

### WhatsApp
1. Save the Twilio WhatsApp number
2. Send "join [your-code]" to activate
3. Send a photo of your ingredients
4. Receive 3 recipes via WhatsApp

## Setup

### Prerequisites
- OpenAI API key (for GPT-4 Vision)
- Twilio account (for WhatsApp integration)

### Environment Variables

Create a `.env.local` file:

```env
OPENAI_API_KEY=your_openai_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
NEXT_PUBLIC_APP_URL=https://agentic-0ff29d47.vercel.app
```

### Installation

```bash
npm install
npm run dev
```

### WhatsApp Setup

1. Sign up for Twilio (free trial available)
2. Enable WhatsApp Sandbox
3. Configure webhook URL: `https://your-domain.vercel.app/api/whatsapp`
4. Set HTTP POST method

## Deployment

Deploy to Vercel:

```bash
vercel deploy --prod
```

## Tech Stack

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **OpenAI GPT-4 Vision**: Image analysis and recipe generation
- **Twilio**: WhatsApp integration
- **Vercel**: Hosting and deployment

## API Routes

- `/api/generate-recipes` - Web app recipe generation
- `/api/whatsapp` - WhatsApp webhook handler

## License

MIT
