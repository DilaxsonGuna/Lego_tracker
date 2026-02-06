import {
  SettingsSection,
  SettingsLinkItem,
  SettingsToggleItem,
  SettingsIntegrationCard,
  SettingsSignOut,
} from "@/components/settings";

export default function SettingsPage() {
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
          <SettingsLinkItem
            href="#"
            icon="lock"
            title="Password & Security"
            description="Update password and 2FA"
            isLast
          />
        </SettingsSection>

        {/* Section: Collection */}
        <SettingsSection title="Collection">
          <SettingsToggleItem
            icon="eye"
            title="Profile Visibility"
            description="Allow others to see your collection"
            checked
          />
          <SettingsLinkItem
            href="#"
            icon="layout-grid"
            title="Default View"
            description="Grid view for your vault"
            isLast
          />
        </SettingsSection>

        {/* Section: Appearance */}
        <SettingsSection title="Appearance">
          <SettingsLinkItem
            href="#"
            icon="sun"
            title="Theme"
            description="System (auto)"
            isLast
          />
        </SettingsSection>

        {/* Section: Integrations */}
        <div className="group/section">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 ml-2">
            Integrations
          </h2>
          <SettingsIntegrationCard />
        </div>

        {/* Section: System */}
        <SettingsSection title="System">
          <SettingsToggleItem
            icon="bell"
            title="Email Notifications"
            description="Get notified about new sets and updates"
            checked
            isLast
          />
        </SettingsSection>

        {/* Sign Out */}
        <SettingsSignOut />

        {/* Footer */}
        <div className="pt-8 flex flex-col items-center justify-center gap-2">
          <p className="text-xs text-muted-foreground">LegoFlex v1.0.0</p>
          <button className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors py-2 px-4 rounded hover:bg-red-500/5">
            Delete Account
          </button>
        </div>
      </div>
    </main>
  );
}
