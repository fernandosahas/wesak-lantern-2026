# 🏮 B/Badulla Central College — Wesak Lantern Competition 2026

A full production-ready Next.js 15 web app for the annual Wesak Lantern Competition.
Visitors vote for their favourite lantern. Admins manage everything through a secure dashboard.

---

## 📋 Table of Contents
1. [Quick Overview](#quick-overview)
2. [Tech Stack](#tech-stack)
3. [Local Installation](#local-installation)
4. [Supabase Setup](#supabase-setup)
5. [Cloudinary Setup](#cloudinary-setup)
6. [Resend Setup](#resend-setup)
7. [Cloudflare Turnstile Setup](#cloudflare-turnstile-setup)
8. [Admin Credentials Setup](#admin-credentials-setup)
9. [Vercel Deployment](#vercel-deployment)
10. [Project Structure](#project-structure)
11. [Anti-Cheat System](#anti-cheat-system)
12. [Troubleshooting](#troubleshooting)

---

## Quick Overview

- **Public users** can view 12 lanterns, cast ONE vote, see live rankings
- **Admin** can add/edit lanterns, toggle voting, view analytics, export CSV
- **Anti-cheat**: Cloudflare Turnstile + IP hash + device fingerprint + rate limiting

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 15 App Router | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Supabase | Database + Auth |
| Cloudinary | Image hosting |
| Resend | Email alerts |
| Cloudflare Turnstile | CAPTCHA |
| Framer Motion | Animations |
| Vercel | Deployment |

---

## Local Installation

> Follow these steps **exactly** in order. Each step builds on the previous one.

### Step 1 — Prerequisites

Make sure you have these installed on your computer:

```bash
# Check Node.js version (needs 18.17 or higher)
node --version

# Check npm version
npm --version

# If Node is not installed, download from: https://nodejs.org
```

### Step 2 — Download the project

```bash
# Clone or unzip the project folder, then navigate into it
cd wesak-lantern-2026
```

### Step 3 — Install dependencies

```bash
npm install
```
This installs all the packages listed in `package.json`. It may take 1-2 minutes.

### Step 4 — Create environment file

```bash
# Copy the example file
cp .env.example .env.local
```

Now open `.env.local` in a text editor. You will fill in the values in the steps below.

### Step 5 — Set up all services (see sections below)

Follow each service setup section, then add the values to `.env.local`.

### Step 6 — Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
Admin panel: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)

---

## Supabase Setup

Supabase is the database. Think of it as Google Sheets but for apps.

### Step 1 — Create account
1. Go to [https://supabase.com](https://supabase.com)
2. Click **Start your project**
3. Sign up with GitHub or email

### Step 2 — Create a project
1. Click **New Project**
2. Fill in:
   - **Organization**: your name or school
   - **Project name**: `wesak-lantern-2026`
   - **Database password**: create a strong password and **save it somewhere**
   - **Region**: choose Singapore (closest to Sri Lanka)
3. Click **Create new project** and wait ~2 minutes

### Step 3 — Run the database setup SQL
1. In your project, click **SQL Editor** on the left sidebar
2. Click **New query**
3. Open the file `SUPABASE_SETUP.sql` from this project
4. Copy ALL the contents and paste into the SQL editor
5. Click **Run** (green button)
6. You should see: `Setup complete! Tables created: ...`

### Step 4 — Get your API keys
1. Click **Settings** (gear icon) → **API**
2. Copy these values into your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...long_key_here
SUPABASE_SERVICE_ROLE_KEY=eyJ...another_long_key_here
```

> ⚠️ The Service Role Key is like a master password. Never share it or put it in frontend code.

---

## Cloudinary Setup

Cloudinary stores and optimizes the lantern images.

### Step 1 — Create account
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click **Sign Up for Free**

### Step 2 — Get credentials
1. After signing up, you land on the Dashboard
2. You will see **Cloud Name**, **API Key**, **API Secret**
3. Add to `.env.local`:

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnop
```

### Step 3 — Create upload preset (optional but recommended)
1. Go to **Settings** → **Upload** → **Upload presets**
2. Click **Add upload preset**
3. Set preset name: `wesak-lanterns-2026`
4. Set signing mode: **Signed**
5. Save

---

## Resend Setup

Resend sends email alerts when suspicious voting is detected.

### Step 1 — Create account
1. Go to [https://resend.com](https://resend.com)
2. Sign up with your email

### Step 2 — Get API key
1. Go to **API Keys** in the dashboard
2. Click **Create API Key**
3. Name it: `wesak-2026`
4. Copy the key and add to `.env.local`:

```bash
RESEND_API_KEY=re_abcdefghijklmnop
RESEND_FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=your@email.com
```

### Step 3 — Verify your domain (for production)
1. Go to **Domains** → **Add domain**
2. Follow the DNS instructions to verify your domain
3. Use `noreply@yourdomain.com` as the FROM address

> 📝 **Note**: For testing, Resend allows sending from `onboarding@resend.dev` to your own email without domain verification.

---

## Cloudflare Turnstile Setup

Turnstile is the CAPTCHA that stops bots from voting.

### Step 1 — Create Cloudflare account
1. Go to [https://cloudflare.com](https://cloudflare.com)
2. Sign up (free account is fine)

### Step 2 — Create Turnstile widget
1. Go to your Cloudflare dashboard
2. Click **Turnstile** in the left sidebar
3. Click **Add Site**
4. Fill in:
   - **Site name**: `Wesak Lantern Competition 2026`
   - **Domain**: your domain (e.g., `wesak2026.vercel.app`)
   - **Widget type**: choose **Managed** (recommended)
5. Click **Create**

### Step 3 — Copy keys
1. You will see **Site Key** and **Secret Key**
2. Add to `.env.local`:

```bash
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=0x4AAAAAAA...
CLOUDFLARE_TURNSTILE_SECRET_KEY=0x4AAAAAAA...secret...
```

### For local development (test keys)
Cloudflare provides special test keys that always pass:
```bash
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
CLOUDFLARE_TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

---

## Admin Credentials Setup

The admin panel uses Supabase Auth (email + password login).

### Step 1 — Create admin user in Supabase
1. In your Supabase project, click **Authentication** → **Users**
2. Click **Invite user** (or **Add user**)
3. Enter your admin email and a strong password
4. Click **Send invitation** (or **Create user**)

### Step 2 — Set admin email in environment
In `.env.local`, set:
```bash
ADMIN_EMAIL=your_admin_email@example.com
```
This email is the ONLY one allowed to access `/admin`. Anyone else gets rejected.

### Step 3 — Login
1. Go to `http://localhost:3000/admin/login`
2. Enter your admin email and password
3. You will be taken to the dashboard

> 🔒 The admin routes are protected by both Supabase Auth AND email verification in middleware.

---

## Vercel Deployment

Vercel is the hosting platform. It deploys automatically when you push to GitHub.

### Step 1 — Push to GitHub
1. Create a new repository on [https://github.com](https://github.com)
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/wesak-lantern-2026.git
git push -u origin main
```

### Step 2 — Connect to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Sign up / sign in with GitHub
3. Click **Add New Project**
4. Find and select your `wesak-lantern-2026` repository
5. Click **Import**

### Step 3 — Add environment variables
Before clicking Deploy, click **Environment Variables** and add ALL variables from your `.env.local`:

| Variable | Where to get it |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same place |
| `SUPABASE_SERVICE_ROLE_KEY` | Same place (mark as Secret) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary Dashboard (mark as Secret) |
| `RESEND_API_KEY` | Resend Dashboard → API Keys |
| `RESEND_FROM_EMAIL` | Your verified email |
| `ADMIN_EMAIL` | Your admin login email |
| `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | Cloudflare Turnstile |
| `IP_HASH_SALT` | Run: `openssl rand -hex 32` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` |

### Step 4 — Deploy
1. Click **Deploy**
2. Wait ~2 minutes for the build to complete
3. Vercel gives you a URL like `wesak-lantern-2026.vercel.app`

### Step 5 — Add Vercel URL to Cloudflare Turnstile
1. Go back to Cloudflare Turnstile
2. Edit your widget
3. Add your Vercel domain (e.g., `wesak-lantern-2026.vercel.app`)
4. Save

### Step 6 — Update NEXT_PUBLIC_SITE_URL
1. In Vercel → your project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_SITE_URL` to your actual Vercel URL
3. Redeploy (Deployments → ⋯ → Redeploy)

---

## Project Structure

```
wesak-lantern-2026/
├── app/
│   ├── page.tsx                    # 🏠 Main landing page
│   ├── layout.tsx                  # Root layout + metadata
│   ├── globals.css                 # Global styles + animations
│   ├── not-found.tsx               # 404 page
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout with sidebar
│   │   ├── login/page.tsx          # Admin login form
│   │   ├── dashboard/page.tsx      # Live stats dashboard
│   │   ├── lanterns/page.tsx       # Manage lanterns
│   │   ├── analytics/page.tsx      # Vote charts
│   │   ├── logs/page.tsx           # Activity audit log
│   │   └── settings/page.tsx       # Voting on/off toggle
│   └── api/
│       ├── vote/route.ts           # ⭐ Main vote endpoint
│       ├── og/route.tsx            # Dynamic OG image
│       └── admin/
│           ├── lanterns/route.ts   # CRUD lanterns
│           ├── settings/route.ts   # Update settings
│           ├── upload/route.ts     # Upload to Cloudinary
│           └── export/route.ts     # Download CSV
├── components/
│   ├── navigation.tsx              # Top navigation bar
│   ├── hero-section.tsx            # Landing page hero
│   ├── countdown-timer.tsx         # Voting countdown
│   ├── lantern-grid.tsx            # 12-lantern gallery
│   ├── lantern-card.tsx            # Individual lantern
│   ├── lantern-modal.tsx           # Full-screen lantern view
│   ├── vote-button.tsx             # Vote + Turnstile logic
│   ├── vote-success-animation.tsx  # Confetti celebration
│   ├── leaderboard.tsx             # Live rankings
│   ├── rules-section.tsx           # Competition rules
│   ├── footer.tsx                  # Site footer
│   ├── skeletons.tsx               # Loading states
│   └── admin/
│       ├── admin-sidebar.tsx       # Admin navigation
│       ├── dashboard-stats.tsx     # Stat cards
│       ├── voting-toggle.tsx       # Enable/disable voting
│       ├── recent-votes.tsx        # Live vote feed
│       ├── lantern-management-client.tsx  # Add/edit/delete UI
│       └── analytics-charts.tsx    # Bar charts
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase
│   │   └── server.ts               # Server Supabase + service role
│   ├── cloudinary.ts               # Image upload
│   ├── resend.ts                   # Email alerts
│   ├── fingerprint.ts              # Browser fingerprinting
│   ├── rate-limit.ts               # Rate limiting
│   └── utils.ts                    # Helpers + IP hashing
├── types/index.ts                  # All TypeScript types
├── middleware.ts                   # Route protection
├── SUPABASE_SETUP.sql              # Database schema
├── .env.example                    # Env variable template
└── package.json                    # Dependencies
```

---

## Anti-Cheat System

The voting system has 7 layers of protection:

| Layer | How it works |
|-------|-------------|
| **Cloudflare Turnstile** | Invisible CAPTCHA proves you're human |
| **IP Hashing** | Your network IP is hashed and stored; same network can't vote twice |
| **Device Hash** | Browser specs create a device fingerprint stored in hash |
| **Canvas Fingerprint** | Canvas rendering creates a unique per-browser signature |
| **Rate Limiting** | Max 3 vote attempts per minute per IP |
| **LocalStorage** | Client-side check prevents re-opening vote modal |
| **Supabase UNIQUE constraints** | Database-level guarantee of one vote per IP/device/fingerprint |

Even if someone bypasses the browser, they still need to defeat Turnstile + pass server-side validation.

---

## Troubleshooting

### "Voting is not currently open" error
→ Log in to admin → Settings → turn on voting toggle → Save

### Images not showing
→ Check `CLOUDINARY_CLOUD_NAME` in `.env.local` is correct
→ Images must be uploaded via admin panel

### Admin login not working  
→ Make sure the email you're logging in with matches `ADMIN_EMAIL` in `.env.local`
→ The user must exist in Supabase Authentication → Users

### Turnstile CAPTCHA not appearing
→ Check `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` is correct
→ For local dev use the test key: `1x00000000000000000000AA`

### Database errors
→ Make sure you ran `SUPABASE_SETUP.sql` completely
→ Check `SUPABASE_SERVICE_ROLE_KEY` is the service role key, not the anon key

### Build errors on Vercel
→ Check all environment variables are set in Vercel dashboard
→ Run `npm run type-check` locally to find TypeScript errors first

---

## 📞 Support

For issues, check the error message carefully. Most problems are missing or wrong environment variables.

**Made with ❤️ for B/Badulla Central College Wesak Lantern Competition 2026** 🏮
