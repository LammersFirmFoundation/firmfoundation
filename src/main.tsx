import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./App";
import "./index.css";

// Static Site Generation entry. vite-react-ssg renders each route to static
// HTML at build time (so Google, AI crawlers, and social scrapers see full
// content) and hydrates the same app on the client.
export const createRoot = ViteReactSSG({ routes });
