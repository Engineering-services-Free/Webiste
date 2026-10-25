import { useParams } from "react-router-dom";

import { ApiResultView } from "../../components/ApiResultView";
import { useDocument } from "../../hooks/useDocuments";

export function DocumentDetailsPage() {
  const { id = "" } = useParams<{ id: string }>();
  const query = useDocument(id);

  return (
    <ApiResultView
      title="Document"
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
