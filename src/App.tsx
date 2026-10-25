import { BrowserRouter, Link } from "react-router-dom";

import { WebsiteRoutes } from "./routes/WebsiteRoutes";

function SiteLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4"
        >
          <Link className="mr-auto font-semibold" to="/">
            Muthammal Engineering
          </Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/clients">Clients</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/documents">Documents</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </header>

      <WebsiteRoutes />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteLayout />
    </BrowserRouter>
  );
}
