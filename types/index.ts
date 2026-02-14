export interface BoardMember {
  id: string
  user_id: string
  email: string
  role: 'owner' | 'admin' | 'member'
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'mention' | 'card_assigned' | 'board_invite' | 'card_due'
  title: string
  message: string | null
  link: string | null
  read: boolean
  created_at: string
}
