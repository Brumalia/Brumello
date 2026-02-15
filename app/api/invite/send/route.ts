import { NextRequest, NextResponse } from 'next/server'
import { AgentMailClient } from 'agentmail'

export async function POST(req: NextRequest) {
  try {
    const { email, boardName, inviterEmail, token } = await req.json()

    if (!email || !boardName || !token) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const agentmail = new AgentMailClient({ 
      apiKey: process.env.AGENTMAIL_API_KEY || 'am_8db1180fd37c4453c48b854c5623736ce1bb906fd725a41b540092ecc31d0ad7'
    })

    // Find the inbox
    const inboxes: any = await agentmail.inboxes.list()
    const targetInbox = inboxes.find((inbox: any) => inbox.emailAddress === 'brumalia@agentmail.to')
    
    if (!targetInbox) {
      return NextResponse.json({ error: 'No inbox found' }, { status: 500 })
    }

    const inviteLink = `https://brumello.vercel.app/api/invite/accept?token=${token}`

    await agentmail.inboxes.messages.send(targetInbox.id, {
      to: email,
      subject: `You've been invited to join ${boardName} on Brumello`,
      text: `
You've been invited to join ${boardName} on Brumello.

Invited by: ${inviterEmail || 'Someone'}

Accept the invitation: ${inviteLink}

This invitation will expire in 7 days.
      `
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending invite:', error)
    return NextResponse.json({ error: 'Failed to send invite' }, { status: 500 })
  }
}
