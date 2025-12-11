import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  GetAllPatients,
  BanPatient,
  EditPatientPassword,
  type GetAllPatientsDto,
} from "@/features/admin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

export function AdminPatientsTable() {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = GetAllPatients();

  const banMutation = BanPatient();
  const editPasswordMutation = EditPatientPassword();

  const patients = data?.pages.flatMap((page) => page.items) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] =
    useState<GetAllPatientsDto | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const handleBanChange = (userId: string, value: string) => {
    const isBanned = value === "banned";
    banMutation.mutate({ userId, isBan: isBanned });
  };

  const handlePasswordEdit = (patient: GetAllPatientsDto) => {
    setSelectedPatient(patient);
    setNewPassword("");
    setPasswordDialogOpen(true);
  };

  const handlePasswordSubmit = () => {
    if (selectedPatient && newPassword) {
      editPasswordMutation.mutate({
        userId: selectedPatient.userId,
        newPassword,
      });
      setPasswordDialogOpen(false);
      setNewPassword("");
    }
  };

  const handleNavigateToProfile = (patientId: string) => {
    navigate({ to: `/admin/patients/${patientId}` });
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-slate-500">
        Loading patients...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-red-500">
        Error loading patients
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-2 pl-4 sm:px-5">
          <div className="mb-2">
            <h2 className="text-brand-dark text-sm font-semibold tracking-tight">
              All Patients
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Manage patient accounts and access.
            </p>
          </div>
        </div>

        <div className="min-h-[400px] overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-white">
              <tr className="border-b border-slate-200">
                <th className="pt-2.5 pr-4 pb-2.5 pl-4 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Patient
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Email
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Age
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Phone
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Paid
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Status
                </th>
                <th className="px-4 py-2.5 text-right text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="h-[350px] px-4 text-center align-middle sm:px-5"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <User className="h-6 w-6 text-slate-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-700">
                          No patients
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          No patients found in the system.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/70">
                    <td className="pt-3.5 pr-4 pb-3.5 pl-4 whitespace-nowrap sm:px-5">
                      <div
                        className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-80"
                        onClick={() => handleNavigateToProfile(patient.id)}
                      >
                        {patient.profilePictureUrl ? (
                          <img
                            src={patient.profilePictureUrl}
                            alt={`${patient.firstName} ${patient.lastName}`}
                            className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
                            {patient.firstName?.charAt(0) || "?"}
                          </div>
                        )}
                        <div className="text-xs font-medium tracking-tight text-slate-900">
                          {patient.firstName} {patient.lastName}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-700 sm:px-5">
                      {patient.email}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-700 sm:px-5">
                      {patient.age}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-700 sm:px-5">
                      {patient.phoneNumber || "N/A"}
                    </td>
                    <td className="px-4 py-3.5 text-xs whitespace-nowrap text-slate-800 sm:px-5">
                      ${patient.totalPaid.toFixed(2)}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                      <Select
                        value={patient.isBanned ? "banned" : "active"}
                        onValueChange={(value) =>
                          handleBanChange(patient.userId, value)
                        }
                        disabled={banMutation.isPending}
                      >
                        <SelectTrigger className="h-7 w-[100px] text-[11px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active" className="text-green-700">
                            Active
                          </SelectItem>
                          <SelectItem value="banned" className="text-red-700">
                            Banned
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap sm:px-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handlePasswordEdit(patient)}
                          className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 transition-colors"
                        >
                          Edit Password
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-3 pl-4 sm:flex-row sm:px-5">
          <div className="text-[11px] text-slate-500">
            Showing
            <span className="font-medium text-slate-700">
              {" "}
              {patients.length}{" "}
            </span>
            of
            <span className="font-medium text-slate-700"> {totalCount} </span>
            patients.
          </div>
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[11px] text-slate-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
                ? "Load More"
                : "No more patients"}
          </button>
        </div>
      </div>

      {/* Edit Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Password</DialogTitle>
            <DialogDescription>
              Set a new password for {selectedPatient?.firstName}{" "}
              {selectedPatient?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPasswordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordSubmit}
              disabled={!newPassword || editPasswordMutation.isPending}
            >
              {editPasswordMutation.isPending
                ? "Updating..."
                : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
