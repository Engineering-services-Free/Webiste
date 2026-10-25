import { ApiResultView } from "../../components/ApiResultView";
import { useProjects } from "../../hooks/useProjects";

export function ProjectsPage() {
  const query = useProjects({ status: "published" });

  return (
    <ApiResultView
      title="Projects"
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      isEmpty={query.data?.data.length === 0}
      onRetry={() => {
        void query.refetch();
      }}
    />
  );
}
