import { Spinner } from "./spinner";

export function ContentLoading() {
  return (
    <div className="flex w-full items-center justify-center p-8">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
