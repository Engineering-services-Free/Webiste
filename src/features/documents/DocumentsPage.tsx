import { ApiResultView } from "../../components/ApiResultView";
import { useDocuments } from "../../hooks/useDocuments";

export function DocumentsPage() {
  const query = useDocuments();

  return (
    <ApiResultView
      title="Documents"
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
