-- Board invites table
CREATE TABLE IF NOT EXISTS board_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id),
  token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

-- RLS
ALTER TABLE board_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Board owners can create invites" ON board_invites
  FOR INSERT WITH CHECK (
    invited_by = auth.uid()
  );

CREATE POLICY "Anyone can view invite by token" ON board_invites
  FOR SELECT USING (true);

CREATE POLICY "Invited user can update status" ON board_invites
  FOR UPDATE USING (true);
