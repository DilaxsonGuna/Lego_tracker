import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

const errorMessages: Record<string, { title: string; description: string }> = {
  access_denied: {
    title: "Access Denied",
    description:
      "You don't have permission to access this resource. Please check your credentials and try again.",
  },
  otp_expired: {
    title: "Link Expired",
    description:
      "The verification link has expired. Please request a new one and try again.",
  },
  invalid_credentials: {
    title: "Invalid Credentials",
    description:
      "The email or password you entered is incorrect. Please double-check and try again.",
  },
  email_not_confirmed: {
    title: "Email Not Confirmed",
    description:
      "Your email address hasn't been verified yet. Please check your inbox for the confirmation link.",
  },
  user_not_found: {
    title: "Account Not Found",
    description:
      "We couldn't find an account with those details. You may need to sign up first.",
  },
  user_already_exists: {
    title: "Account Already Exists",
    description:
      "An account with this email already exists. Try logging in instead.",
  },
  validation_failed: {
    title: "Validation Error",
    description:
      "Some of the information provided was invalid. Please review your input and try again.",
  },
  email_address_invalid: {
    title: "Invalid Email",
    description:
      "The email address format is invalid. Please enter a valid email address.",
  },
  password_too_short: {
    title: "Password Too Short",
    description:
      "Your password must be at least 8 characters long. Please choose a stronger password.",
  },
  over_request_rate_limit: {
    title: "Too Many Requests",
    description:
      "You've made too many requests. Please wait a moment and try again.",
  },
};

const defaultError = {
  title: "Something went wrong",
  description:
    "An unexpected error occurred. Please try again or contact support if the problem persists.",
};

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_code?: string; error_description?: string }>;
}) {
  const params = await searchParams;
  const code = params?.error_code || params?.error || "";
  const info = errorMessages[code] || defaultError;

  return (
    <>
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-9 text-destructive" />
      </div>
      <CardTitle className="text-2xl">{info.title}</CardTitle>
      <p className="text-sm text-muted-foreground mt-2">
        {info.description}
      </p>
      {code && (
        <p className="text-xs text-muted-foreground/60 mt-1">
          Error code: {code}
        </p>
      )}
    </>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_code?: string; error_description?: string }>;
}) {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <Suspense>
                <ErrorContent searchParams={searchParams} />
              </Suspense>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/sign-up">Create Account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
