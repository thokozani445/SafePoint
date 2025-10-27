# SafePoint MVP - FNB Hackathon

## 🚀 Quick Start (Get Running in 30 Minutes!)

### What You're Building
A complete SafePoint demonstration with:
- ✅ Staff web app for SafePoint locations
- ✅ WhatsApp-style bot for survivors
- ✅ Admin dashboard with live map
- ✅ Real-time incident tracking
- ✅ 35+ pre-loaded SafePoint locations

---

## 📋 Prerequisites Checklist

Before you start, make sure you have:
- [ ] Node.js 16+ installed ([Download here](https://nodejs.org/))
- [ ] A code editor (VS Code recommended)
- [ ] A Supabase account ([Sign up free](https://supabase.com))
- [ ] 30 minutes of focused time

---

## ⚡ Setup Steps

### Step 1: Create Supabase Project (5 minutes)

1. Go to https://supabase.com and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Name**: `SafePoint-MVP`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Europe West (closest to South Africa)
   - **Plan**: Free
4. Click **"Create new project"** and wait 2-3 minutes

### Step 2: Set Up Database (5 minutes)

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Open the file `supabase/schema.sql` and copy ALL the content
4. Paste it into the SQL Editor
5. Click **"Run"** (bottom right corner)
6. ✅ You should see "Success. No rows returned"

**Verify it worked:**
- Go to **"Table Editor"** in the sidebar
- You should see 3 tables: `safepoints`, `incidents`, `system_config`
- Click on `safepoints` - you should see 35 locations

### Step 3: Get Your API Keys (2 minutes)

1. In Supabase, go to **Settings** (gear icon) → **API**
2. Find and copy these two values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Step 4: Set Up Local Project (10 minutes)

Open your terminal and run these commands:

```bash
# Create project folder
mkdir safepoint-mvp
cd safepoint-mvp

# Initialize npm
npm init -y

# Install all dependencies
npm install react react-dom
npm install -D vite @vitejs/plugin-react
npm install @supabase/supabase-js leaflet react-leaflet lucide-react date-fns
```

### Step 5: Create Project Files (5 minutes)

Create these files in your project folder:

**1. Create `vite.config.js`:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 }
})
```

**2. Create `.env` file (IMPORTANT - Use YOUR keys!):**
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
⚠️ **Replace with your actual Supabase URL and key from Step 3!**

**3. Update `package.json` scripts section:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**4. Create folder structure:**
```bash
mkdir -p src/config src/components public
```

**5. Copy these files from the artifacts:**
- `public/index.html` → Copy from artifact
- `src/main.jsx` → Copy from artifact
- `src/App.jsx` → Copy from artifact
- `src/config/supabase.js` → Copy from artifact
- `src/components/LandingPage.jsx` → Copy from artifact
- `src/components/StaffApp.jsx` → Copy from artifact
- `src/components/WhatsAppBot.jsx` → Copy from artifact
- `src/components/AdminDashboard.jsx` → Copy from artifact

### Step 6: Run the App! (1 minute)

```bash
npm run dev
```

You should see:
```
VITE ready in 500ms
➜  Local:   http://localhost:3000/
```

Open your browser to **http://localhost:3000** 🎉

---

## 🎯 Testing the Demo

### Test Flow 1: Staff App
1. Click **"Staff Login"**
2. Enter PIN: `1234`
3. Select any location from dropdown
4. Click **"Login"**
5. Click **"New SafePoint Request"**
6. Check all SOP boxes
7. Click **"Connect Helpline"** and **"Issue Voucher"**
8. Click **"Complete Request"**

### Test Flow 2: WhatsApp Bot
1. Go back to home (click "Back")
2. Click **"WhatsApp Bot"**
3. Type: `Help`
4. Click **"No"** (not safe)
5. See nearest SafePoints appear
6. Click **"Call Helpline"**
7. Click **"Request Transport"**
8. See voucher code generated

### Test Flow 3: Admin Dashboard
1. Go back to home
2. Click **"Admin Dashboard"**
3. View the map with all SafePoints
4. Check the metrics (should show your test incident)
5. Filter by city (Johannesburg/Cape Town)
6. See incident feed update

---

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database connection errors
- Check your `.env` file has correct URL and key
- Make sure no extra spaces in the `.env` file
- Verify your Supabase project is not paused

### Map not loading
- Check internet connection (map tiles load from web)
- Open browser DevTools (F12) and check Console for errors

### Blank screen
- Open DevTools Console (F12)
- Look for error messages
- Most common: wrong file paths or missing files

---

## 📦 Project Structure

```
safepoint-mvp/
├── .env                          # Your Supabase credentials
├── package.json                  # Dependencies
├── vite.config.js               # Vite configuration
├── public/
│   └── index.html               # HTML entry point
├── src/
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # Main app component
│   ├── config/
│   │   └── supabase.js         # Database functions
│   └── components/
│       ├── LandingPage.jsx     # Home screen
│       ├── StaffApp.jsx        # Staff interface
│       ├── WhatsAppBot.jsx     # Chat interface
│       └── AdminDashboard.jsx  # Map & metrics
└── supabase/
    └── schema.sql              # Database schema
```

---

## 🎨 Customization Ideas

### Add More Locations
1. Go to Supabase **Table Editor** → `safepoints`
2. Click **"Insert row"**
3. Fill in: name, type (branch/atm/merchant), address, city, lat, lng, hours
4. Refresh your app

### Change Code Phrase
1. Go to **Table Editor** → `system_config`
2. Find row with key = `current_code_phrase`
3. Update the value
4. Refresh Staff App to see new phrase

### Customize Colors
- Edit Tailwind classes in component files
- Change `bg-blue-600` to `bg-purple-600`, etc.

---

## 🚀 Deploy for Live Demo

### Option 1: Vercel (Recommended)
```bash
npm run build
```
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
5. Deploy!

### Option 2: Netlify Drop
```bash
npm run build
```
1. Go to https://app.netlify.com/drop
2. Drag the `dist` folder
3. Add environment variables in site settings

---

## 📊 Demo Talking Points

### Opening (30 seconds)
"Every 4 hours, a woman is killed by her partner in South Africa. SafePoint turns FNB's network into a safety net - watch this..."

### Staff App (60 seconds)
"Staff get 15-minute training and a simple checklist. When someone uses the code phrase, staff follow this SOP to connect them to help in under 60 seconds."

### WhatsApp Bot (45 seconds)
"Survivors can use WhatsApp to find the nearest SafePoint, get directions, connect to helplines, or request transport - all discreetly."

### Admin Dashboard (45 seconds)
"Coordinators see the network in real-time: 35 locations, live incidents, response times, coverage areas. This scales to thousands of SafePoints."

### Closing (30 seconds)
"With FNB's 8,000 ATMs and 140,000 merchants, we can create the largest community safety network in Africa. Zero new hardware. Immediate deployment. Every FNB logo becomes a symbol of safety."

---

## ✅ Pre-Demo Checklist (Sunday Night)

- [ ] App runs without errors
- [ ] All three demos work (Staff, WhatsApp, Admin)
- [ ] Database has 35+ locations visible on map
- [ ] Code phrase displays correctly in Staff App
- [ ] Incidents show in Admin dashboard after testing
- [ ] Screenshots/screen recording as backup
- [ ] Pitch deck prepared
- [ ] Deployed to Vercel/Netlify for backup
- [ ] Tested on presentation laptop
- [ ] Charged laptop + backup charger

---

## 🆘 Last-Minute Help

### Saturday/Sunday Support
If you're stuck, check:
1. Browser Console (F12) for error messages
2. Supabase logs (Dashboard → Logs)
3. This README troubleshooting section

### Monday Morning Panic
- Use screen recording as backup
- Have screenshots ready
- Can demo from localhost if wifi fails

---

## 🏆 You've Got This!

Remember:
- ✨ The idea is innovative and impactful
- 💻 The tech is solid and functional
- 🎯 Focus on the story, not perfection
- ❤️ You're solving a real problem that matters

**Good luck with the hackathon! 🚀**