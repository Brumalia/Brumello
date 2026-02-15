'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Notification } from '@/types'
import Link from 'next/link'
import { createPortal } from 'react-dom'

interface NotificationBellProps {
  userId: string
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient() as any

  useEffect(() => {
    fetchNotifications()
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (!error && data) {
      setNotifications(data)
      setUnreadCount(data.filter((n: Notification) => !n.read).length)
    }
  }

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
    
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id)
    if (unreadIds.length === 0) return
    
    await supabase
      .from('notifications')
      .update({ read: true })
      .in('id', unreadIds)
    
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const deleteNotification = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
    
    const deleted = notifications.find(n => n.id === notificationId)
    setNotifications(notifications.filter(n => n.id !== notificationId))
    if (deleted && !deleted.read) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const getNotificationIcon = (type: string) => {
    const iconStyles = {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }

    switch (type) {
      case 'mention':
        return (
          <div style={{ ...iconStyles, backgroundColor: 'rgba(251, 146, 60, 0.15)' }}>
            <span style={{ color: '#fb923c', fontWeight: 600 }}>@</span>
          </div>
        )
      case 'board_invite':
        return (
          <div style={{ ...iconStyles, backgroundColor: 'rgba(52, 211, 153, 0.15)' }}>
            <svg style={{ width: '16px', height: '16px', color: '#34d399' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        )
      case 'card_assigned':
        return (
          <div style={{ ...iconStyles, backgroundColor: 'rgba(96, 165, 250, 0.15)' }}>
            <svg style={{ width: '16px', height: '16px', color: '#60a5fa' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        )
      case 'card_due':
        return (
          <div style={{ ...iconStyles, backgroundColor: 'rgba(248, 113, 113, 0.15)' }}>
            <svg style={{ width: '16px', height: '16px', color: '#f87171' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
      default:
        return (
          <div style={{ ...iconStyles, backgroundColor: 'rgba(138, 155, 145, 0.15)' }}>
            <span style={{ color: '#8a9b91' }}>?</span>
          </div>
        )
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          padding: '8px',
          color: '#e2e8e4',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span 
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '20px',
              height: '20px',
              backgroundColor: '#f87171',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && createPortal(
        <div 
          style={{
            position: 'fixed',
            backgroundColor: '#142024',
            borderRadius: '14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
            zIndex: 9999,
            border: '1px solid rgba(255,255,255,0.07)',
            overflow: 'hidden',
            width: '320px',
            right: '1rem',
            top: '3.5rem'
          }}
        >
          <div 
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3 
              style={{
                fontWeight: 600,
                color: '#f0f5f1',
                fontSize: '14px',
                margin: 0
              }}
            >
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  fontSize: '12px',
                  color: '#34d399',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#10b981'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#34d399'
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div 
            style={{
              maxHeight: '384px',
              overflowY: 'auto'
            }}
          >
            {notifications.length === 0 ? (
              <div 
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: '#8a9b91',
                  fontSize: '14px'
                }}
              >
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    backgroundColor: !notification.read ? 'rgba(52, 211, 153, 0.05)' : 'transparent',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = !notification.read ? 'rgba(52, 211, 153, 0.05)' : 'transparent'
                  }}
                >
                  <Link
                    href={notification.link || '#'}
                    onClick={() => markAsRead(notification.id)}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      textDecoration: 'none'
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                    <div 
                      style={{
                        flex: 1,
                        minWidth: 0
                      }}
                    >
                      <p 
                        style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#f0f5f1',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {notification.title}
                      </p>
                      {notification.message && (
                        <p 
                          style={{
                            fontSize: '12px',
                            color: '#8a9b91',
                            margin: '2px 0 0 0',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {notification.message}
                        </p>
                      )}
                      <p 
                        style={{
                          fontSize: '11px',
                          color: '#4d5f56',
                          margin: '4px 0 0 0'
                        }}
                      >
                        {formatTime(notification.created_at)}
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      deleteNotification(notification.id)
                    }}
                    style={{
                      color: '#4d5f56',
                      fontSize: '11px',
                      marginTop: '4px',
                      marginLeft: '44px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#f87171'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#4d5f56'
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
