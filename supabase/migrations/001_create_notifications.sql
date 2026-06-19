-- Restored from migrations_archive/009_create_notifications.sql.
-- Dropped during the 000 consolidation (commit c64505d); re-added here so a
-- fresh `db reset` and any prod replay recreate the in-app notifications table.
-- Read via lib/queries/notifications.ts, written via lib/commands/notifications.ts.
-- The actor join relies on the FK being auto-named "notifications_actor_id_fkey".

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for efficient notification queries
CREATE INDEX notifications_user_read_idx ON notifications(user_id, read);
CREATE INDEX notifications_user_created_idx ON notifications(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Authenticated users can insert notifications (for follow events, etc.)
CREATE POLICY "Authenticated users can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Recipients (user_id) and the acting user (actor_id) can delete rows.
-- Required by lib/commands/delete-account.ts, which clears notifications by
-- both columns under RLS. Missing in the original 009; added on restore.
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = actor_id);
