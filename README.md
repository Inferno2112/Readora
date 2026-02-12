# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Appwrite setup (images + localhost)

**1. Images on localhost / other devices / incognito**

- In **Appwrite Console** → **Storage** → your bucket → **Settings** (or **Permissions**).
- Under **Read**, add **Any** so the file view URL works without login.

**2. Localhost / CORS**

- In **Appwrite Console** → your **Project** → **Overview** (or **Settings**) → **Platforms**.
- Add a **Web** platform with hostname: `http://localhost:5173` (or the port you use, e.g. `http://localhost:3000`).
- Use the exact URL (protocol + host + port); add each origin you use (e.g. production URL too).

Without (1), image URLs will 403 for guests/incognito. Without (2), requests from localhost can be blocked by CORS.

**3. Comments and bookmarks (optional)**

To enable comments and bookmarks, create two collections in the same database as your posts:

- **Comments**: Create a collection (e.g. `comments`) with attributes: `postId` (string), `userId` (string), `userName` (string), `userAvatarId` (string, optional), `content` (string). Add the collection ID to `.env` as `VITE_APPWRITE_COMMENTS_COLLECTION_ID`.
- **Bookmarks**: Create a collection (e.g. `bookmarks`) with attributes: `postId` (string), `userId` (string). Add the collection ID to `.env` as `VITE_APPWRITE_BOOKMARKS_COLLECTION_ID`.

Set permissions so authenticated users can create/read/delete as needed. If these env vars are missing, comments and bookmarks are skipped without breaking the app.
