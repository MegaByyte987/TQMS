import { PageHeader } from "./page-header";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm font-medium text-slate-700">
          This screen arrives in a later phase.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          The app shell, routing, and breadcrumbs are already wired up.
        </p>
      </div>
    </div>
  );
}