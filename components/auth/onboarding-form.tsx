"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AvatarSelector, getAvatarColor } from "./avatar-selector";
import {
  createProfile,
  checkUsernameAvailability,
} from "@/app/auth/onboarding/actions";

interface OnboardingFormProps extends React.ComponentPropsWithoutRef<"div"> {}

export function OnboardingForm({ className, ...props }: OnboardingFormProps) {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [avatarColor, setAvatarColor] = useState("blue");
  const [error, setError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // Debounced username availability check
  useEffect(() => {
    setUsernameError(null);
    setUsernameAvailable(null);

    if (username.length < 3) {
      return;
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      setUsernameError("Only letters, numbers, and underscores");
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);
      const { available } = await checkUsernameAvailability(username);
      setUsernameAvailable(available);
      if (!available) {
        setUsernameError("Username already taken");
      }
      setIsCheckingUsername(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await createProfile({
      username,
      fullName: fullName || undefined,
      avatarUrl: getAvatarColor(avatarColor),
      bio: bio || undefined,
      location: location || undefined,
      dateOfBirth: dateOfBirth || undefined,
    });

    if (result.error) {
      setError(result.error);
      if (result.fieldErrors?.username) {
        setUsernameError(result.fieldErrors.username);
      }
      setIsLoading(false);
      return;
    }

    // Force hard navigation to ensure middleware re-evaluates
    window.location.href = "/";
  };

  const isFormValid =
    username.length >= 3 && !usernameError && usernameAvailable !== false;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Tell us about yourself to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Avatar Selection */}
              <div className="grid gap-3">
                <Label>Choose Your Avatar</Label>
                <div className="flex justify-center py-2">
                  <AvatarSelector
                    value={avatarColor}
                    onChange={setAvatarColor}
                  />
                </div>
              </div>

              {/* Username */}
              <div className="grid gap-2">
                <Label htmlFor="username">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="brickmaster"
                  required
                  minLength={3}
                  maxLength={20}
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))
                  }
                  className={cn(
                    usernameError && "border-destructive",
                    usernameAvailable === true &&
                      username.length >= 3 &&
                      "border-green-500"
                  )}
                />
                {isCheckingUsername && (
                  <p className="text-sm text-muted-foreground">
                    Checking availability...
                  </p>
                )}
                {usernameError && (
                  <p className="text-sm text-destructive">{usernameError}</p>
                )}
                {usernameAvailable === true && username.length >= 3 && (
                  <p className="text-sm text-green-500">Username available</p>
                )}
                <p className="text-xs text-muted-foreground">
                  3-20 characters, letters, numbers, and underscores only
                </p>
              </div>

              {/* Display Name */}
              <div className="grid gap-2">
                <Label htmlFor="fullName">Display Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Master Builder"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* Bio */}
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself and your Lego collection..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={160}
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">
                  {bio.length}/160
                </p>
              </div>

              {/* Location */}
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="City, Country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Date of Birth */}
              <div className="grid gap-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? "Creating Profile..." : "Get Started"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
