import { Link } from "@tanstack/react-router";
import { Check, Calendar, Search } from "lucide-react";
import { ROUTE_PATHS } from "@/config";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Button,
} from "@/components/ui";

export function BookingSuccessPage() {
  return (
    <div className="flex min-h-full w-full items-center justify-center bg-gray-50/50 p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-6 pt-10 pb-2">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 ring-8 ring-green-50">
            <Check className="h-12 w-12 text-green-600" strokeWidth={3} />
          </div>
          <div className="space-y-2 text-center">
            <h1 className="text-brand-dark text-2xl font-bold tracking-tight">
              Booking Confirmed!
            </h1>
            <p className="text-muted-foreground px-4 text-sm">
              Your appointment has been successfully scheduled. We've sent a
              confirmation to your email.
            </p>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          {/* Optional: If we had booking details, we could show a summary card here */}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-4 pb-8">
          <Button
            asChild
            className="bg-brand-dark hover:bg-brand-secondary w-full"
            size="lg"
          >
            <Link to={ROUTE_PATHS.PATIENT.APPOINTMENTS}>
              <Calendar className="mr-2 h-4 w-4" />
              View My Appointments
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full" size="lg">
            <Link to={ROUTE_PATHS.PATIENT.FINDPROFESSIONAL}>
              <Search className="mr-2 h-4 w-4" />
              Book Another Appointment
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
