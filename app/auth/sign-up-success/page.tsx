import { CheckCircle2, Mail, MousePointerClick, UserCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const steps = [
  {
    icon: Mail,
    title: "Check your email",
    description: "We sent a confirmation link to your inbox.",
  },
  {
    icon: MousePointerClick,
    title: "Click the link",
    description: "Verify your email to activate your account.",
  },
  {
    icon: UserCircle,
    title: "Complete your profile",
    description: "Pick a username and start building your vault.",
  },
];

export default function Page() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="size-9 text-green-500" />
              </div>
              <CardTitle className="text-2xl">
                You&apos;re almost there!
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Your account has been created. Just a few more steps to go.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Steps */}
              <ol className="space-y-4">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <step.icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-tight">
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <Button asChild className="w-full">
                  <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
                    Open Gmail
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <a href="https://outlook.live.com" target="_blank" rel="noopener noreferrer">
                    Open Outlook
                  </a>
                </Button>
              </div>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  Back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
