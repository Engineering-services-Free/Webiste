import { Link, Navigate, Route, Routes } from "react-router-dom";

import { AboutPage } from "../features/about/AboutPage";
import { BlogsPage } from "../features/blogs/BlogsPage";
import { BlogDetailsPage } from "../features/blogs/BlogDetailsPage";
import { ClientsPage } from "../features/clients/ClientsPage";
import { ContactPage } from "../features/contact/ContactPage";
import { DocumentDetailsPage } from "../features/documents/DocumentDetailsPage";
import { DocumentsPage } from "../features/documents/DocumentsPage";
import { LandingPage } from "../features/landingpage/LandingPage";
import { ProjectDetailsPage } from "../features/projects/ProjectDetailsPage";
import { ProjectsPage } from "../features/projects/ProjectsPage";
import { ServiceDetailsPage } from "../features/services/ServiceDetailsPage";
import { ServicesPage } from "../features/services/ServicesPage";

export function WebsiteRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/services/:slug" element={<ServiceDetailsPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:slug" element={<ProjectDetailsPage />} />
      <Route path="/clients" element={<ClientsPage />} />
      <Route path="/blogs" element={<BlogsPage />} />
      <Route path="/blogs/:slug" element={<BlogDetailsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/documents/:id" element={<DocumentDetailsPage />} />
      <Route
        path="/404"
        element={
          <main className="mx-auto max-w-6xl px-6 py-16">
            <h1 className="text-3xl font-semibold">Page not found</h1>
            <p className="mt-3 text-muted-foreground">
              The page you requested does not exist.
            </p>
            <Link className="mt-6 inline-block underline" to="/">
              Return home
            </Link>
          </main>
        }
      />
      <Route path="*" element={<Navigate replace to="/404" />} />
    </Routes>
  );
}
