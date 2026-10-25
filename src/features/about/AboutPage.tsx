import { ApiResultView } from "../../components/ApiResultView";
import { useAbout } from "../../hooks/useAbout";
import { useFounders } from "../../hooks/useFounders";

export function AboutPage() {
  const aboutQuery = useAbout();
  const foundersQuery = useFounders();
  const data = {
    about: aboutQuery.data?.data ?? null,
    founders: foundersQuery.data?.data ?? [],
  };

  return (
    <ApiResultView
      title="About"
      data={data}
      isLoading={aboutQuery.isLoading || foundersQuery.isLoading}
      error={aboutQuery.error ?? foundersQuery.error}
      isEmpty={!aboutQuery.isLoading && !foundersQuery.isLoading && !data.about && data.founders.length === 0}
    />
  );
}
