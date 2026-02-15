import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  const supabase = await createClient()

  // Look up the invite
  const { data: invite, error } = await supabase
    .from('board_invites')
    .select('*')
    .eq('token', token)
    .single()

  if (error || !invite) {
    return NextResponse.redirect(new URL('/dashboard?error=invalid_invite', req.url))
  }

  // Check if expired
  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.redirect(new URL('/dashboard?error=expired_invite', req.url))
  }

  // Check if already accepted
  if (invite.status === 'accepted') {
    return NextResponse.redirect(new URL(`/boards/${invite.board_id}`, req.url))
  }

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Not logged in - redirect to signup with invite token
    return NextResponse.redirect(
      new URL(`/auth/signup?invite=${token}&email=${encodeURIComponent(invite.invited_email)}`, req.url)
    )
  }

  // User is logged in - add them to board
  try {
    // Add to board_members
    await supabase
      .from('board_members')
      .insert({
        board_id: invite.board_id,
        user_id: user.id,
        role: 'member'
      })

    // Mark invite as accepted
    await supabase
      .from('board_invites')
      .update({ status: 'accepted' })
      .eq('token', token)

    // Redirect to the board
    return NextResponse.redirect(new URL(`/boards/${invite.board_id}`, req.url))
  } catch (error) {
    console.error('Error accepting invite:', error)
    return NextResponse.redirect(new URL('/dashboard?error=accept_failed', req.url))
  }
}
