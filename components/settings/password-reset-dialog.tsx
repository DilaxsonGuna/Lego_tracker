"use client";

import { useState, useTransition } from "react";
import { Lock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { sendPasswordResetEmail } from "@/app/(app)/settings/actions";
import { toast } from "sonner";

interface PasswordResetDialogProps {
  isLast?: boolean;
}

export function PasswordResetDialog({ isLast = false }: PasswordResetDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await sendPasswordResetEmail();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Password reset email sent! Check your inbox.");
        setOpen(false);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          className={cn(
            "flex items-center justify-between gap-4 p-4 sm:px-6 hover:bg-surface-accent transition-colors group/item w-full text-left",
            !isLast && "border-b border-border/50"
          )}
        >
          <div className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-accent text-muted-foreground group-hover/item:text-primary transition-colors">
              <Lock className="size-5" />
            </div>
            <div>
              <p className="font-medium text-foreground">Password & Security</p>
              <p className="text-sm text-muted-foreground">Reset your password</p>
            </div>
          </div>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Password</AlertDialogTitle>
          <AlertDialogDescription>
            We&apos;ll send a password reset link to your email address. You&apos;ll be able to set a new password after clicking the link.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Sending..." : "Send Reset Email"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
