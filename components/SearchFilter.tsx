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
  cards: Card[]
  onFilter: (filtered: Card[]) => void
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
    cards.forEach(card => {
      card.card_labels?.forEach(cl => {
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
      filtered = filtered.filter(card => 
        card.title.toLowerCase().includes(query) ||
        (card.description && card.description.toLowerCase().includes(query))
      )
    }

    // Label filter
    if (filterLabel) {
      filtered = filtered.filter(card =>
        card.card_labels?.some(cl => cl.labels.id === filterLabel)
      )
    }

    // Completed filter
    if (filterCompleted !== null) {
      filtered = filtered.filter(card => card.completed === filterCompleted)
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
    <div className="mb-4 space-y-2">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search cards..."
          className="w-full px-4 py-2 pl-10 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg 
          className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      {/* Filter Toggle & Active Filters */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-3 py-1 text-sm rounded-lg border ${
            hasFilters ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-700'
          }`}
        >
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
          >
            Clear all
          </button>
        )}

        {filterLabel && (
          <span className="px-2 py-1 text-xs bg-gray-200 rounded-full flex items-center gap-1">
            Label: {availableLabels.find(l => l.id === filterLabel)?.name}
            <button onClick={() => setFilterLabel(null)}>×</button>
          </span>
        )}

        {filterCompleted !== null && (
          <span className="px-2 py-1 text-xs bg-gray-200 rounded-full flex items-center gap-1">
            {filterCompleted ? 'Completed' : 'Incomplete'}
            <button onClick={() => setFilterCompleted(null)}>×</button>
          </span>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-3">
          {/* Label Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
            <select
              value={filterLabel || ''}
              onChange={(e) => setFilterLabel(e.target.value || null)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
            >
              <option value="">All labels</option>
              {availableLabels.map(label => (
                <option key={label.id} value={label.id}>{label.name}</option>
              ))}
            </select>
          </div>

          {/* Completed Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterCompleted === null ? '' : filterCompleted.toString()}
              onChange={(e) => {
                if (e.target.value === '') setFilterCompleted(null)
                else setFilterCompleted(e.target.value === 'true')
              }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
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
