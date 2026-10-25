import axios from "axios";

import { HtmlContent } from "./common/HtmlContent";

interface ApiResultViewProps {
  title: string;
  data: unknown;
  isLoading: boolean;
  error: unknown;
  isEmpty?: boolean;
}

function DataContent({ value }: { value: unknown }) {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">No content.</span>;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    if (typeof value === "string") {
      return <HtmlContent html={value} />;
    }

    return <span>{String(value)}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-muted-foreground">No records.</span>;
    }

    return (
      <ul className="mt-2 space-y-2 pl-5">
        {value.map((item, index) => (
          <li key={index} className="list-disc">
            <DataContent value={item} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <dl className="mt-2 space-y-3">
      {Object.entries(value).map(([key, entry]) => (
        <div key={key}>
          <dt className="text-sm font-medium capitalize">
            {key.replace(/([A-Z])/g, " $1")}
          </dt>
          <dd className="break-words text-sm text-muted-foreground">
            <DataContent value={entry} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function getErrorStatus(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}

export function ApiResultView({
  title,
  data,
  isLoading,
  error,
  isEmpty = false,
}: ApiResultViewProps) {
  const errorStatus = getErrorStatus(error);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>

      {isLoading && (
        <p role="status" className="text-muted-foreground">
          Loading {title.toLowerCase()}...
        </p>
      )}

      {!isLoading && error !== null && error !== undefined && (
        <section
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 p-5 text-destructive"
        >
          <h2 className="font-semibold">
            {errorStatus === 404 ? "Record not found" : "Unable to load data"}
          </h2>
          <p className="mt-1 text-sm">
            {errorStatus === 404
              ? "The requested content does not exist or is not publicly available."
              : "Please try again later."}
          </p>
        </section>
      )}

      {!isLoading && !error && isEmpty && (
        <p className="rounded-lg border border-dashed p-6 text-muted-foreground">
          No public content is available yet.
        </p>
      )}

      {!isLoading && !error && !isEmpty && (
        <div className="space-y-6">
          <DataContent value={data} />
        </div>
      )}
    </main>
  );
}
