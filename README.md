# Tharun Reddy M — Personal Portfolio & AI Systems

Welcome to your portfolio website! This project is custom-built for you, **Tharun Reddy M**, AI Systems and Automation Builder.

The site is built with **React 19 + TypeScript + Tailwind CSS v4 + Vite**, with zero-config serverless backend endpoints ready for **Vercel** (`/api/contact` and `/api/chat`).

---

## 📁 Project Structure & File Guide

Here is an easy explanation of every file in your project:

```
├── /api
│   ├── chat.ts           # Serverless endpoint for your portfolio AI chatbot with 2-tier fallback (Groq -> Gemini) & 15-message daily limit
│   ├── contact.ts        # Serverless endpoint for contact inquiries with instant Telegram alert, Brevo email confirmation & 3/hr rate limit
│   └── _rateLimit.ts     # Shared helper: zero-infra, in-memory rate limiting keyed by visitor IP, plus an optional same-origin check
├── /public
│   └── /images
│       ├── tharun-photo.svg              # Your profile photo (replace with your photo: tharun-photo.jpg or .png)
│       ├── project-chat-websites.svg     # Project 1: Chat with Multiple Websites (LangChain)
│       ├── project-dataset-generator.svg # Project 2: Synthetic Dataset Generator (Python)
│       ├── project-agentic-chatbot.svg   # Project 3: Agentic Chatbot with Long Term Memory (n8n)
│       ├── project-confused-docs.svg     # Project 4: Confused Docs to Structured Notes (CrewAI)
│       └── README.md                     # Instructions on replacing images
├── /src
│   ├── /components
│   │   ├── Navbar.tsx              # Fixed top bar with smooth-scrolling links & mobile drawer
│   │   ├── Hero.tsx                # Hero section with dual-audience value proposition & desktop robot callout
│   │   ├── About.tsx               # About Me section with photo frame & practical engineering story
│   │   ├── Skills.tsx              # Skills divided into Non-Tech outcomes vs. Tech stack with filter tabs
│   │   ├── Projects.tsx            # 4 featured projects with metrics & architecture modal trigger
│   │   ├── ProjectModal.tsx        # Deep-dive architecture and pipeline diagram modal
│   │   ├── Socials.tsx             # LinkedIn, GitHub, Instagram, and YouTube cards
│   │   ├── Contact.tsx             # Contact form with live client validation & rate limiting
│   │   ├── ChatbotModal.tsx        # Floating AI Chatbot assistant with remaining message counter (AI provider names hidden from visitors)
│   │   ├── FloatingChatTrigger.tsx # Floating bottom corner button with desktop speech bubble
│   │   └── Footer.tsx              # Footer with live Bengaluru IST clock & scroll-to-top
│   ├── /data
│   │   └── portfolioData.ts        # Central file where you can edit your bio, social links, and projects anytime
│   ├── /utils
│   │   └── deviceSession.ts        # Persistent localStorage device session & daily message limit tracker
│   ├── App.tsx                     # Main application layout
│   ├── index.css                   # Global Tailwind CSS styles and theme colors
│   └── main.tsx                    # React mounting entry point
├── .env.example                    # Template with full explanations of all API keys
├── index.html                      # HTML entry point with Space Grotesk & Plus Jakarta Sans fonts
├── metadata.json                   # App title and description
├── package.json                    # Project dependencies and run scripts
├── tsconfig.json                   # TypeScript configuration
├── vercel.json                     # Vercel deployment configuration
└── vite.config.ts                  # Vite build tool and local dev server API middleware
```

---

## 🚀 How to Run Locally on Your Computer

You don't need prior web development experience! Just follow these 3 steps:

### Step 1: Install Dependencies
Open your terminal (Command Prompt / Terminal / VS Code terminal) in the project folder and run:
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(You can leave the keys blank initially. The app includes simulated preview modes for Telegram and Brevo, as well as offline fallback knowledge for the chatbot!)*

Everything else is optional until you deploy. See "Daily AI Quota Enforcement" below for an honest explanation of how the 15-message and 3/hour limits work and what their actual guarantee is.

### Step 3: Start the Local Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`. You will see your portfolio running live!

---

## 🧪 How to Test Every Feature Locally

1. **Test Smooth Scrolling**: Click on any item in the fixed Navbar (`Home`, `About Me`, `Skills`, `Projects`, `Social Links`, `Contact ME`). The page will smoothly scroll to the exact section.
2. **Test Dual Audience Toggle**: In the **Skills** section, click on the buttons **"For Business Owners"** and **"For Tech / Engineers"** to see how each audience is addressed.
3. **Test Project Architecture Modal**: Scroll to **Projects** and click **"Architecture"** on any project card. A modal will pop up displaying the complete system design and metrics.
4. **Test the Contact Form**:
   - Go to the Contact section at the bottom.
   - Enter your name, email, phone, business type, and a short message.
   - Click **"Submit Inquiry to Tharun"**.
   - Notice the loading animation followed by a clear success message showing the simulated Telegram dispatch and Brevo confirmation email.
   - Notice that if you try to submit more than 3 times in an hour, the rate limiter politely asks you to wait!
5. **Test the AI Chatbot**:
   - Click the robot icon in the bottom right corner or in the hero section.
   - Ask a question like: *"What websites do you build for bakers and tutors?"* or *"Explain your CrewAI project"*.
   - Check the message counter in the top right: it will show `14 / 15 left`.
   - Ask an off-topic question like *"Can you write a poem about apples?"* and verify that the bot politely adheres to its guardrails and steers the conversation back to Tharun's portfolio!
   - Send 15 messages from the same browser/network and confirm the 16th switches to the free fallback banner and the input stays usable.

---

## 🔁 Daily AI Quota Enforcement — How It Actually Works

This project deliberately avoids any external database (Redis, Postgres, etc.) for rate limiting — no extra signup, no extra env vars, nothing to configure. Here's exactly what that buys you and what it doesn't, so there are no surprises:

- **Server-side (`api/_rateLimit.ts`)**: counts requests in the serverless function's own memory, keyed by the visitor's **IP address** (read from Vercel's forwarded headers — not from anything the browser tells it, which matters: a client-supplied id can be changed with one line of JavaScript and would defeat *any* backing store, Redis included). This is a **best-effort** limiter: it reliably stops casual over-use within a warm instance's lifetime, but Vercel can discard that memory at any time (a cold start, scaling up), which resets the count. It is not a hard, persistent guarantee.
- **Client-side (`src/utils/deviceSession.ts`)**: tracks usage in the visitor's own browser `localStorage`, which is what drives the "X of 15 remaining" badge and grays out the input once hit. This is purely a UX nicety — a visitor who opens dev tools can clear it, and it's not a security control.

**What this means in practice:** a casual visitor will always see the limit hold correctly. A determined abuser who scripts around the frontend entirely could, in theory, exceed it — worst case, your Groq/Gemini free-tier quota gets used up faster than expected on a given day, and the bot automatically falls back to the built-in offline knowledge-base replies (which already work today, with or without any AI key configured). Nothing breaks; it just gets less personalized until the quota resets.

**If you ever want a hard guarantee** (e.g. the bot is getting real abuse and you want the cap to survive cold starts), the fix is to swap the storage inside `api/_rateLimit.ts` for a persistent key-value store — nothing in `chat.ts` or `contact.ts` would need to change. Until then, this is a deliberate, documented trade-off in favor of zero extra infrastructure.

### Optional: lock the API to your own domain
Once you have a stable URL, set `ALLOWED_ORIGIN` in your environment (see `.env.example`) to cut off the easiest way for another website to call your `/api/chat` or `/api/contact` directly using your keys. It's optional and does nothing until you set it.

---

## 🧠 About the Groq Models

Groq retired `llama-3.3-70b-versatile` (the model this project used to run on) on **August 16, 2026**. This project now uses Groq's current recommended replacements:
- **`openai/gpt-oss-120b`** — the main model, tried first on each key.
- **`openai/gpt-oss-20b`** — a faster, lighter-reasoning model, tried as a quick second attempt on the same key before moving to the next Groq key or falling through to Gemini.

If Groq deprecates these in the future, swap the two model strings in `api/chat.ts` (search for `GROQ_MODEL_PRIMARY` and `GROQ_MODEL_FAST`) — check [console.groq.com/docs/deprecations](https://console.groq.com/docs/deprecations) for current recommendations.

---

## 🔒 Security Review Before Deployment

Here is the checklist ensuring your application is safe and production-grade:
- ✅ **No hardcoded secrets**: All API keys (Groq, Gemini, Telegram, Brevo) are loaded strictly through `process.env` on serverless backend functions (`/api/*`). No key is ever exposed in client-side code or network responses. `.gitignore` excludes `.env` and all its variants, so real keys never get committed.
- ✅ **Server-side input sanitization**: `/api/contact.ts` strips all HTML tags and angle brackets to eliminate XSS risks, and both endpoints cap message/field lengths.
- ✅ **Rate limiting (best-effort, zero-infra, keyed by IP — see "Daily AI Quota Enforcement" above for the honest trade-off)**:
  - Contact Form: Maximum 3 inquiries per hour per IP.
  - Chatbot: Maximum 15 user messages per 24 hours per IP.
- ✅ **Reliable Telegram delivery**: lead notifications are sent as plain text (no Markdown parse mode), so a stray `_`, `*`, or `` ` `` in a visitor's name or message can never cause the notification to silently fail to send.
- ✅ **Strict LLM Guardrails**: The chatbot system prompt explicitly forbids jailbreaks, prompt leaks, and answering off-topic questions.

---

## 📧 Confirmation Email Not Arriving? (Brevo checklist)

1. **Use the API key, not the SMTP key.** It must start with `xkeysib-`.
2. **Verify your sender** (`BREVO_SENDER_EMAIL`) in Brevo → Senders, Domains & Dedicated IPs → Senders.
3. **Turn off "Authorised IPs" blocking** in Brevo → Settings → Security. Vercel's IPs change, so Brevo rejects them otherwise.
4. **Add the key in Vercel without quotes**, then **Redeploy** (env var changes only apply after a redeploy).
5. **Check Spam / Promotions** on the test inbox, and Brevo → Transactional → Logs to see if it was delivered.

Every lead's Telegram alert now ends with a line saying whether the confirmation email was sent, and if it failed, the exact Brevo error and how to fix it.

---

## 🌐 How to Deploy to Vercel (Step-by-Step)

Vercel is the easiest, fastest platform to host your site for free:

### 1. Push Your Code to GitHub
Create a GitHub repository and push your code:
```bash
git init
git add .
git commit -m "Initial portfolio setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tharun-portfolio.git
git push -u origin main
```

### 2. Connect to Vercel
1. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"Add New..."** -> **"Project"**.
3. Select your `tharun-portfolio` repository and click **Import**.
4. In the **Environment Variables** section, copy the keys from your `.env` file:
   - `GROQ_API_KEY_1`, `GROQ_API_KEY_2`, `GROQ_API_KEY_3`
   - `GEMINI_API_KEY_1`, `GEMINI_API_KEY_2`, `GEMINI_API_KEY_3`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `BREVO_API_KEY`
   - `BREVO_SENDER_EMAIL` (e.g. `tharunreddymofficialg@gmail.com`)
   - `BREVO_SENDER_NAME` ("Tharun Reddy M")
5. Click **"Deploy"**. Within 60 seconds, your site will be live on a fast, worldwide `.vercel.app` domain!
6. (Optional) Once you know your live URL, set `ALLOWED_ORIGIN` to it in the same Environment Variables screen — see `.env.example` for what this does.

---

## 🖼️ How to Update Your Photo and Project Images

All images are in `/public/images/`:
- **Your Photo**: Drop your profile image into `/public/images/tharun-photo.jpg`. The site will automatically show it in the **About Me** section!
- **Projects**: To change any project title, description, or image, open `/src/data/portfolioData.ts`. It's a clean TypeScript file where all text and links are organized in one place!
