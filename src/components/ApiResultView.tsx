import { HtmlContent } from "./common/HtmlContent";
import { UniversalError } from "./common/UniversalError";
import { getUniversalErrorType } from "./common/universalError.utils";

interface ApiResultViewProps {
  title: string;
  data: unknown;
  isLoading: boolean;
  error: unknown;
  isEmpty?: boolean;
  isNotFound?: boolean;
  hasData?: boolean;
  onRetry?: () => void;
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

export function ApiResultView({
  title,
  data,
  isLoading,
  error,
  isEmpty = false,
  isNotFound = false,
  hasData = data !== undefined,
  onRetry,
}: ApiResultViewProps) {
  const hasBlockingError =
    error !== null && error !== undefined && !hasData;

  if (!isLoading && isNotFound) {
    return <UniversalError type="not-found" onRetry={onRetry} />;
  }

  if (!isLoading && hasBlockingError) {
    return (
      <UniversalError
        type={getUniversalErrorType(error)}
        onRetry={onRetry}
      />
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>

      {isLoading && (
        <p role="status" className="text-muted-foreground">
          Loading {title.toLowerCase()}...
        </p>
      )}

      {!isLoading && !hasBlockingError && isEmpty && (
        <p className="rounded-lg border border-dashed p-6 text-muted-foreground">
          No public content is available yet.
        </p>
      )}

      {!isLoading && !hasBlockingError && !isEmpty && (
        <div className="space-y-6">
          <DataContent value={data} />
        </div>
      )}
    </main>
  );
}
