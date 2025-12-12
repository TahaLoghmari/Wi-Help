import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banknote, Shield, ExternalLink, X } from "lucide-react";
import { FLOUCI_ICON } from "@/assets";

export function Payment() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [walletId, setWalletId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle wallet integration logic here
    console.log("Wallet ID:", walletId);
    setOpen(false);
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-5 overflow-auto bg-[#fafafb] px-8 py-5 transition-all duration-200">
      <div className="flex flex-col gap-3 gap-x-3 gap-y-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="">
          <h2 className="text-brand-dark text-sm font-semibold tracking-tight">
            {t("professional.payment.title")}
          </h2>
          <p className="mt-0.5 max-w-xl text-[11px] text-slate-500">
            {t("professional.payment.subtitle")}
          </p>
        </div>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <div className="group">
          <div className="group relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl border p-6 transition-all duration-300 md:flex-row">
            {/* Decorative blur circle */}
            <div className="bg-brand-teal/10 absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl transition-opacity duration-300"></div>

            {/* Logo */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-2xl transition-all duration-300"></div>
              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-sm bg-white p-2 transition-transform duration-300">
                <img
                  src={FLOUCI_ICON}
                  alt="Flouci Logo"
                  className="h-full w-full rounded-sm object-contain"
                />
              </div>
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-brand-dark text-sm font-semibold transition-colors">
                      {t("professional.payment.flouci.title")}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {t("professional.payment.flouci.description")}
                  </p>
                  <div className="text-muted-foreground mt-3 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Banknote className="h-3 w-3" aria-hidden="true" />
                      <span>
                        {t("professional.payment.flouci.instantPayments")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" aria-hidden="true" />
                      <span>
                        {t("professional.payment.flouci.secureTransactions")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0">
                  <AlertDialogTrigger asChild>
                    <Button className="hover:bg-brand-dark/80 bg-brand-dark relative overflow-hidden text-white transition-all duration-300">
                      {t("professional.payment.flouci.connectWallet")}
                      <ExternalLink
                        className="ml-2 h-4 w-4 transition-transform duration-300"
                        aria-hidden="true"
                      />
                    </Button>
                  </AlertDialogTrigger>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogContent className="max-h-[90%] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-[600px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-brand-dark">
              {t("professional.payment.flouci.integrateTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("professional.payment.flouci.integrateDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="walletId">
                {t("professional.payment.flouci.walletId")}
              </Label>
              <Input
                type="text"
                id="walletId"
                name="walletId"
                placeholder="5f7a209aeb3f76490ac4a3d1"
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="focus-visible:border-brand-teal focus-visible:ring-brand-teal/50 transition-all"
              />
            </div>
            <div className="flex items-center justify-end">
              <Button
                type="submit"
                className="bg-brand-dark hover:bg-brand-dark/90 text-white"
              >
                {t("professional.payment.flouci.integrateButton")}
              </Button>
            </div>
          </form>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <X aria-hidden="true" />
            <span className="sr-only">
              {t("professional.payment.flouci.close")}
            </span>
          </button>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
