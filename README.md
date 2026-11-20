# Toolshed

Toolshed is a neighbourhood tool-lending library built with Next.js. Members list the tools they own (a drill, a ladder, a lawnmower) with a photo, anyone can search the catalog by name, category and availability, borrowers request a tool for some days, and owners approve, hand over and mark returns. Two people can never book the same tool for the same day: PostgreSQL refuses the second booking. Borrowers who are late get one reminder email.

This repository is the companion code for the Sypher course "Next.js Full-Stack: Build Toolshed". The `app/` folder is the finished app from the capstone lesson, and `steps/` holds the app as it stands at the end of each lesson that changes it.

The stack: Next.js 16 with the App Router, React Server Components and Server Actions, TypeScript, Tailwind CSS, PostgreSQL 18 with Drizzle ORM, Better Auth for accounts, zod for checking input, Nodemailer with Mailpit for email, Vitest and Playwright for tests, and Docker Compose to run everything.

## Set up your computer

You need Git, Node.js 24 (or newer) and Docker. The commands below are for a Bash shell: the terminal on macOS and Linux, or Git Bash or WSL on Windows.

| Tool | Windows | macOS | Ubuntu or Debian |
| --- | --- | --- | --- |
| Git | `winget install --id Git.Git -e` | `brew install git` | `sudo apt install -y git` |
| Node.js 24 | `winget install OpenJS.NodeJS.LTS` | `brew install node@24` | install fnm, then `fnm install 24` |
| Docker | `winget install -e --id Docker.DockerDesktop` | `brew install --cask docker` | `curl -fsSL https://get.docker.com \| sh` |

Check them in a new terminal:

```bash
git --version
node --version
docker version --format "{{.Server.Version}}"
```

`node --version` must print `v24` or higher. If `docker version` prints an error about the daemon, start Docker Desktop (or `sudo systemctl start docker` on Linux) and try again.

Get the code:

```bash
git clone <toolshed-library repository URL> toolshed-library
cd toolshed-library/app
```

## Run the app

Every command runs in the `app` folder.

1. Install the packages and create your settings file:

   ```bash
   npm ci
   cp .env.example .env
   ```

2. Put two long random strings into `.env`, one for `BETTER_AUTH_SECRET` and one for `CRON_SECRET`. This prints a suitable string each time you run it:

   ```bash
   node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
   ```

3. Start PostgreSQL and Mailpit (the pretend mail server):

   ```bash
   docker compose up -d --wait
   ```

4. Create the tables and add the fake members, tools and loans:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Start the development server and open http://localhost:18840:

   ```bash
   npm run dev
   ```

Log in as `asha@toolshed.test`, `ben@toolshed.test`, `chloe@toolshed.test` or `dev@toolshed.test`. Every seeded member uses the password `toolshed-demo-password`. Emails the app sends appear in Mailpit at http://localhost:18843.

To send the overdue reminders by hand, run this in a second terminal (the first line copies `CRON_SECRET` from your `.env`):

```bash
CRON_SECRET=$(grep '^CRON_SECRET=' .env | cut -d= -f2-)
curl -X POST -H "Authorization: Bearer $CRON_SECRET" http://localhost:18840/api/cron/overdue-reminders
```

### Run the whole app in Docker

This builds the production image and starts the app, a one-off migration and the hourly reminder scheduler next to PostgreSQL and Mailpit:

```bash
docker compose --profile app up -d --build
docker compose run --rm migrate npm run db:seed
```

Open http://localhost:18845. Stop everything with `docker compose --profile app down` (add `-v` to delete the database and the uploaded photos too).

## Run the tests

```bash
npm test          # unit tests and the double-booking database test (needs PostgreSQL running)
npm run test:e2e  # browser tests: builds the app, re-seeds the database, runs Chromium
```

The first time you run the browser tests, install the browser with `npx playwright install chromium`. The browser tests re-seed the database, so anything you added by hand is replaced.

A demo from the booking lesson:

```bash
npm run demo:race   # what happens when two people book the same days at the same moment
```

## Project layout

```text
toolshed-library/
  app/                       the finished app (the capstone)
    app/                     pages, layouts, Server Actions and route handlers (the App Router)
    components/              React components shared by pages
    lib/                     everything that is not a page
      data/                  every database read and write
      db/                    the Drizzle schema and the database connection
      validation/            zod rules for forms
      email/                 the mailer and the reminder email
    drizzle/                 SQL migrations, oldest first
    scripts/                 seed data, the seed script and the race demo
    tests/                   Vitest unit tests and the database test
    e2e/                     Playwright browser tests
    public/seed-photos/      placeholder photos for the seeded tools
    compose.yaml             PostgreSQL, Mailpit, and the full app under the "app" profile
    Dockerfile               the production image
  steps/                     the app at the end of each lesson, from 02 to 18
  .github/workflows/ci.yml   runs all the tests on every push
```

Each folder in `steps/` is a complete copy you can run the same way as `app/`: `npm ci`, then `npm run dev`. Steps 07 and later need a `.env` file, `docker compose up -d --wait` and `npm run db:migrate` first; steps 12 and later also need the two secrets.

## Troubleshooting

- **`connect ECONNREFUSED` on port 18842.** PostgreSQL is not running. Start it with `docker compose up -d --wait`.
- **`Error: listen EADDRINUSE` on port 18840.** Another dev server is still running. Stop it with Ctrl+C in its terminal, or change the port in `package.json`.
- **The home page still shows old tools after `npm run db:seed`.** The development server keeps cached data in memory. Stop it and start it again.
- **`The setting CRON_SECRET is missing`.** Add the setting to `.env` and restart the dev server.
- **Login works but the page says you are logged out after a restart.** `BETTER_AUTH_SECRET` changed. Log in again; old cookies are no longer valid.
- **Windows, Git Bash: a path like `/api/...` turns into `C:/Program Files/Git/api/...`.** Run `export MSYS_NO_PATHCONV=1` first.
- **Docker build fails while downloading fonts.** The build fetches the Geist font from Google Fonts, so it needs an internet connection.

## License

Copyright (C) 2026 SypherNext

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). You may
use, study and change it. If you share a modified version, or run one as a website or service
that other people use, you must make your full modified source code available under the same
license. See [LICENSE](LICENSE) for the full terms.
