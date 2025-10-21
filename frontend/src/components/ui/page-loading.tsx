import { Spinner } from "./spinner";

export function PageLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Spinner className="h-10 w-10" />
    </div>
  );
}
