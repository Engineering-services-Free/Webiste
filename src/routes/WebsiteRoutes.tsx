import { Route, Routes, type Location } from "react-router-dom";

import { UniversalError } from "../components/common/UniversalError";
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

export function WebsiteRoutes({ location }: { location?: Location }) {
  return (
    <Routes location={location}>
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
      <Route path="/404" element={<UniversalError type="not-found" />} />
      <Route path="*" element={<UniversalError type="not-found" />} />
    </Routes>
  );
}
