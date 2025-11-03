# Project Overview

This is a personal portfolio website for Gourishankar Menavath, a Frontend Developer. It is built with [Next.js](https://nextjs.org/) (using the App Router), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/).

The site showcases projects and work experience, with content authored in [MDX](https://mdxjs.com/). This allows for rich content by embedding React components directly within Markdown. The project also features internationalization (i18n) capabilities, handled by `next-intl`.

## Building and Running

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later)
- [npm](https://www.npmjs.com/) (or a compatible package manager like [Yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/))

### Installation

1.  Clone the repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Development

To run the development server (with Next.js Turbopack for faster performance):

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Production

To build and run the application in production mode:

1.  **Build the project:**
    ```bash
    npm run build
    ```
    This will create an optimized production build in the `.next` directory.

2.  **Start the production server:**
    ```bash
    npm run start
    ```
    The application will run on the port configured for production (defaults to 3000).

### Linting

To check the code for linting errors, run:

```bash
npm run lint
```

## Development Conventions

### Project Structure

-   `app/`: Contains the core application logic, following the Next.js App Router structure.
-   `components/`: Home to reusable React components used throughout the site.
-   `content/`: Stores the MDX files for projects and work experience.
-   `lib/`: Includes utility functions and data-fetching logic (e.g., for reading and parsing MDX files).
-   `locales/`: Contains JSON files for internationalization.
-   `public/`: For static assets like images and fonts.
-   `styles/`: Global and component-specific styles.

### Content Management

Content is managed through MDX files in the `content/` directory. Each file contains frontmatter (parsed with `gray-matter`) for metadata like title, summary, and date, followed by the main content in Markdown/JSX.

### Styling

The project uses Tailwind CSS for styling. Utility classes are managed with `clsx` and `tailwind-merge` to handle conditional and conflicting classes gracefully.

### Internationalization

The `next-intl` library is used for i18n. Text content is stored in JSON files within the `locales/` directory, and the `useTranslations` hook provides translations in the components.
