import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GivingForm from "@/components/giving/giving-form";

/**
 * M-Pesa giving in a modal — opened by tapping the M-Pesa option card
 * (or the "Give with M-Pesa" button). The form fires the STK push and
 * polls for confirmation; everything else stays on the page.
 */
export default function MpesaModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="mpesa-modal w-[calc(100%-2rem)] rounded-[1.75rem] border border-white/10 bg-white p-4 shadow-2xl sm:max-w-lg sm:p-5"
        data-testid="modal-mpesa-give"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Give with M-Pesa</DialogTitle>
          <DialogDescription>
            Enter your M-Pesa details to receive an STK push on your phone.
          </DialogDescription>
        </DialogHeader>
        <GivingForm />
      </DialogContent>
    </Dialog>
  );
}
