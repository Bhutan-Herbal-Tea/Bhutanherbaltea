# Bhutan Herbal Tea

The showcase website for **Bhutan Herbal Tea**, organic herbal teas grown in Bumthang, Bhutan. *Wellness in Every Sip.*

Live preview (the `development` branch): https://bhutanherbaltea.netlify.app/

It is a brand-story site: no shop, cart or forms. Visitors reach the business through prefilled WhatsApp messages, email and social links.

## Run it

Requires Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (every page is static) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Node's built-in test runner) |
| `npm run assets:photos` | Download the Unsplash stand-in photos (add file names to fetch only those) |
| `npm run assets:logo` | Rebuild `public/logo.png` from the client's `public/images/Herbal tea.jpg` |
| `npm run assets:dzongkha` | Rebuild the Dzongkha font subset after changing `DRUK_JA` |

## Changing content

All words, photos, prices and contact details live in `src/data/`. You don't need to touch components to update them.

| To change | Edit |
| --- | --- |
| Contact details, WhatsApp number, social links, stockists | `src/data/site.ts` (`contact`) |
| Farm location, altitude, the numbers band | `src/data/site.ts` |
| A tea's name, description, pack, price, photo | `src/data/teas.ts` |
| Specialty teas and gift boxes | `src/data/teas.ts` (`specialtyTeas`) |
| Text on a page | `src/data/pages/<page>.ts` |

To replace a stand-in photo, save the client's photo over the file of the same name in `public/images/` (keep it under about 300 KB), update its `alt` text in `src/data/`, and remove its line from `public/images/CREDITS.md`.

Run `npm test` after editing: the tests catch missing photos, empty alt text, broken nav links and similar mistakes.

## How the code is organised

- `src/app/`: one folder per page. Components used by only one page sit beside it in `_components/`.
- `src/components/`: components shared by several pages (`layout/` for the page frame, `herbarium/` for the design's specimen plates and page heroes, `ui/` for buttons, links and other building blocks).
- `src/data/`: all content (see above). `src/lib/`: small tested helpers. `tests/`: unit tests.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion and shadcn/ui. Light and dark themes follow the visitor's system setting, with a toggle in the header.

## Deployment

Netlify builds the site from GitHub automatically:

- `development` deploys to the preview above. Work is merged here first.
- `main` is the production branch. It is only updated once the client approves a version.

The full brief and design decisions are in `CLAUDE.md` and `docs/superpowers/`.
