import { ApiResultView } from "../../components/ApiResultView";
import { useServices } from "../../hooks/useServices";

export function ServicesPage() {
  const query = useServices({ status: "published" });

  return (
    <ApiResultView
      title="Services"
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
