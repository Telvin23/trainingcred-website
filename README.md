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
- `src/data/courses.js`  SAMPLE courses, dates and fees (replace with the real catalogue, same shape)
- `src/pages/`           pages; `src/components/` header, footer, slideshow, course cards, forms
- `api/enquiry.js`       saves bookings / quotes / brochure / contact / advisory requests, emails staff (optional)
- `api/admin/enquiries.js`  list + update status/notes for /admin

## Vercel environment variables
- `DATABASE_URL`     added automatically when you connect a Neon database (Storage tab)
- `ADMIN_PASSWORD`   password for /admin (at least 8 characters, use a long random one)
- `RESEND_API_KEY`   optional, email alert for every new request (resend.com)
- `NOTIFY_EMAIL`     where alerts go (default info@trainingcred.com)
- `NOTIFY_FROM`      sender, e.g. `Trainingcred Website <bookings@trainingcred.com>` (domain verified in Resend)

The `enquiries` table is created automatically on the first request.

## Before launch
Replace everything in [brackets]: client logos, testimonials, participant count, office address,
payment terms, cancellation policy, daily hours, venue names. Have the privacy notice and terms reviewed.
Use photos you have the rights to (some of the current hero photos come from other events).
