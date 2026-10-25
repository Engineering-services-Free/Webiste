import { ApiResultView } from "../../components/ApiResultView";
import { UniversalError } from "../../components/common/UniversalError";
import { getUniversalErrorType } from "../../components/common/universalError.utils";
import { useLandingPage } from "../../hooks/useLandingPage";
import { useWebsiteDashboard } from "../../hooks/useWebsiteDashboard";

export function LandingPage() {
  const landingPageQuery = useLandingPage();
  const dashboardQuery = useWebsiteDashboard();

  if (landingPageQuery.error && landingPageQuery.data === undefined) {
    return (
      <UniversalError
        type={getUniversalErrorType(landingPageQuery.error)}
        onRetry={() => {
          void landingPageQuery.refetch();
        }}
      />
    );
  }

  if (dashboardQuery.error && dashboardQuery.data === undefined) {
    return (
      <UniversalError
        type={getUniversalErrorType(dashboardQuery.error)}
        onRetry={() => {
          void dashboardQuery.refetch();
        }}
      />
    );
  }

  return (
    <>
      <ApiResultView
        title="Home"
        data={landingPageQuery.data?.data}
        isLoading={landingPageQuery.isLoading}
        error={landingPageQuery.error}
        isEmpty={landingPageQuery.data?.data === null}
        onRetry={() => {
          void landingPageQuery.refetch();
        }}
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
        onRetry={() => {
          void dashboardQuery.refetch();
        }}
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
