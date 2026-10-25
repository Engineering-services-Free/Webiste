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
      error={
        aboutQuery.data === undefined
          ? aboutQuery.error
          : foundersQuery.data === undefined
            ? foundersQuery.error
            : null
      }
      hasData={
        aboutQuery.data !== undefined && foundersQuery.data !== undefined
      }
      onRetry={() => {
        if (aboutQuery.data === undefined && aboutQuery.error) {
          void aboutQuery.refetch();
          return;
        }

        void foundersQuery.refetch();
      }}
      isEmpty={!aboutQuery.isLoading && !foundersQuery.isLoading && !data.about && data.founders.length === 0}
    />
  );
}
