import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  GetAllProfessionals,
  useUpdateProfessionalAccountStatus,
  BanProfessional,
  EditProfessionalPassword,
  type GetAllProfessionalsDto,
  VerificationStatus,
} from "@/features/admin";
import { SPECIALIZATIONS } from "@/features/auth/lib/authConstants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

export function AdminProfessionalsTable() {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = GetAllProfessionals();

  const updateStatusMutation = useUpdateProfessionalAccountStatus();
  const banMutation = BanProfessional();
  const editPasswordMutation = EditProfessionalPassword();

  const professionals = data?.pages.flatMap((page) => page.items) || [];
  const totalCount = data?.pages[0]?.totalCount || 0;

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] =
    useState<GetAllProfessionalsDto | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const handleStatusChange = (
    professionalId: string,
    verificationStatus: VerificationStatus,
  ) => {
    updateStatusMutation.mutate({ professionalId, status: verificationStatus });
  };

  const handleBanChange = (professionalId: string, value: string) => {
    const isBanned = value === "banned";
    banMutation.mutate({ professionalId, isBan: isBanned });
  };

  const handlePasswordEdit = (professional: GetAllProfessionalsDto) => {
    setSelectedProfessional(professional);
    setNewPassword("");
    setPasswordDialogOpen(true);
  };

  const handlePasswordSubmit = () => {
    if (selectedProfessional && newPassword) {
      editPasswordMutation.mutate({
        professionalId: selectedProfessional.id,
        newPassword,
      });
      setPasswordDialogOpen(false);
      setNewPassword("");
    }
  };

  const handleNavigateToProfile = (professionalId: string) => {
    navigate({ to: `/admin/professionals/${professionalId}` });
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-slate-500">
        Loading professionals...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-red-500">
        Error loading professionals
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-2 pl-4 sm:px-5">
          <div className="mb-2">
            <h2 className="text-brand-dark text-sm font-semibold tracking-tight">
              All Professionals
            </h2>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Manage professional accounts and verification status.
            </p>
          </div>
        </div>

        <div className="min-h-[400px] overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-white">
              <tr className="border-b border-slate-200">
                <th className="pt-2.5 pr-4 pb-2.5 pl-4 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Doctor
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Email
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Phone
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Specialization
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Created At
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Earned
                </th>
                <th className="px-4 py-2.5 text-[11px] font-medium tracking-wide text-slate-500 uppercase sm:px-5">
                  Verification
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
              {professionals.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="h-[350px] px-4 text-center align-middle sm:px-5"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <User className="h-6 w-6 text-slate-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-700">
                          No professionals
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          No professionals found in the system.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                professionals.map((professional) => {
                  console.log(professional);
                  return (
                    <tr key={professional.id} className="hover:bg-slate-50/70">
                      <td className="pt-3.5 pr-4 pb-3.5 pl-4 whitespace-nowrap sm:px-5">
                        <div
                          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-80"
                          onClick={() =>
                            handleNavigateToProfile(professional.id)
                          }
                        >
                          {professional.profilePictureUrl ? (
                            <img
                              src={professional.profilePictureUrl}
                              alt={`${professional.firstName} ${professional.lastName}`}
                              className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-medium text-slate-500">
                              {professional.firstName?.charAt(0) || "?"}
                            </div>
                          )}
                          <div>
                            <div className="text-xs font-medium tracking-tight text-slate-900">
                              {professional.firstName} {professional.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-700 sm:px-5">
                        {professional.email}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-700 sm:px-5">
                        {professional.phoneNumber || "N/A"}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-700 sm:px-5">
                        {SPECIALIZATIONS.find(
                          (s) => s.value === professional.specialization,
                        )?.label || professional.specialization}
                      </td>
                      <td className="px-4 py-3.5 text-xs whitespace-nowrap text-slate-700 sm:px-5">
                        {new Date(professional.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5 text-xs whitespace-nowrap text-slate-800 sm:px-5">
                        ${professional.totalEarned.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                        <Select
                          value={professional.accountStatus}
                          onValueChange={(value) =>
                            handleStatusChange(
                              professional.id,
                              value as VerificationStatus,
                            )
                          }
                        >
                          <SelectTrigger className="h-7 w-[110px] text-[11px]">
                            <SelectValue
                              placeholder={professional.accountStatus}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={VerificationStatus.Pending}>
                              Pending
                            </SelectItem>
                            <SelectItem value={VerificationStatus.Verified}>
                              Verified
                            </SelectItem>
                            <SelectItem value={VerificationStatus.Rejected}>
                              Rejected
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap sm:px-5">
                        <Select
                          value={professional.isBanned ? "banned" : "active"}
                          onValueChange={(value) =>
                            handleBanChange(professional.id, value)
                          }
                          disabled={banMutation.isPending}
                        >
                          <SelectTrigger className="h-7 w-[100px] text-[11px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="active"
                              className="text-green-700"
                            >
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
                            onClick={() => handlePasswordEdit(professional)}
                            className="hover:border-brand-blue/70 hover:bg-brand-blue/5 inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 transition-colors"
                          >
                            Edit Password
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/70 pt-3 pr-4 pb-3 pl-4 sm:flex-row sm:px-5">
          <div className="text-[11px] text-slate-500">
            Showing
            <span className="font-medium text-slate-700">
              {" "}
              {professionals.length}{" "}
            </span>
            of
            <span className="font-medium text-slate-700"> {totalCount} </span>
            professionals.
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
                : "No more professionals"}
          </button>
        </div>
      </div>

      {/* Edit Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Password</DialogTitle>
            <DialogDescription>
              Set a new password for {selectedProfessional?.firstName}{" "}
              {selectedProfessional?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
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
