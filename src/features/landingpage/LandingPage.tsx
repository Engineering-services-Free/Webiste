import { ApiResultView } from "../../components/ApiResultView";
import { useLandingPage } from "../../hooks/useLandingPage";
import { useWebsiteDashboard } from "../../hooks/useWebsiteDashboard";

export function LandingPage() {
  const landingPageQuery = useLandingPage();
  const dashboardQuery = useWebsiteDashboard();

  return (
    <>
      <ApiResultView
        title="Home"
        data={landingPageQuery.data?.data}
        isLoading={landingPageQuery.isLoading}
        error={landingPageQuery.error}
        isEmpty={landingPageQuery.data?.data === null}
      />
      <ApiResultView
        title="Latest website content"
        data={
          dashboardQuery.data
            ? {
                blogs: dashboardQuery.data.data.blogs,
                projects: dashboardQuery.data.data.projects,
                services: dashboardQuery.data.data.services,
                clients: dashboardQuery.data.data.clients,
              }
            : undefined
        }
        isLoading={dashboardQuery.isLoading}
        error={dashboardQuery.error}
        isEmpty={
          dashboardQuery.data !== undefined &&
          dashboardQuery.data.data.blogs.length === 0 &&
          dashboardQuery.data.data.projects.length === 0 &&
          dashboardQuery.data.data.services.length === 0 &&
          dashboardQuery.data.data.clients.length === 0
        }
      />
    </>
  );
}
