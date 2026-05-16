/*
 * Root page — always renders the public landing page at "/"
 *
 * Routing logic:
 *   - Unauthenticated visitors: see the landing page (middleware lets them through)
 *   - Authenticated visitors who visit "/": also see the landing page
 *     (they can navigate to /posts or /dashboard from the nav)
 *   - After login/register: useAuth redirects to /posts (not here)
 *   - Protected routes (/posts, /dashboard, etc.): middleware
 *     redirects unauthenticated users to /auth?from=<path>
 */
import LandingPage from "./landing/page";

export default function RootPage() {
  return <LandingPage />;
}
