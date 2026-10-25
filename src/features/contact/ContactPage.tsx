import { ApiResultView } from "../../components/ApiResultView";
import { useContact } from "../../hooks/useContact";

export function ContactPage() {
  const query = useContact();

  return (
    <ApiResultView
      title="Contact"
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      isEmpty={query.data?.data === null}
    />
  );
}
