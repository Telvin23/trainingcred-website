# Trainingcred website

React + Vite + Tailwind. Every page is prerendered to static HTML for Google (scripts/prerender.mjs),
then hydrated in the browser. Bookings and enquiries go to Vercel serverless functions in `api/`
and are stored in a Postgres database (Neon). Staff manage them at `/admin`.

## Commands
- `npm run dev`      local preview at http://localhost:5173 (forms show the WhatsApp fallback locally, because /api only runs on Vercel)
- `npm run build`    production build into dist/ (prerenders 80+ pages and sitemap.xml)
- `npm run preview`  serve the built site

## Where things live
- `src/data/site.js`     phone, email, socials, hero photos, FAQs, advisory services, placeholders in [brackets]
- `src/data/catalog.js`  focus areas and training cities
- `src/data/courses.js`  45 courses (real Trainingcred titles and URL slugs), dates and fees
- `scripts/make-redirects.mjs`  rebuilds the 301 redirects in vercel.json from old trainingcred.com links (run after adding courses)
- `src/components/LogoCube.jsx`  the optical-illusion cube logo (also public/favicon.svg, logo.svg, logo-512.png)
- `src/pages/`           pages; `src/components/` header, footer, slideshow, course cards, forms
- `api/enquiry.js`       saves bookings / quotes / brochure / contact / advisory requests, emails staff (optional)
- `api/admin/enquiries.js`  list + update status/notes for /admin

## Vercel environment variables
- `DATABASE_URL`     added automatically when you connect a Neon database (Storage tab)
- `ADMIN_PASSWORD`   password for /admin (at least 8 characters, use a long random one)
- `RESEND_API_KEY`   optional, email alert for every new request (resend.com)
- `NOTIFY_EMAIL`     where alerts go (default info@trainingcred.com)
- `NOTIFY_FROM`      sender, e.g. `Trainingcred Website <bookings@trainingcred.com>` (domain verified in Resend)
- `CRON_SECRET`      any long random text; lets Vercel run the 7 am follow-up email (api/cron/followups.js)

## Follow-up workflow
Every request gets a reference (TC-YYMMDD-XXXXXX), a confirmation email to the person (when Resend is set),
an alert email to staff, and a follow-up date (next working day). In /admin staff see "Follow up today", assign
requests to themselves, move them through new > contacted > confirmed > invoiced > paid > attended (or cancelled/lost),
send ready-made WhatsApp/email messages for each stage, log calls, and every change is kept in the history.
At 7:00 am Nairobi time on weekdays staff get an email listing everything due that day.

The `enquiries` table is created automatically on the first request.

## Before launch, confirm with Trainingcred
Classroom fees other than live online (KSh 80,000/160,000) and Cairo/Dubai (USD 4,200); the payment,
transfer and cancellation terms; what the fee includes; daily hours (8:30-4:30); office hours; data retention
periods in the privacy notice. Use photos you have the rights to (some hero photos come from other events).
