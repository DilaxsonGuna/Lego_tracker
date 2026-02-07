"use client";

import { useState, useTransition } from "react";
import {
  SettingsSection,
  SettingsLinkItem,
  SettingsToggleItem,
  SettingsSignOut,
  PasswordResetDialog,
  DefaultViewDialog,
  ThemeSelectorDialog,
} from "@/components/settings";
import { updateProfileSetting, type ProfileSettings } from "./actions";
import { toast } from "sonner";

interface SettingsClientProps {
  initialSettings: ProfileSettings;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (
    key: keyof ProfileSettings,
    value: boolean
  ) => {
    const previousValue = settings[key];
    setSettings((prev) => ({ ...prev, [key]: value }));

    startTransition(async () => {
      const result = await updateProfileSetting({ [key]: value });
      if (result.error) {
        toast.error(result.error);
        setSettings((prev) => ({ ...prev, [key]: previousValue }));
      }
    });
  };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 md:px-6 lg:py-12">
      {/* Page Heading */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-2">
          Settings
        </h1>
        <p className="text-muted-foreground text-base md:text-lg font-light">
          Manage your account preferences, privacy, and integrations.
        </p>
      </div>

      {/* Settings Container */}
      <div className="space-y-10">
        {/* Section: Account */}
        <SettingsSection title="Account">
          <SettingsLinkItem
            href="/settings/profile"
            icon="user"
            title="Edit Profile"
            description="Name, bio, and avatar"
          />
          <PasswordResetDialog isLast />
        </SettingsSection>

        {/* Section: Collection */}
        <SettingsSection title="Collection">
          <SettingsToggleItem
            icon="eye"
            title="Profile Visibility"
            description="Allow others to see your collection"
            checked={settings.profile_visible}
            onCheckedChange={(checked) =>
              handleToggle("profile_visible", checked)
            }
            disabled={isPending}
          />
          <DefaultViewDialog
            defaultGridView={settings.default_grid_view}
            isLast
          />
        </SettingsSection>

        {/* Section: Appearance */}
        <SettingsSection title="Appearance">
          <ThemeSelectorDialog isLast />
        </SettingsSection>

        {/* Section: System */}
        <SettingsSection title="System">
          <SettingsToggleItem
            icon="bell"
            title="Email Notifications"
            description="Get notified about new sets and updates"
            checked={settings.email_notifications}
            onCheckedChange={(checked) =>
              handleToggle("email_notifications", checked)
            }
            disabled={isPending}
            isLast
          />
        </SettingsSection>

        {/* Sign Out */}
        <SettingsSignOut />

        {/* Footer */}
        <div className="pt-8 flex flex-col items-center justify-center gap-2">
          <p className="text-xs text-muted-foreground">LegoFlex v1.0.0</p>
        </div>
      </div>
    </main>
  );
}
