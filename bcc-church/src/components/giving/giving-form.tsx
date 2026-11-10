import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Heart, Shield } from "lucide-react";
import type { InsertGivingRecord } from "@/lib/schemas";
import { api, type GivingCreateResponse } from "@/lib/api";

export default function GivingForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<InsertGivingRecord>({
    amount: "",
    givingType: "",
    phoneNumber: "",
    email: "",
    message: ""
  });
  const [lastGivingId, setLastGivingId] = useState<string | null>(null);
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
    // Empty email string -> undefined so the optional backend field stays clean.
    mutationFn: (data: InsertGivingRecord) =>
      api.createGivingRecord({
        ...data,
        email: data.email?.trim() ? data.email.trim() : undefined,
      }),
    onSuccess: (res: GivingCreateResponse) => {
      setLastGivingId(res.id);
      setPaymentStatus("initiated");
      toast({
        title: "Giving Submitted",
        description:
          res.instructions ??
          "You will receive an M-Pesa prompt on your phone shortly.",
      });
      setFormData({
        amount: "",
        givingType: "",
        phoneNumber: "",
        email: "",
        message: ""
      });
      void pollStatus(res.id);
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message || "Failed to process your giving. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.givingType || !formData.phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createGivingRecord.mutate(formData);
  };

  const handleInputChange = (field: keyof InsertGivingRecord, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-xl">
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold text-primary mb-6 font-serif" data-testid="text-giving-form-title">Quick Give</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="givingType" className="block text-sm font-medium text-primary mb-2">
              Giving Type *
            </Label>
            <Select onValueChange={(value) => handleInputChange("givingType", value)} data-testid="select-giving-type">
              <SelectTrigger>
                <SelectValue placeholder="Select giving type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tithe">Tithe</SelectItem>
                <SelectItem value="Offering">Offering</SelectItem>
                <SelectItem value="Building Fund">Building Fund</SelectItem>
                <SelectItem value="Mission Support">Mission Support</SelectItem>
                <SelectItem value="Special Project">Special Project</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount" className="block text-sm font-medium text-primary mb-2">
              Amount (KES) *
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              data-testid="input-amount"
              required
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber" className="block text-sm font-medium text-primary mb-2">
              Phone Number *
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="07XXXXXXXX"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              data-testid="input-phone"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
              Email (Optional — for your receipt)
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email ?? ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              data-testid="input-email"
            />
          </div>

          <div>
            <Label htmlFor="message" className="block text-sm font-medium text-primary mb-2">
              Message (Optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Special intention or prayer request"
              rows={3}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              data-testid="textarea-message"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            disabled={createGivingRecord.isPending}
            data-testid="button-submit-giving"
          >
            <Heart className="mr-2" size={20} />
            {createGivingRecord.isPending ? "Processing..." : "Give Now via M-Pesa"}
          </Button>

          {lastGivingId && paymentStatus && (
            <p
              className="text-sm text-muted-foreground text-center"
              data-testid="text-giving-status"
            >
              Payment status: <span className="font-semibold">{paymentStatus}</span>
            </p>
          )}
        </form>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center flex items-center justify-center">
            <Shield className="mr-1" size={16} />
            Your giving is secure and encrypted. You will receive a confirmation SMS.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
