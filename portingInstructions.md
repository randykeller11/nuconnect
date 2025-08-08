Here is the full content for **instructions.md**. You can copy this into a file named `instructions.md` and feed it to your AI coding tool (Aider) as the step-by-step implementation spec.

````markdown
# instructions.md

## Goal

Move the existing Next.js 14 + Express application from Vercel to Heroku, wire up the questionnaire, professional signup, and contact forms to a Supabase PostgreSQL backend (using Drizzle ORM and Zod for validation), and ensure all submissions are viewable in the admin dashboard with secure admin access.

---

## Prerequisites

1. Heroku account and Heroku CLI installed. :contentReference[oaicite:0]{index=0}  
2. Supabase account and project created. :contentReference[oaicite:1]{index=1}  
3. Git repository containing the current codebase (Next.js app with Express backend). :contentReference[oaicite:2]{index=2}  
4. Node.js version aligned to Next.js 14 requirements (Node 18+ recommended) declared in `package.json`. :contentReference[oaicite:3]{index=3}  
5. Familiarity with TypeScript, Drizzle ORM, and Zod. :contentReference[oaicite:4]{index=4}  

---

## Step-by-Step Instructions

### 1. Supabase Setup

1.1. **Create Supabase Project**  
- In the Supabase dashboard, create a new project. Save the project URL and the service role key & anon key. These will become environment variables. :contentReference[oaicite:5]{index=5}  

1.2. **Define Database Schema**  
- Implement the three core tables either via Supabase SQL editor or via Drizzle schema definitions:  
  - `questionnaire_responses`  
  - `professional_signups`  
  - `contact_submissions`  

  Example Drizzle schema definitions (TypeScript): :contentReference[oaicite:6]{index=6}

  ```ts
  import {
    pgTable,
    serial,
    text,
    timestamp,
    jsonb,
  } from 'drizzle-orm/pg-core';

  export const questionnaire_responses = pgTable('questionnaire_responses', {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    answers: jsonb('answers').notNull(),
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  });

  export const professional_signups = pgTable('professional_signups', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    firm: text('firm').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    specialty: text('specialty').notNull(),
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  });

  export const contact_submissions = pgTable('contact_submissions', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    relationship_status: text('relationship_status'),
    message: text('message').notNull(),
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  });
````

Use Drizzle Kit or direct SQL to push/migrate these definitions. ([Makerkit][1], [Supabase][2])

1.3. **Connection Details & Security**

* Copy the Supabase direct PostgreSQL connection string (used as `DATABASE_URL`) for server-side usage; this is the same pattern Supabase recommends for persistent servers. ([Supabase][3])
* Do **not** expose the service role key to the client. Only use it on the server for admin-level reads/writes. Use the anon key for any limited client-side operations. ([Supabase][2])

1.4. **Row-Level Security (RLS) & Policies**

* If exposing any Supabase client-side access, enable and configure RLS appropriately. Admin server routes can bypass RLS by using the service role key. (Policy configuration is via Supabase dashboard.) ([Supabase][2])

1.5. **Data Migration (if applicable)**

* If there's existing data in another PostgreSQL instance, dump it with `pg_dump` and restore/import into Supabase using `pg_restore` or `psql` against the Supabase connection. ([Supabase][3])

---

### 2. Code Integration: Drizzle ORM + Zod + Supabase

2.1. **Install Dependencies**

```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
npm install zod
```

([Makerkit][1], [Supabase][2])

2.2. **Initialize Drizzle Client**

Create a shared DB client (e.g., `lib/db.ts` or `server/db.ts`) that reads `DATABASE_URL` from environment variables and instantiates the Drizzle client.

Example:

```ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString, { ssl: { rejectUnauthorized: false } });
export const db = drizzle(sql);
```

([DEV Community][4], [Refine][5])

2.3. **Validation Schemas with Zod**

Define Zod schemas for each form submission (`questionnaire`, `professionalSignup`, `contactSubmission`) and use them in the request handlers to validate incoming payloads before persisting.

Example:

```ts
import { z } from 'zod';

export const questionnaireSchema = z.object({
  userId: z.string().nonempty(),
  answers: z.record(z.any()),
});

export const professionalSignupSchema = z.object({
  name: z.string().nonempty(),
  firm: z.string().nonempty(),
  email: z.string().email(),
  phone: z.string().nonempty(),
  specialty: z.string().nonempty(),
});

export const contactSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  relationship_status: z.string().optional(),
  message: z.string().nonempty(),
});
```

Validate before inserting and return structured errors. ([Supabase][2], [Medium][6])

2.4. **Implement Submission Endpoints**

* `POST /api/questionnaire/submit` → validate with Zod, insert into `questionnaire_responses`.
* `POST /api/professionals` → validate, insert into `professional_signups`.
* `POST /api/contact` → validate, insert into `contact_submissions`.

Use the `db` client from Drizzle to perform inserts. Sample:

```ts
await db
  .insert(questionnaire_responses)
  .values({
    userId: data.userId,
    answers: data.answers,
  })
  .execute();
```

([Refine][5])

2.5. **Admin Retrieval Endpoints**

* `GET /api/questionnaire/responses`
* `GET /api/professionals`
* `GET /api/contact`

Implement middleware to require an admin key (see section 3) before returning full dataset. Use Drizzle queries with optional filtering/pagination. ([Supabase][7])

---

### 3. Admin Authentication & Security

3.1. **Admin API Key**

* Define an `ADMIN_API_KEY` environment variable and store a strong random string in it.
* Protect all admin GET endpoints by checking for a matching header, e.g.:

```ts
function requireAdmin(req, res, next) {
  const provided = req.headers['x-admin-key'];
  if (provided !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
```

Apply this to the admin routes. ([Stack Overflow][8])

3.2. **Server-Side Secret Management**

* Do not expose sensitive keys (service role, admin key) to the client. Only expose what is necessary via `NEXT_PUBLIC_...` prefixes. ([Stack Overflow][9], [Medium][6])

---

### 4. Preparing for Heroku Deployment

4.1. **`package.json` Adjustments**

* Declare Node engine (match Heroku-supported version, e.g., Node 18.x):

```json
"engines": {
  "node": "18.x"
}
```

* Ensure scripts exist:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start"
}
```

If you have a custom Express server (merging Next.js and Express), ensure the entrypoint (e.g., `server/index.js` or compiled JS) uses `next` as shown below. ([Heroku Dev Center][10], [Stack Overflow][8])

4.2. **Custom Server Example (Express + Next.js)**

```js
// server/index.js
const express = require('express');
const next = require('next');
const routes = require('./routes'); // your existing route definitions

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(express.json());

  // Mount existing API routes
  server.use('/api', routes);

  // Next.js pages and fallback
  server.all('*', (req, res) => handle(req, res));

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
```

If using TypeScript for server code, compile it ahead of time or use a runtime like `ts-node` (not recommended for production). ([Stack Overflow][8])

4.3. **Procfile for Heroku**

Create a `Procfile` in repo root:

* If using pure Next.js start:

  ```procfile
  web: next start -p $PORT
  ```

* If using the custom Express server:

  ```procfile
  web: node server/index.js
  ```

Heroku will use this to launch the web dyno. ([Heroku Dev Center][11], [Heroku Dev Center][10])

---

### 5. Heroku App Creation & Configuration

5.1. **Login and Create App**

```bash
heroku login
heroku create your-app-name
```

([Heroku Dev Center][11])

5.2. **Set Config Vars**

Set all required environment variables (Supabase URLs/keys, admin key, any JWT secrets, etc.):

```bash
heroku config:set DATABASE_URL="postgresql://..." \
  SUPABASE_URL="https://xyz.supabase.co" \
  SUPABASE_ANON_KEY="public-anon-key" \
  SUPABASE_SERVICE_ROLE_KEY="service-role-key" \
  ADMIN_API_KEY="super-strong-admin-key" \
  NEXT_PUBLIC_SUPABASE_URL="https://xyz.supabase.co" \
  NEXT_PUBLIC_SUPABASE_ANON_KEY="public-anon-key"
```

Alternatively, set them via the Heroku dashboard in Settings → Config Vars. ([Heroku Dev Center][12], [Codecademy][13])

5.3. **Verify Environment Variables in App**

Ensure the app reads `process.env.DATABASE_URL` for Drizzle and that any public keys used in the client are prefixed with `NEXT_PUBLIC_` so Next.js exposes them. ([Stack Overflow][9])

---

### 6. Deploy to Heroku

6.1. **Git Remote Setup & Push**

```bash
git remote add heroku https://git.heroku.com/your-app-name.git
git push heroku main
```

Replace `main` if your primary branch is named differently. ([Heroku Dev Center][10])

6.2. **Build & Startup**

Heroku will auto-run `npm install`, `npm run build`, and then use the `Procfile` to start the app. Confirm Node version, build logs, and startup logs. ([Heroku Dev Center][11], [Heroku Dev Center][10])

6.3. **Logging & Observability**

Tail logs to troubleshoot:

```bash
heroku logs --tail
```

([Heroku Dev Center][11])

---

### 7. Local Development with Heroku-like Environment

* Use `heroku local` (requires a `.env` file and `Procfile`) to emulate Heroku locally. This will load config vars from `.env` and run the same process defined in `Procfile`. ([Trailhead][14])

---

### 8. Admin Dashboard Integration

8.1. **Fetch Protected Data**

From the admin React pages (`app/admin-dashboard/page.tsx`), request the `/api/*` endpoints, including the `x-admin-key` header with the secret. Example:

```ts
fetch('/api/questionnaire/responses', {
  headers: {
    'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY, // actually pass securely via server or session
  },
});
```

Implement server-proxied fetch if you don’t want to expose the admin key in client bundles. ([Supabase][7])

8.2. **Display & UX**

* Add pagination, filters (date range, userId, etc.), and export functionality (CSV/JSON).
* Sanitize and format `answers` JSON for readability.

---

### 9. Security & Best Practices

9.1. **Environment Variables**

* Use environment variables for all secrets, and never commit them. Validate and fallback safely if missing. ([Medium][6])

9.2. **Input Validation**

* All incoming payloads must pass Zod validation before database interaction. Return structured errors to clients. ([Supabase][2], [Medium][6])

9.3. **Least Privilege**

* Service role key only lives server-side; use anon key for any client-limited Supabase calls. ([Supabase][2])

9.4. **Admin Authentication**

* Protect dashboard endpoints with a secret header, and consider adding rate limiting or IP restrictions as future hardening. ([Stack Overflow][8])

---

### 10. Verification & Testing

10.1. **Smoke Test**

* Submit each form (questionnaire, professional signup, contact) and verify entries appear in Supabase via the admin dashboard.
* Use `GET` admin endpoints directly with admin key to confirm data retrieval. ([Supabase][7])

10.2. **Edge Cases**

* Missing required fields, malformed data, duplicate submissions. Ensure validation catches them. ([Medium][6])

10.3. **Deployment Health**

* Check Heroku logs, response times, and error rates.

---

### 11. Optional Enhancements

* **Real-Time Admin Updates**: Use Supabase Realtime subscriptions or polling to auto-refresh admin dashboard. ([YouTube][15])
* **Audit Logging**: Persist who viewed/edited what in a separate audit table.
* **Error Reporting**: Hook into a monitoring service (e.g., Sentry) for uncaught exceptions.
* **CI/CD**: Automate `git push heroku main` with protected builds.
* **Caching**: Use client-side TanStack Query and server-side query optimization. ([Refine][5])

---

## Checklist for Aider (Implementation Tasks)

1. Create Supabase project and capture connection strings and keys. ([Supabase][3])
2. Define Drizzle schema for the three core tables and apply migrations. ([Makerkit][1], [Supabase][2])
3. Implement database client using Drizzle connecting to Supabase. ([DEV Community][4], [Refine][5])
4. Define Zod validation schemas for all incoming payloads. ([Medium][6])
5. Implement and protect API endpoints (submit + admin retrieval). ([Stack Overflow][8], [Supabase][7])
6. Add admin authentication middleware using `ADMIN_API_KEY`. ([Stack Overflow][8])
7. Prepare Next.js/Express startup logic, ensure `package.json` scripts and Procfile are correct. ([Heroku Dev Center][10], [Heroku Dev Center][11])
8. Configure Heroku app: create app, set config vars, push code. ([Heroku Dev Center][12], [Codecademy][13])
9. Build admin dashboard UI to consume protected endpoints. ([Supabase][7])
10. Verify end-to-end (form submit → DB persistence → admin retrieval). ([Supabase][7])

---

## Troubleshooting Notes

* If environment variables are not appearing in the app, double-check Heroku config vars and the use of `NEXT_PUBLIC_` prefix for client-exposed variables. ([Stack Overflow][9])
* If builds fail on Heroku, inspect `heroku logs --tail` to identify missing scripts or incompatible Node versions. ([Heroku Dev Center][11], [Heroku Dev Center][10])
* If Supabase connection errors occur, verify the `DATABASE_URL` format and SSL expectations. ([Supabase][3])

---

```

### Key sources referenced:
- Heroku Node.js deployment and config vars. :contentReference[oaicite:51]{index=51} :contentReference[oaicite:52]{index=52} :contentReference[oaicite:53]{index=53} :contentReference[oaicite:54]{index=54}  
- Next.js + Express custom server deployment patterns. :contentReference[oaicite:55]{index=55}  
- Supabase connection and schema usage. :contentReference[oaicite:56]{index=56}  
- Drizzle ORM integration with Supabase and PostgreSQL. :contentReference[oaicite:57]{index=57}  
- Admin dashboard and secure data retrieval patterns. :contentReference[oaicite:58]{index=58}  
- Environment variable best practices and validation. :contentReference[oaicite:59]{index=59}  
- Optional real-time/admin enhancements. :contentReference[oaicite:60]{index=60}  

```

Would you like me to turn this into an actual `instructions.md` file in the workspace (and if so, do you want any variant for different deployment flavors like Docker or splitting frontend/backend)?

[1]: https://makerkit.dev/blog/tutorials/drizzle-supabase?utm_source=chatgpt.com "Using Drizzle ORM with Supabase in Next.js"
[2]: https://supabase.com/docs/guides/database/drizzle?utm_source=chatgpt.com "Drizzle | Supabase Docs"
[3]: https://supabase.com/docs/guides/database/connecting-to-postgres?utm_source=chatgpt.com "Connect to your database | Supabase Docs"
[4]: https://dev.to/musebe/streamlining-your-nextjs-projects-with-supabase-and-drizzle-orm-4gam?utm_source=chatgpt.com "Streamlining Your Next.js Projects with Supabase and ..."
[5]: https://refine.dev/blog/drizzle-react/?utm_source=chatgpt.com "Working with Drizzle ORM and PostgreSQL in Next.js"
[6]: https://medium.com/dopplerhq/using-environment-variables-in-node-js-for-app-configuration-and-secrets-6fa1dd6c0fd7?utm_source=chatgpt.com "Using Environment Variables in Node.js for App ..."
[7]: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs?utm_source=chatgpt.com "Build a User Management App with Next.js"
[8]: https://stackoverflow.com/questions/64795433/deploying-nextjs-front-end-and-expresss-back-end-to-heroku?utm_source=chatgpt.com "node.js - Deploying NextJS front end and Expresss back ..."
[9]: https://stackoverflow.com/questions/69255960/how-to-set-heroku-env-variables-to-appear-in-nextjs-app?utm_source=chatgpt.com "how to set heroku env variables to appear in NextJS app?"
[10]: https://devcenter.heroku.com/articles/deploying-nodejs?utm_source=chatgpt.com "Deploying Node.js Apps on Heroku"
[11]: https://devcenter.heroku.com/articles/getting-started-with-nodejs?utm_source=chatgpt.com "Getting Started on Heroku with Node.js"
[12]: https://devcenter.heroku.com/articles/config-vars?utm_source=chatgpt.com "Configuration and Config Vars"
[13]: https://www.codecademy.com/article/going-beyond-with-heroku?utm_source=chatgpt.com "Going Beyond with Heroku"
[14]: https://trailhead.salesforce.com/content/learn/modules/introduction-to-nodejs-on-heroku/develop-your-app-locally?utm_source=chatgpt.com "Local App Development and Heroku Environment Setup"
[15]: https://www.youtube.com/watch?v=vwKxYBnS044&utm_source=chatgpt.com "Last Part | Role Base Access Control with Next.js, Supabase ..."
