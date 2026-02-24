"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AtSign, MapPin, Check, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AvatarSelector, getAvatarColor } from "@/components/auth/avatar-selector";
import { ThemeSelector } from "@/components/shared/theme-selector";
import { updateProfile, checkUsernameAvailability } from "@/app/(app)/profile/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ThemeCategory } from "@/types/explore";

interface EditProfileFormProps {
  initialData: {
    username: string;
    bio: string;
    avatarColor: string;
    location: string;
    selectedThemeIds: number[];
    availableThemes: ThemeCategory[];
    popularThemes: ThemeCategory[];
  };
}

export function EditProfileForm({ initialData }: EditProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [username, setUsername] = useState(initialData.username ?? "");
  const [bio, setBio] = useState(initialData.bio ?? "");
  const [location, setLocation] = useState(initialData.location ?? "");
  const [avatarColor, setAvatarColor] = useState(initialData.avatarColor || "blue");
  const [selectedThemes, setSelectedThemes] = useState<number[]>(
    initialData.selectedThemeIds ?? []
  );

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const maxBioLength = 200;

  // Debounced username validation
  useEffect(() => {
    setUsernameError(null);
    setUsernameAvailable(null);

    const trimmed = username.trim().toLowerCase();

    // Skip check if unchanged from initial
    if (trimmed === initialData.username) {
      setUsernameAvailable(true);
      return;
    }

    if (trimmed.length > 0 && trimmed.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return;
    }

    if (trimmed.length > 20) {
      setUsernameError("Username must be at most 20 characters");
      return;
    }

    if (trimmed.length >= 3 && !/^[a-z0-9_]+$/.test(trimmed)) {
      setUsernameError("Only lowercase letters, numbers, and underscores");
      return;
    }

    if (trimmed.length < 3) return;

    const timer = setTimeout(async () => {
      setIsCheckingUsername(true);
      const { available } = await checkUsernameAvailability(trimmed);
      setUsernameAvailable(available);
      if (!available) {
        setUsernameError("Username already taken");
      }
      setIsCheckingUsername(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [username, initialData.username]);

  const isFormValid =
    username.trim().length >= 3 && !usernameError && usernameAvailable !== false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    startTransition(async () => {
      const result = await updateProfile({
        username: username.trim(),
        bio: bio.trim(),
        location: location.trim(),
        avatarUrl: avatarColor, // Using avatarUrl field to store color
        themeIds: selectedThemes,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Profile updated successfully");
        router.push("/settings");
      }
    });
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 md:px-6 lg:py-12">
      {/* Back Link */}
      <Link
        href="/settings"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-medium">Back to Settings</span>
      </Link>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
          Edit Profile
        </h1>
        <p className="text-muted-foreground mt-2 font-light">
          Customize how you appear to the community.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div
              className="size-32 rounded-full border-4 border-card overflow-hidden ring-2 ring-border transition-all group-hover:ring-primary/50 flex items-center justify-center"
              style={{ backgroundColor: getAvatarColor(avatarColor) }}
            >
              <span className="text-4xl font-bold text-white">
                {username.charAt(0).toUpperCase() || "?"}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 mb-3">Choose your avatar color</p>
          <AvatarSelector value={avatarColor} onChange={setAvatarColor} />
        </div>

        {/* Form Fields */}
        <div className="space-y-8">
          {/* Username */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Username
            </label>
            <div className="relative">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
              <Input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))
                }
                placeholder="your_username"
                maxLength={20}
                className={cn(
                  "h-12 bg-card border-border rounded-xl pl-11 pr-10 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground",
                  usernameError && "border-destructive focus:ring-destructive",
                  usernameAvailable === true &&
                    username.trim().length >= 3 &&
                    "border-green-500 focus:ring-green-500"
                )}
              />
              {/* Status icon */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {isCheckingUsername && (
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                )}
                {!isCheckingUsername &&
                  usernameAvailable === true &&
                  username.trim().length >= 3 && (
                    <Check className="size-4 text-green-500" />
                  )}
                {!isCheckingUsername && usernameError && (
                  <X className="size-4 text-destructive" />
                )}
              </div>
            </div>
            {usernameError && (
              <p className="text-xs text-destructive ml-1">{usernameError}</p>
            )}
            {!isCheckingUsername &&
              usernameAvailable === true &&
              username.trim() !== initialData.username &&
              username.trim().length >= 3 && (
                <p className="text-xs text-green-500 ml-1">Username available</p>
              )}
            <p className="text-xs text-muted-foreground ml-1">
              3-20 characters, lowercase letters, numbers, and underscores only
            </p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="h-12 bg-card border-border rounded-xl pl-11 pr-4 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Bio
            </label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, maxBioLength))}
              placeholder="Tell the community about your building journey..."
              rows={4}
              className="bg-card border-border rounded-xl p-4 resize-none"
            />
            <div className="flex justify-end">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
                {bio.length} / {maxBioLength} characters
              </span>
            </div>
          </div>

          {/* Favorite Themes */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Favorite Themes
            </label>
            <ThemeSelector
              availableThemes={initialData.availableThemes}
              popularThemes={initialData.popularThemes}
              selectedThemeIds={selectedThemes}
              onChange={setSelectedThemes}
              maxThemes={10}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6">
          <Button
            type="submit"
            disabled={isPending || !isFormValid}
            className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/10"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
          <Link href="/settings">
            <Button
              type="button"
              variant="ghost"
              className="w-full mt-4 h-12 text-muted-foreground font-medium text-sm hover:text-foreground transition-colors"
            >
              Discard Edits
            </Button>
          </Link>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-20 flex flex-col items-center justify-center gap-2 border-t border-border pt-8">
        <p className="text-xs text-muted-foreground">LegoFlex v1.0.0</p>
      </div>
    </div>
  );
}
