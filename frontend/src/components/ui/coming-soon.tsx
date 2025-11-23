import { UNDER_DEV } from "@/assets";
import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";

interface ComingSoonProps {
  className?: string;
}

export const ComingSoon = ({ className }: ComingSoonProps) => {
  const { history } = useRouter();

  return (
    <div
      className={`flex h-full flex-col items-center justify-center text-center font-semibold ${className || ""}`}
    >
      {UNDER_DEV && (
        <img className="h-80" src={UNDER_DEV} alt="Under Development" />
      )}
      <div className="text-foreground text-2xl">
        This feature is coming soon!
      </div>
      <Button variant="outline" className="mt-4" onClick={() => history.back()}>
        Go Back
      </Button>
    </div>
  );
};
