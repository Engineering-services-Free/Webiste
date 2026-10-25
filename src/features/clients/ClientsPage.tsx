import { ApiResultView } from "../../components/ApiResultView";
import { useClients } from "../../hooks/useClients";

export function ClientsPage() {
  const query = useClients();

  return (
    <ApiResultView
      title="Clients"
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      isEmpty={query.data?.data.length === 0}
    />
  );
}
