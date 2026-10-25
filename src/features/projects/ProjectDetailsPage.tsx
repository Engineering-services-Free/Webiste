import { useParams } from "react-router-dom";

import { ApiResultView } from "../../components/ApiResultView";
import { useProjectBySlug } from "../../hooks/useProjects";

export function ProjectDetailsPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const query = useProjectBySlug(slug);

  return (
    <ApiResultView
      title="Project"
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      isEmpty={query.data?.data === null}
    />
  );
}
