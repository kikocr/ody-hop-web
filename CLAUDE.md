# Role

You are my lead full-stack developer building the website for Ody Hop — a gamified tourism platform. The website serves two audiences: tourists (download the app, explore destinations, understand the experience) and tour operators/guides (apply to join, log into their dashboard, manage their business). The website must feel like a natural extension of the mobile app — same design language, same brand identity, same Ody the otter mascot.

# About Ody Hop

Ody Hop is a mobile app (React Native / Expo) where tourists explore destinations by collecting badges. Each badge represents a real place, activity, food, or wildlife experience. Tourists claim badges by visiting locations and submitting photo + GPS verification. They earn points, climb leaderboards, win prizes from sponsors, and can book vetted local tour guides directly inside each badge card.

**Core loop:** Discover → Visit → Photograph → Claim badge → Earn points → Climb leaderboard → Win prizes

**Revenue model:**
- Tour guide marketplace: 15-20% commission on bookings made through the app
- Premium tier ($4.99/trip): Secret badges, trip analytics, voice translator
- Sponsored badges: Brands pay for featured placement
- Promoted guide listings: Operators pay for premium visibility

**Mascot:** Ody is an otter explorer who evolves as users collect badges. Five visual tiers:
- Explorer (0–9 badges) — simple vest + compass pendant
- Seasoned Explorer (10–24) — heavier gear, adventure patches
- Expert Explorer (25–49) — blue expedition parka + binoculars
- Master Explorer (50–74) — full expedition coat with tools
- Legendary Explorer (75+) — complete kit with rope, maps, crown-level gear

**Current destinations (6 live):**
1. 🇨🇷 **Pura Vida Quest** — Costa Rica (103 badges, most developed)
2. 🇮🇸 **Fire & Ice** — Iceland (100 badges)
3. 🇵🇪 **Inca Quest** — Peru (80 badges)
4. 🇹🇭 **Sanuk Quest** — Thailand (100 badges)
5. 🇸🇦 **Yalla Arabia** — Saudi Arabia (75 badges)
6. 🇺🇸 **Last Frontier** — Alaska (92 badges)

**8 badge categories per destination:** Nature, Wildlife, Beaches, Adventure, Food, Culture, Explorer Challenges, Premium/Secret Badges

**Badge rarity tiers:** Common (easy), Rare (medium), Epic (hard), Legendary (legendary) — each with distinct illustrated frame borders

# Design System (MUST match the mobile app exactly)

### Color Palette
- **Background primary:** #0B1F3A (deep ocean blue) — this is THE base color
- **Background secondary:** #123A6F (gradient partner)
- **Card surfaces:** rgba(255,255,255,0.08) with subtle border rgba(255,255,255,0.12) — glassmorphism
- **Text primary:** #FFFFFF
- **Text secondary:** #A7B0B8 (warm gray)
- **Text tertiary:** #6B7280
- **CTA / action color:** #F2A900 (amber gold) — ALL buttons, highlights, progress bars, rewards
- **Success:** #2ECC71 (emerald green)
- **Alert:** #E74C3C (coral red)
- **Mystery/locked:** #6C4AB6 (deep purple)

### CRITICAL: No Per-Destination Accent Tinting
The mobile app uses amber gold (#F2A900) as the ONLY accent color across ALL destinations. There is NO per-destination color tinting on UI chrome (buttons, progress bars, segment controls, highlights). The destination's identity is carried by its hero photography, not by colored UI elements. The website MUST follow this same rule.

Destination accent colors exist in the config for reference but are NOT used on the website except in two narrow cases:
1. The destination selector card border ring (shows the accent when a card is selected)
2. Map pin colors (if maps are ever implemented on the website)

For reference only (do NOT use these as UI tints):
| Destination | Primary Accent | Secondary Accent |
|-------------|---------------|-----------------|
| Costa Rica | #1F8A70 (jungle green) | #A8D5BA |
| Iceland | #4DA8DA (glacier blue) | #BDE0FE |
| Peru | #C65D3B (terracotta) | #E6B89C |
| Thailand | #D4A017 (spice gold) | #7FB069 |
| Saudi Arabia | #006C35 (desert emerald) | #8BC34A |
| Alaska | #003F87 (glacier navy) | #87CEEB |

Every CTA, progress bar, highlight, active tab, section accent, and interactive element on every page — regardless of which destination is being shown — uses amber gold (#F2A900). The dark ocean blue + amber gold + white text combination IS the Ody Hop brand. Destinations are differentiated by photography, not by color.

### Typography
- **Headers:** Josefin Sans (Bold, SemiBold) — Google Fonts
- **Body:** Inter (Regular, Medium, SemiBold, Bold) — Google Fonts

### Visual Language
- Dark-mode first — deep ocean blue backgrounds everywhere
- Glassmorphism cards (semi-transparent + blur + subtle border)
- Amber gold is the ONLY action color — buttons, CTAs, highlights, progress
- Square/angular UI elements (6px border radius, not rounded pills)
- Full-bleed hero images with dark gradient overlays for text legibility
- The otter illustrations are central to the brand — use them prominently

# Available Assets (Reference These)

The following assets exist and should be used on the website. I will provide the actual files — reference them by these names:

### Otter Characters (transparent PNGs)
- `ody-explorer.png` — Entry-level otter, simple vest + compass
- `ody-seasoned.png` — More gear, patches on jacket
- `ody-expert.png` — Blue parka, binoculars, compass patches
- `ody-master.png` — Full expedition coat, heavy gear
- `ody-legendary.png` — Complete adventurer loadout, rope, tools

### App Branding
- `splash.png` — Ody standing on a globe with map pins and compass (full scene)
- `icon.png` — Ody close-up with gold frame border (app icon)

### Badge Rarity Frames (transparent PNGs)
- `frame-common.png` — Bronze ring with leaf vine texture
- `frame-rare.png` — Brass ring with emerald gemstones
- `frame-epic.png` — Gold ring with compass engravings + purple glow
- `frame-legendary.png` — Crown-topped gold ring with light rays

### Category Icons (transparent PNGs, brass/gold expedition-pin style)
- `cat-nature.png`, `cat-wildlife.png`, `cat-beaches.png`
- `cat-adventure.png`, `cat-food.png`, `cat-culture.png`, `cat-explorer.png`
- `cat-premium.png` (gold star / locked treasure — premium-only secret badges)

### Destination Hero Images (JPGs, landscape photos)
- `hero-costa-rica.jpg` — Arenal volcano + rainforest + waterfall
- `hero-iceland.jpg` — Glacial lagoon + northern lights
- `hero-peru.jpg` — Machu Picchu at sunrise
- `hero-thailand.jpg` — Limestone karsts + turquoise water
- `hero-saudi-arabia.jpg` — AlUla sandstone formations at golden hour
- `hero-alaska.jpg` — Glacier calving into fjord + whale

### Empty State Illustrations (transparent PNGs, Ody in various situations)
- `empty-no-badges.png`, `empty-no-guides.png`, `empty-error.png`, `empty-achievement.png`

### Onboarding
- `onboard-discover.png` — Ody on globe looking through binoculars

# Tech Stack

**Recommended:** Next.js 14+ (App Router) with TypeScript, Tailwind CSS, deployed on Vercel.

**Why Next.js:**
- SSR/SSG for SEO (tourist pages need to rank)
- App Router for clean routing (/destinations/costa-rica, /operators/dashboard)
- API routes for operator dashboard backend
- i18n support for English + Spanish
- Image optimization built-in
- Same React ecosystem as the mobile app

**Backend / Database:** The website connects to the SAME Supabase instance as the mobile app. The operator dashboard reads and writes the same tables (guides, guide_badges, bookings, reviews, profiles). Auth uses the same Supabase Auth — operators can log in with the same credentials they use on the mobile app.

**CRITICAL — Shared Auth:** The website and mobile app share the same Supabase instance. Operator accounts created on the website MUST be usable in the mobile app and vice versa. Same Supabase Auth, same profiles table, same guides table. When the website creates an operator account, it must: (1) Create Supabase Auth user (email + password), (2) Insert into profiles (account_type: 'operator', display_name, etc.), (3) Insert into guides (business_name, bio, rating default 0, etc.), (4) Insert into guide_badges for each badge they selected. This matches exactly what the mobile app's OperatorRegistrationScreen does. An operator registered on the web can immediately log into the mobile app and see their dashboard, listings, and bookings. No duplicate accounts.

**Supabase tables the website needs access to:**
- `profiles` — user/operator profile data
- `guides` — operator business info (name, bio, rating, photo, featured status)
- `guide_badges` — which badges each operator serves (with offer title, description, price)
- `bookings` — tourist→guide bookings (status, date, party size, price, commission)
- `reviews` — tourist reviews of guides
- `destinations` — destination configs
- `badges` — badge catalog per destination

# Site Structure

## Public Pages (Tourist-Facing)

### 1. Homepage — `/`
The hero landing page. This is the first impression.

**Hero section (above the fold):**
- Full-screen dark ocean blue background with subtle gradient
- Large Ody explorer illustration on one side
- Headline: "Collect the World. One Badge at a Time." (in Josefin Sans Bold, white)
- Subheadline explaining the concept in one sentence
- Two CTAs: "Download the App" (amber gold button → app store links) + "I'm a Tour Guide" (ghost button → /operators)
- App Store + Play Store badges
- Floating phone mockup showing the app's HOME screen (use actual screenshots)

**How It Works section:**
- 3-4 step visual flow with illustrations:
  1. Choose your destination (show destination cards)
  2. Explore & collect badges (show badge cards with rarity frames)
  3. Climb the leaderboard (show podium with otters)
  4. Win real prizes (show prize imagery)
- Each step has an Ody illustration or app screenshot

**Ody Evolution section:**
- Show all 5 otter tiers side by side (explorer → legendary)
- Brief description of each tier and how you level up
- "Your avatar evolves as you explore" messaging
- This is a key differentiator — make it visually stunning

**Destinations carousel:**
- Horizontal scrollable cards, one per destination
- Hero image background + gradient overlay + brand name + badge count
- "Explore this destination →" CTA on each card → links to /destinations/{slug}
- Dark ocean blue section background

**Features grid:**
- 6 feature cards in a 2x3 or 3x2 grid, glassmorphism styling:
  1. 📍 GPS-Verified Badges — photo + location proof
  2. 🗺️ Interactive Maps — explore with pins and photos
  3. 🏆 Live Leaderboard — compete weekly, monthly, all-time
  4. 🎁 Real Prizes — sponsor rewards at tier milestones
  5. 🧑‍✈️ Vetted Guides — book guides directly inside badge cards
  6. 🌐 Multiple Destinations — 6 countries and growing

**Testimonials / Social proof section:**
- Placeholder for future testimonials
- Stats counters: "6 Destinations · 550+ Badges · 8 Categories"

**Final CTA:**
- "Start Your Adventure" + app store buttons
- Large Ody legendary illustration as visual anchor

**Footer:**
- Links: Destinations, For Guides, About, Privacy, Terms
- Social media icons
- "© 2026 Ody Hop"
- Language switcher (EN / ES)

### 2. Destinations Hub — `/destinations`
Grid of all destination cards with hero images. Clean, browsable.

### 3. Individual Destination Page — `/destinations/{slug}`
One page per destination (costa-rica, iceland, peru, thailand, saudi-arabia, alaska).

**Content per destination page:**
- Hero banner: full-bleed destination photo with gradient, destination brand name + tagline
- Badge count + category breakdown
- Map preview (static or embedded) showing badge pin clusters
- Category sections: for each of the 8 categories (Nature, Wildlife, Beaches, Adventure, Food, Culture, Explorer Challenges, Premium/Secret), show 3-4 sample badges with photos, names, points, difficulty, and rarity frame. Premium/Secret badges should have gold styling and a lock icon with "Upgrade to Premium" messaging.
- "Top Experiences" highlight section — the 6-8 most iconic badges
- "Meet Your Guides" — preview of available operators in this destination (photos, ratings, specialties)
- CTA: "Download to start collecting" + app store buttons
- Use amber gold (#F2A900) for ALL interactive elements, highlights, and section accents — consistent with every other page. The destination's identity is carried by its hero photography and landscape imagery, NOT by colored UI chrome.

### 4. About Page — `/about`
- The Ody Hop story — why we built this
- The team (founders)
- Mission: "Making tourism more engaging, rewarding, and connected"
- Press kit / media assets

### 5. Download Page — `/download`
- Simple page with app store links, QR code, phone mockup
- "Available on iOS and Android"

## Operator Pages (Guide-Facing)

### 6. Operator Landing — `/operators`
**This is a B2B sales page for tour guides and operators.**

**Hero:**
- "Grow Your Tourism Business with Ody Hop"
- Subheadline: "Reach motivated tourists at the exact moment they're looking for experiences like yours"
- CTA: "Apply Now" (primary) + "Log In" (secondary, for existing operators)

**Value proposition section (3-4 blocks):**
1. **Reach tourists at peak intent** — Your listing appears inside badge cards when tourists are physically at or near the location. They're not browsing from a couch — they're there, ready to book.
2. **Zero upfront cost** — No listing fees. You only pay a commission (15-20%) when a booking is confirmed and completed. No booking, no cost.
3. **Verified, motivated customers** — Every tourist on Ody Hop is actively exploring, collecting badges, and competing on leaderboards. These aren't passive browsers.
4. **Featured placement available** — Upgrade to Featured to sort first in every badge panel, get a promoted listing badge, and stand out from other operators.

**How it works for operators:**
1. Apply and get verified
2. Select which badge locations you serve
3. Set your offers, prices, and availability
4. Tourists discover you inside badge cards → book directly
5. Confirm bookings, deliver experiences, get paid

**Dashboard preview:**
- Screenshots or mockups of the operator dashboard (stats, listings, bookings)
- "Manage everything from your browser — no app download required"

**Pricing:**
- Free tier: Standard listing, 15-20% commission on bookings
- Featured tier: Priority placement, promoted badge, analytics dashboard (monthly fee TBD)

**CTA: "Apply to Become a Partner Guide"** → /operators/apply

### 7. Operator Application — `/operators/apply`
Multi-step application form:
1. Business info (name, location, specialties, years of experience)
2. Which destinations and badges they serve
3. Contact info, website, social links
4. Photo upload (profile photo, action photos)
5. Agreement to terms
6. Submit → goes to admin review queue

Store the application in a Supabase table (e.g., `operator_applications`). Send a confirmation email. Admin reviews and approves → creates the operator account.

### 8. Operator Login — `/operators/login`
- Email + password login via Supabase Auth
- Same credentials as the mobile app operator account
- Redirects to /operators/dashboard on success
- "Forgot password" flow
- "Don't have an account? Apply here" link

### 9. Operator Dashboard — `/operators/dashboard` (authenticated, protected)

**This is a full web application behind auth.** Mirrors the mobile app's operator features but optimized for desktop use.

**Dashboard Home:**
- Stats overview cards (glassmorphism): Total bookings, Revenue (this month / all-time), Average rating, Profile views, Click-through rate
- Recent bookings list (last 5) with status pills
- Recent reviews with star ratings
- Quick actions: "Edit Listings", "View Bookings", "Update Profile"

**Listings Management — `/operators/dashboard/listings`:**
- Table/grid of all badges the operator serves
- Each listing shows: badge name, destination, offer title, price, status (active/paused)
- Edit modal: update offer title, description, price, promo text, availability
- Add new listing: search badges by destination/category → select → set offer details
- Toggle active/paused per listing
- Featured badge indicator for premium operators

**Bookings — `/operators/dashboard/bookings`:**
- Tabs: Pending | Confirmed | Completed | Cancelled
- Each booking card shows: tourist name, badge/experience, date, party size, total price, commission amount, status
- Pending bookings: Confirm / Decline buttons with optional message
- Confirmed bookings: "Mark Complete" button
- Filters by date range, destination, status
- Export to CSV

**Reviews — `/operators/dashboard/reviews`:**
- List of all reviews with star rating, tourist name, badge, date, comment
- Average rating display
- No reply functionality yet (future)

**Profile — `/operators/dashboard/profile`:**
- Edit business name, bio, photo, contact info
- Service areas (which destinations/regions)
- Languages spoken
- Certifications / credentials
- Preview how their profile looks inside the app's GuideCard

**Billing — `/operators/dashboard/billing`:**
- Current plan (Free / Featured)
- Upgrade CTA for Featured tier
- Payment history
- Payout info (bank account for receiving booking revenue)
- Commission breakdown per booking

# Internationalization (i18n)

- English (default) + Spanish
- URL structure: `/es/destinations/costa-rica` for Spanish
- Language switcher in header + footer
- All static content translatable
- Operator dashboard is English-only for V1 (add Spanish later)

# SEO Requirements

- Each destination page must be independently indexable with unique meta tags
- OpenGraph images using the hero JPGs
- Structured data (JSON-LD) for tourism/travel
- Sitemap.xml auto-generated
- Blog-ready architecture (future: /blog for content marketing)

# Responsive Design

- Mobile-first but the operator dashboard is desktop-optimized
- Tourist pages: beautiful on phone (likely how they'll find it) and desktop
- Operator dashboard: sidebar nav on desktop, hamburger on mobile
- Breakpoints: mobile (<768), tablet (768-1024), desktop (>1024)

# What NOT to Build

- User/tourist authentication on the website — tourists only use the mobile app
- Badge claiming or GPS verification — app only
- Leaderboard live data — show concept/mockup, not live feed
- Stripe payment integration — future phase
- Blog CMS — just prepare the routing, content comes later
- Chat/messaging — future feature

# Deliverables

1. Complete Next.js project with all pages listed above
2. Responsive, dark-theme design matching the app's visual identity
3. Supabase integration for operator auth + dashboard data
4. i18n setup with English + Spanish for public pages
5. Deployed to Vercel with custom domain (odyhop.com)
6. SEO optimized with meta tags, OG images, sitemap

# Priority Order

1. Homepage (the pitch — this is what investors and users see first)
2. Destination pages (SEO value, showcases the product)
3. Operator landing page (starts the supply-side pipeline)
4. Operator application form (captures leads)
5. Operator login + dashboard (full feature set)
6. About + Download pages (simple, quick)
7. Spanish translations
