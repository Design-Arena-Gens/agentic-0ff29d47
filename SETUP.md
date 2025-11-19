# Setup Guide

## Your App is Live! 🎉

**URL**: https://agentic-0ff29d47.vercel.app

## Required API Keys

To enable full functionality, add these environment variables in Vercel:

### 1. OpenAI API Key (Required)
```
OPENAI_API_KEY=sk-...
```
- Get it from: https://platform.openai.com/api-keys
- Required for image analysis and recipe generation

### 2. Twilio (For WhatsApp Integration)
```
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
NEXT_PUBLIC_APP_URL=https://agentic-0ff29d47.vercel.app
```
- Sign up at: https://www.twilio.com/try-twilio
- Enable WhatsApp Sandbox in Twilio Console
- Set webhook URL to: `https://agentic-0ff29d47.vercel.app/api/whatsapp`

## Adding Environment Variables to Vercel

1. Go to: https://vercel.com/arcada-agentic-models/agentic-0ff29d47/settings/environment-variables
2. Add each variable
3. Redeploy the app

OR use CLI:
```bash
vercel env add OPENAI_API_KEY
vercel env add TWILIO_ACCOUNT_SID
vercel env add TWILIO_AUTH_TOKEN
vercel env add TWILIO_WHATSAPP_NUMBER
vercel env add NEXT_PUBLIC_APP_URL

# Redeploy
vercel --prod
```

## How to Use

### Web Interface
1. Visit https://agentic-0ff29d47.vercel.app
2. Upload a photo of ingredients
3. Get 3 recipe suggestions

### WhatsApp (after Twilio setup)
1. Add Twilio WhatsApp number to contacts
2. Send "join [your-sandbox-code]" to activate
3. Send ingredient photos
4. Receive recipes via WhatsApp!

## Testing Tips

- Test with clear photos of vegetables, meat, or pantry items
- Multiple ingredients work better (3-5 items)
- Good lighting helps the AI identify ingredients
- The AI generates creative recipes using what it sees plus common pantry staples

## Costs

- **Vercel**: Free tier (sufficient for this app)
- **OpenAI**: ~$0.01-0.03 per image analysis (GPT-4 Vision)
- **Twilio**: Free trial includes $15 credit, then pay-as-you-go

## Support

For issues:
- Check Vercel deployment logs
- Verify API keys are correctly set
- Ensure WhatsApp webhook URL is configured

Enjoy your AI Recipe Generator! 🍳
