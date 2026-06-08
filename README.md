# ShopEase

ShopEase is a front-end-only e-commerce portfolio web app that demonstrates a complete modern shopping experience — browsing, searching, cart, wishlist, checkout, and auth — without a real backend. It runs entirely in the browser against a local dummy product dataset, making it ideal as a portfolio piece or a UI/UX reference implementation.

Built with Next.js 14 (App Router), TypeScript in strict mode, and Tailwind CSS, with state managed by Zustand and forms validated by react-hook-form + zod.

> Note: ShopEase has no real backend or payment processing. Authentication and checkout are simulated for demonstration purposes only.

## Key Features

- **Responsive design** — mobile-first layout that adapts from 1 column on phones to 2 on tablets and 3+ on desktops.
- **Product search, filter, and sort** — case-insensitive name search, category and price-range filters, and sorting by price (asc/desc), rating, and newest.
- **Product detail pages** — image, price, rating, description, stock/shipping info, quantity selector, and related products.
- **Shopping cart** — add, update quantity, remove, line subtotals, and a live order summary (subtotal, shipping, discount, total).
- **Wishlist** — toggle favorites and move items to the cart.
- **Dummy checkout with form validation** — collects shipping and payment details, validates with zod, and confirms a simulated order.
- **Dummy authentication** — login and register flows with field-level validation (no real sessions).
- **Toast notifications** — feedback for cart and wishlist actions with auto-dismiss.
- **Dark mode toggle** — light/dark theme that persists across navigation.
- **Skeleton loading states** — placeholder cards while content is prepared.
- **Empty states** — friendly messaging for no search results, empty cart, and empty wishlist.
- **Rupiah currency formatting** — consistent `Rp 250.000`-style formatting throughout.
- **Reusable components** — a small UI primitive library (Button, Input, Modal, Rating, Toast, etc.) plus composable feature components.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) (strict mode) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| State management | [Zustand](https://github.com/pmndrs/zustand) |
| Forms & validation | [react-hook-form](https://react-hook-form.com/) + [zod](https://zod.dev/) |
| Icons | [lucide-react](https://lucide.dev/) |
| Notifications | [react-hot-toast](https://react-hot-toast.com/) |
| Testing | [Vitest](https://vitest.dev/), [fast-check](https://fast-check.dev/) (property-based), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) |
| Data | Local dummy data (`data/products.json`, 24 products) |

## Screenshots

> Replace the placeholders below with real screenshots of the running app.

| Home | Products |
| --- | --- |
| ![ShopEase home page](<img width="1848" height="988" alt="image" src="https://github.com/user-attachments/assets/92583111-fbad-45d7-8f92-7619d2c1514b" />
) | ![Product listing page](<img width="1919" height="944" alt="image" src="https://github.com/user-attachments/assets/50a6706c-01cf-4fd4-88aa-87ba20df06b4" />
) |

| Product Detail | Cart |
| --- | --- |
| <img width="1919" height="988" alt="image" src="https://github.com/user-attachments/assets/2b21c72f-8c90-4b2b-ae9f-c9e71d45a89c" />
<img width="1919" height="984" alt="image" src="https://github.com/user-attachments/assets/1cb0203b-e6dc-4bf0-b7cc-ece7279af4f8" />
) |

| Checkout |
| --- |
| ![Checkout page](<img width="1919" height="981" alt="image" src="https://github.com/user-attachments/assets/b4707589-c0cf-4eab-8491-ada3e2e6cdd8" />
) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.17 or later
- npm (bundled with Node.js)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/shopease.git
cd shopease
npm install
```

### Running Locally

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Scripts

```bash
npm run build      # Create an optimized production build
npm start          # Serve the production build locally
npm test           # Run the test suite (Vitest, single run)
npm run typecheck  # Type-check the project with tsc --noEmit
npm run lint       # Run Next.js linting
```

## Deployment (Vercel)

ShopEase is a standard Next.js app and deploys to [Vercel](https://vercel.com/) with zero configuration.

**Option A — Git integration (recommended):**

1. Push your code to a GitHub (or GitLab/Bitbucket) repository.
2. Sign in to Vercel and choose **Add New → Project**.
3. Import your repository. Vercel auto-detects the framework as **Next.js** — no build settings changes are needed.
4. Click **Deploy**. Every subsequent push to the default branch triggers a new deployment.

**Option B — Vercel CLI:**

```bash
npm install -g vercel
vercel          # Deploy a preview
vercel --prod   # Deploy to production
```

## Project Structure

```text
shopease/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout (providers, navbar, footer, toasts)
│   ├── page.tsx              # Home page
│   ├── products/             # Product listing page
│   ├── product/[id]/         # Product detail page (dynamic route)
│   ├── cart/                 # Cart page
│   ├── wishlist/             # Wishlist page
│   ├── checkout/             # Checkout page
│   ├── login/                # Login page
│   ├── register/             # Register page
│   ├── providers.tsx         # Client-side store/theme providers
│   └── globals.css           # Tailwind base + theme tokens
├── components/               # Reusable React components
│   ├── ui/                   # UI primitives (Button, Input, Modal, Rating, Toast, SkeletonCard, EmptyState)
│   ├── layout/               # Navbar, Footer, MobileMenu, ThemeToggle
│   ├── home/                 # Hero, FeaturedCategories, PromoBanner, BestSellerSection, HomeSearch
│   ├── product/              # ProductCard, ProductGrid, ProductListing, filters, sort, search, related
│   ├── cart/                 # CartItem, OrderSummary
│   ├── wishlist/             # WishlistItem
│   ├── checkout/             # CheckoutForm
│   └── auth/                 # LoginForm, RegisterForm
├── lib/                      # Pure domain logic (framework-agnostic)
│   ├── catalog.ts            # Search, filter, sort, related, best-seller selectors
│   ├── cart.ts               # Cart math and reducers
│   ├── wishlist.ts           # Wishlist toggle logic
│   ├── validation.ts         # Email/field validation + zod schemas
│   ├── format.ts             # Rupiah currency formatting
│   └── constants.ts          # Categories, shipping, toast duration, breakpoints
├── store/                    # Zustand state stores
│   ├── useCartStore.ts
│   ├── useWishlistStore.ts
│   ├── useThemeStore.ts
│   ├── useToastStore.ts
│   └── storage.ts
├── data/                     # Local dummy data
│   └── products.json         # 24 products
├── types/                    # Shared TypeScript types
│   └── index.ts
└── __tests__/                # Unit and property-based tests
```

The architecture is deliberately layered: pure logic lives in `lib/`, thin Zustand stores in `store/` wrap that logic for React, `components/` render state, and `app/` wires everything together through the App Router. This keeps the domain logic testable in isolation with `fast-check` property-based tests.

## Future Enhancements

Possible next steps to evolve ShopEase beyond a front-end prototype:

- **Real backend / API** — replace `data/products.json` with a database-backed REST or GraphQL API.
- **Real authentication** — proper sessions, JWT/cookie auth, and protected routes.
- **Payment gateway integration** — connect a provider such as Stripe or Midtrans for real checkout.
- **Product reviews and ratings** — let users submit and read reviews.
- **Pagination / infinite scroll** — handle larger catalogs efficiently.
- **Order history** — persist past orders per user account.
- **Internationalization (i18n)** — multi-language and multi-currency support.
- **Expanded testing** — broader unit coverage plus end-to-end tests (e.g. Playwright or Cypress).
- **Accessibility audit** — formal WCAG review with assistive-technology testing.

## Author

**Naemu Enggar** 

- GitHub: [@your-username](https://github.com/naemuenggar)

## License

This project is provided for portfolio and educational purposes.
