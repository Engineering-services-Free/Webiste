import { useParams } from "react-router-dom";

import { ApiResultView } from "../../components/ApiResultView";
import { useBlogBySlug } from "../../hooks/useBlogs";

export function BlogDetailsPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const query = useBlogBySlug(slug);

  return (
    <ApiResultView
      title="Blog"
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      isNotFound={query.data?.data === null}
      onRetry={() => {
        void query.refetch();
      }}
    />
  );
}
