import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2, ShieldCheck, Smartphone, XCircle } from "lucide-react";
import type { InsertGivingRecord } from "@/lib/schemas";
import { api, type GivingCreateResponse } from "@/lib/api";
import { cn } from "@/lib/utils";

const TYPES = ["Tithe", "Offering", "Building Fund", "Mission Support", "Special Project"];
const QUICK_AMOUNTS = [100, 500, 1000, 5000];

export default function GivingForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<InsertGivingRecord>({
    amount: "",
    givingType: "Tithe",
    name: "",
    phoneNumber: "",
    email: "",
    message: "",
  });
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const pollStatus = async (givingId: string) => {
    // Poll the backend for up to ~60s; the M-Pesa callback usually lands in seconds.
    for (let i = 0; i < 12; i++) {
      await new Promise((r) => setTimeout(r, 5000));
      try {
        const s = await api.getGivingStatus(givingId);
        setPaymentStatus(s.status);
        if (s.status === "completed" || s.status === "failed") {
          toast({
            title: s.status === "completed" ? "Payment Confirmed" : "Payment Failed",
            description:
              s.status === "completed"
                ? "Thank you! Your M-Pesa payment was confirmed."
                : "The M-Pesa payment did not complete. Please try again.",
            variant: s.status === "completed" ? undefined : "destructive",
          });
          return;
        }
      } catch {
        // Keep polling; fall through to the M-Pesa direct query hint below.
      }
    }
    try {
      const live = await api.queryMpesaStatus(givingId);
      setPaymentStatus(live.status);
    } catch {
      // Status stays as last known; user can retry.
    }
  };

  const createGivingRecord = useMutation({
    mutationFn: (data: InsertGivingRecord) =>
      api.createGivingRecord({
        ...data,
        email: data.email?.trim() ? data.email.trim() : undefined,
      }),
    onSuccess: (res: GivingCreateResponse) => {
      setPaymentStatus("initiated");
      toast({
        title: "Check your phone",
        description:
          res.instructions ??
          "Enter your M-Pesa PIN on the prompt to complete giving.",
      });
      setFormData({
        amount: "",
        givingType: "Tithe",
        name: "",
        phoneNumber: "",
        email: "",
        message: "",
      });
      void pollStatus(res.id);
    },
    onError: (err: Error) => {
      toast({
        title: "Could not start payment",
        description: err.message || "Please check your details and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.givingType || !formData.name?.trim() || !formData.phoneNumber) {
      toast({
        title: "Missing details",
        description: "Name, amount, giving type and M-Pesa number are required.",
        variant: "destructive",
      });
      return;
    }
    createGivingRecord.mutate(formData);
  };

  const set = (field: keyof InsertGivingRecord, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const amountNum = Number(formData.amount) || 0;
  const done = paymentStatus === "completed";
  const failed = paymentStatus === "failed";
  const waiting = paymentStatus !== null && !done && !failed;

  return (
    <div>
      {/* Checkout header — live total */}
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-primary via-[#1d3a6e] to-royal px-4 py-3 text-white ring-1 ring-white/10">
        <span className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl gold-surface shadow">
            <Smartphone size={19} className="text-primary" />
          </span>
          <span>
            <span className="block text-sm font-black leading-tight">M-Pesa Checkout</span>
            <span className="block text-[11px] text-white/70">STK push to your phone</span>
          </span>
        </span>
        <span className="text-right">
          <span className="block font-serif text-2xl font-black leading-none gold-accent">
            {amountNum > 0 ? amountNum.toLocaleString() : "—"}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">KES</span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-3 space-y-3">
        {/* Giving type pills */}
        <div>
          <Label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Giving for
          </Label>
          <div className="flex flex-wrap gap-1.5" data-testid="select-giving-type">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set("givingType", t)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-bold transition",
                  formData.givingType === t
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-primary/50"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Amount + quick picks */}
        <div>
          <Label htmlFor="amount" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Amount (KES)
          </Label>
          <div className="flex gap-1.5">
            {QUICK_AMOUNTS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => set("amount", String(q))}
                className={cn(
                  "flex-1 rounded-lg border px-2 py-2 text-xs font-black transition",
                  String(q) === String(formData.amount)
                    ? "border-green-600 bg-green-50 text-green-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-green-600/50"
                )}
              >
                {q >= 1000 ? `${q / 1000}K` : q}
              </button>
            ))}
            <Input
              id="amount"
              type="number"
              min={1}
              placeholder="Other"
              value={formData.amount}
              onChange={(e) => set("amount", e.target.value)}
              data-testid="input-amount"
              required
              className="flex-[1.4]"
            />
          </div>
        </div>

        {/* Name + phone */}
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
          <div>
            <Label htmlFor="giverName" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Full name *
            </Label>
            <Input
              id="giverName"
              type="text"
              placeholder="Jane Wanjiku"
              value={formData.name ?? ""}
              onChange={(e) => set("name", e.target.value)}
              data-testid="input-giver-name"
              required
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
              M-Pesa number *
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="07XXXXXXXX"
              value={formData.phoneNumber}
              onChange={(e) => set("phoneNumber", e.target.value)}
              data-testid="input-phone"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Email <span className="font-medium normal-case text-slate-400">(for your receipt)</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email ?? ""}
            onChange={(e) => set("email", e.target.value)}
            data-testid="input-email"
          />
        </div>

        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-green-600 text-sm font-black text-white hover:bg-green-700"
          disabled={createGivingRecord.isPending || waiting}
          data-testid="button-submit-giving"
        >
          {createGivingRecord.isPending || waiting ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={18} /> Waiting for M-Pesa PIN…
            </>
          ) : done ? (
            <>
              <CheckCircle2 className="mr-2" size={18} /> Give again
            </>
          ) : (
            <>Give{amountNum > 0 ? ` KES ${amountNum.toLocaleString()}` : ""} via M-Pesa</>
          )}
        </Button>

        {paymentStatus && (
          <p
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-center text-xs font-bold",
              done && "bg-green-50 text-green-700",
              failed && "bg-red-50 text-red-600",
              waiting && "bg-amber-50 text-amber-700"
            )}
            data-testid="text-giving-status"
          >
            {waiting && <Loader2 size={13} className="animate-spin" />}
            {done && <CheckCircle2 size={13} />}
            {failed && <XCircle size={13} />}
            {done
              ? "Payment confirmed — receipt on its way."
              : failed
                ? "Payment did not complete — try again."
                : "Approve the prompt on your phone…"}
          </p>
        )}

        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
          <ShieldCheck size={13} /> Encrypted STK push · confirmation SMS follows
        </p>
      </form>
    </div>
  );
}
