import {
  AlertCircle,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  Home,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppNavigation } from "@/hooks";

interface ErrorComponenetProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  iconType?: keyof typeof errorIconMap;
}

const errorIconMap = {
  default: AlertCircle,
  destructive: XCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

const iconColorMap = {
  default: "text-blue-500",
  destructive: "text-red-500",
  success: "text-green-500",
  warning: "text-yellow-500",
  info: "text-blue-400",
} as const;

export const ErrorComponent = ({
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
  showHomeButton = true,
  showBackButton = true,
  iconType = "default",
}: ErrorComponenetProps) => {
  const { goToHome, goBack } = useAppNavigation();
  const Icon = errorIconMap[iconType];
  const iconColor = iconColorMap[iconType];

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Icon className={`h-16 w-16 ${iconColor}`} />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base">{message}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center gap-2">
          {showBackButton && (
            <Button variant="outline" onClick={goBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          )}
          {showHomeButton && (
            <Button onClick={goToHome}>
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
