# Image → Video AI Starter

A simple Next.js app for generating a short AI video from:

- one uploaded image
- one text prompt
- a selected duration

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Connect a real image-to-video model

Edit:

`app/api/generate/route.js`

Replace the demo response with your provider's API flow.

Typical backend flow:

1. Receive image + prompt.
2. Upload image to the model/provider.
3. Start an image-to-video generation job.
4. Poll the job until complete.
5. Return `{ "videoUrl": "https://..." }`.

Store API keys in `.env.local`, never in frontend code.

Example:

```env
VIDEO_API_KEY=your_secret_key
```

## Recommended production additions

- Authentication
- Credit/payment system
- Job history
- Cloud storage
- Rate limiting
- Prompt moderation
- Background job queue
- Retry handling
- Webhook support
