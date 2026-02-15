'use client'

import { useState, useEffect } from 'react'

interface Card {
  id: string
  title: string
  description: string | null
  completed: boolean
  background_color: string | null
  due_date: string | null
  list_id: string
  position: number
  card_labels?: Array<{ labels: { id: string; name: string; color: string } }>
}

interface SearchFilterProps {
  cards: any[]
  onFilter: (filtered: any[]) => void
}

export default function SearchFilter({ cards, onFilter }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLabel, setFilterLabel] = useState<string | null>(null)
  const [filterCompleted, setFilterCompleted] = useState<boolean | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [availableLabels, setAvailableLabels] = useState<Array<{ id: string; name: string; color: string }>>([])

  // Get all unique labels from cards
  const labelsFromCards = (): Array<{ id: string; name: string; color: string }> => {
    const labels = new Map<string, { id: string; name: string; color: string }>()
    cards.forEach((card: any) => {
      card.card_labels?.forEach((cl: any) => {
        labels.set(cl.labels.id, cl.labels)
      })
    })
    return Array.from(labels.values())
  }

  // Update available labels when cards change
  useEffect(() => {
    setAvailableLabels(labelsFromCards())
  }, [cards])

  // Filter cards when search/filters change
  useEffect(() => {
    let filtered = [...cards]

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((card: any) => 
        card.title.toLowerCase().includes(query) ||
        (card.description && card.description.toLowerCase().includes(query))
      )
    }

    // Label filter
    if (filterLabel) {
      filtered = filtered.filter((card: any) =>
        card.card_labels?.some((cl: any) => cl.labels.id === filterLabel)
      )
    }

    // Completed filter
    if (filterCompleted !== null) {
      filtered = filtered.filter((card: any) => card.completed === filterCompleted)
    }

    onFilter(filtered)
  }, [searchQuery, filterLabel, filterCompleted, cards, onFilter])

  const clearFilters = () => {
    setSearchQuery('')
    setFilterLabel(null)
    setFilterCompleted(null)
  }

  const hasFilters = searchQuery || filterLabel || filterCompleted !== null

  return (
    <div 
      style={{
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}
    >
      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search cards..."
          style={{
            width: '100%',
            padding: '8px 12px 8px 36px',
            backgroundColor: '#142024',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px',
            color: '#e2e8e4',
            fontSize: '14px',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = '1px solid rgba(255,255,255,0.12)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
          }}
        />
        <svg 
          style={{
            position: 'absolute',
            left: '12px',
            top: '10px',
            width: '16px',
            height: '16px',
            color: '#4d5f56'
          }}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '12px',
              top: '10px',
              color: '#4d5f56',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              lineHeight: 1
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#8a9b91'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#4d5f56'
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Filter Toggle & Active Filters */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}
      >
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: '6px 12px',
            fontSize: '14px',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.07)',
            backgroundColor: hasFilters ? 'rgba(52, 211, 153, 0.1)' : '#142024',
            color: hasFilters ? '#34d399' : '#e2e8e4',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>

        {hasFilters && (
          <button
            onClick={clearFilters}
            style={{
              padding: '6px 12px',
              fontSize: '14px',
              color: '#f87171',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ef4444'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#f87171'
            }}
          >
            Clear all
          </button>
        )}

        {filterLabel && (
          <span 
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: 'rgba(138, 155, 145, 0.1)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#e2e8e4'
            }}
          >
            Label: {availableLabels.find(l => l.id === filterLabel)?.name}
            <button 
              onClick={() => setFilterLabel(null)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#8a9b91',
                cursor: 'pointer',
                fontSize: '16px',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </span>
        )}

        {filterCompleted !== null && (
          <span 
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: 'rgba(138, 155, 145, 0.1)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#e2e8e4'
            }}
          >
            {filterCompleted ? 'Completed' : 'Incomplete'}
            <button 
              onClick={() => setFilterCompleted(null)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#8a9b91',
                cursor: 'pointer',
                fontSize: '16px',
                lineHeight: 1
              }}
            >
              ×
            </button>
          </span>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div 
          style={{
            padding: '12px',
            backgroundColor: '#142024',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {/* Label Filter */}
          <div>
            <label 
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 500,
                color: '#8a9b91',
                marginBottom: '4px'
              }}
            >
              Label
            </label>
            <select
              value={filterLabel || ''}
              onChange={(e) => setFilterLabel(e.target.value || null)}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                backgroundColor: '#101a1e',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '6px',
                color: '#e2e8e4',
                outline: 'none'
              }}
            >
              <option value="">All labels</option>
              {availableLabels.map(label => (
                <option key={label.id} value={label.id}>{label.name}</option>
              ))}
            </select>
          </div>

          {/* Completed Filter */}
          <div>
            <label 
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 500,
                color: '#8a9b91',
                marginBottom: '4px'
              }}
            >
              Status
            </label>
            <select
              value={filterCompleted === null ? '' : filterCompleted.toString()}
              onChange={(e) => {
                if (e.target.value === '') setFilterCompleted(null)
                else setFilterCompleted(e.target.value === 'true')
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                backgroundColor: '#101a1e',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '6px',
                color: '#e2e8e4',
                outline: 'none'
              }}
            >
              <option value="">All</option>
              <option value="false">Incomplete</option>
              <option value="true">Completed</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
