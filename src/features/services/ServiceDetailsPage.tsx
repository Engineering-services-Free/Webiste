import { useParams } from "react-router-dom";

import { ApiResultView } from "../../components/ApiResultView";
import { useServiceBySlug } from "../../hooks/useServices";

export function ServiceDetailsPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const query = useServiceBySlug(slug);

  return (
    <ApiResultView
      title="Service"
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      isEmpty={query.data?.data === null}
    />
  );
}
