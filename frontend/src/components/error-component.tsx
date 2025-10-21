type ErrorComponentProps = {
  title?: string;
  message?: string;
};

export function ErrorComponent({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again later.",
}: ErrorComponentProps) {
  return (
    <section className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 px-6 text-center">
      <h2 className="text-2xl font-semibold text-red-600">{title}</h2>
      <p className="max-w-lg text-base text-slate-600">{message}</p>
      <button
        type="button"
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        onClick={() => window.location.reload()}
      >
        Reload page
      </button>
    </section>
  );
}
