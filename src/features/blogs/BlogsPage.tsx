import { ApiResultView } from "../../components/ApiResultView";
import { useBlogs } from "../../hooks/useBlogs";

export function BlogsPage() {
  const query = useBlogs({ status: "published" });

  return (
    <ApiResultView
      title="Blogs"
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      isEmpty={query.data?.data.length === 0}
    />
  );
}
