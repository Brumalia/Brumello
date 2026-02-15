'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import ListHeader from './ListHeader'
import CreateCardButton from './CreateCardButton'
import CreateListButton from './CreateListButton'
import CardModal from './CardModal'
import DraggableCard from './DraggableCard'
import SearchFilter from './SearchFilter'

interface Label {
  id: string
  name: string
  color: string
}

interface Card {
  id: string
  title: string
  description: string | null
  due_date: string | null
  completed: boolean
  background_color: string | null
  list_id: string
  position: number
  card_labels?: Array<{ labels: Label }>
}

interface List {
  id: string
  title: string
  cards: Card[]
}

interface BoardContentProps {
  lists: List[]
  boardId: string
}

export default function BoardContent({ lists: initialLists, boardId }: BoardContentProps) {
  const [lists, setLists] = useState(initialLists)
  const [activeCard, setActiveCard] = useState<Card | null>(null)
  const [selectedCard, setSelectedCard] = useState<{ card: Card; listTitle: string } | null>(null)
  const [showCompleted, setShowCompleted] = useState(true)
  const [searchFilter, setSearchFilter] = useState<Card[] | null>(null)
  const router = useRouter()
  const supabase = createClient() as any

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const findListByCardId = (cardId: string) => {
    return lists.find((list) => list.cards.some((card) => card.id === cardId))
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const list = findListByCardId(active.id as string)
    const card = list?.cards.find((c) => c.id === active.id)
    setActiveCard(card || null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeCardId = active.id as string
    const overCardId = over.id as string

    if (activeCardId === overCardId) return

    const activeList = findListByCardId(activeCardId)
    const overList = findListByCardId(overCardId)

    if (!activeList || !overList) return

    setLists((lists) => {
      const activeListIndex = lists.findIndex((l) => l.id === activeList.id)
      const overListIndex = lists.findIndex((l) => l.id === overList.id)

      const activeCards = lists[activeListIndex].cards
      const overCards = lists[overListIndex].cards

      const activeCardIndex = activeCards.findIndex((c) => c.id === activeCardId)
      const overCardIndex = overCards.findIndex((c) => c.id === overCardId)

      let newLists = [...lists]

      if (activeListIndex === overListIndex) {
        // Same list - reorder
        newLists[activeListIndex].cards = arrayMove(
          activeCards,
          activeCardIndex,
          overCardIndex
        )
      } else {
        // Different lists - move between lists
        const [movedCard] = activeCards.splice(activeCardIndex, 1)
        movedCard.list_id = overList.id
        overCards.splice(overCardIndex, 0, movedCard)
        
        newLists[activeListIndex].cards = activeCards
        newLists[overListIndex].cards = overCards
      }

      return newLists
    })
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)

    if (!over) return

    const activeCardId = active.id as string
    const activeList = findListByCardId(activeCardId)
    
    if (!activeList) return

    // Update positions in database
    const cardsToUpdate = activeList.cards.map((card, index) => ({
      id: card.id,
      list_id: card.list_id,
      position: index,
    }))

    // Batch update positions
    for (const card of cardsToUpdate) {
      await supabase
        .from('cards')
        .update({ position: card.position, list_id: card.list_id })
        .eq('id', card.id)
    }

    // Also update cards in the other list if moved between lists
    const overList = findListByCardId(over.id as string)
    if (overList && overList.id !== activeList.id) {
      const overCardsToUpdate = overList.cards.map((card, index) => ({
        id: card.id,
        position: index,
      }))

      for (const card of overCardsToUpdate) {
        await supabase
          .from('cards')
          .update({ position: card.position })
          .eq('id', card.id)
      }
    }

    router.refresh()
  }

  // Get all cards from all lists for search
  const getAllCards = (): Card[] => {
    return lists.flatMap(list => list.cards || [])
  }

  // Filter cards based on completion status and search
  const getFilteredCards = (cards: Card[]) => {
    let filtered = cards
    
    // Apply search filter if active
    if (searchFilter) {
      const searchIds = new Set(searchFilter.map(c => c.id))
      filtered = filtered.filter(card => searchIds.has(card.id))
    }
    
    // Apply completion filter
    if (!showCompleted) {
      filtered = filtered.filter(card => !card.completed)
    }
    
    return filtered
  }

  return (
    <>
      {/* Search & Filter */}
      <SearchFilter 
        cards={getAllCards()} 
        onFilter={(filtered) => setSearchFilter(filtered)} 
      />

      {/* Archive Toggle */}
      <div 
        style={{
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#e2e8e4',
            backgroundColor: '#142024',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#1a2a30'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#142024'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.3)'
          }}
        >
          {showCompleted ? (
            <>
              <svg 
                style={{ width: '16px', height: '16px' }} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Hide Completed
            </>
          ) : (
            <>
              <svg 
                style={{ width: '16px', height: '16px' }} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              Show Completed
            </>
          )}
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div 
          style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            paddingBottom: '16px'
          }}
        >
          {lists.map((list) => (
            <div
              key={list.id}
              style={{
                backgroundColor: '#142024',
                borderRadius: '14px',
                padding: '16px',
                minWidth: '300px',
                maxWidth: '300px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.04)'
              }}
            >
              <ListHeader
                listId={list.id}
                title={list.title}
                cardsCount={list.cards?.length || 0}
              />
              
              <SortableContext
                items={getFilteredCards(list.cards).map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div 
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    minHeight: '50px'
                  }}
                >
                  {getFilteredCards(list.cards)?.map((card) => (
                    <DraggableCard
                      key={card.id}
                      card={card}
                      onClick={() => setSelectedCard({ card, listTitle: list.title })}
                    />
                  ))}
                </div>
              </SortableContext>
              
              <CreateCardButton listId={list.id} cardsCount={list.cards?.length || 0} />
            </div>
          ))}
          
          <CreateListButton boardId={boardId} listsCount={lists.length} />
        </div>

        <DragOverlay>
          {activeCard ? (
            <div 
              style={{
                backgroundColor: '#142024',
                borderRadius: '10px',
                padding: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
                transform: 'rotate(3deg)',
                cursor: 'grabbing',
                opacity: 0.9,
                border: '1px solid rgba(255,255,255,0.07)'
              }}
            >
              <p 
                style={{
                  fontSize: '14px',
                  color: '#e2e8e4',
                  margin: 0
                }}
              >
                {activeCard.title}
              </p>
              {activeCard.description && (
                <p 
                  style={{
                    fontSize: '12px',
                    color: '#8a9b91',
                    marginTop: '4px',
                    marginBottom: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {activeCard.description}
                </p>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedCard && (
        <CardModal
          card={selectedCard.card}
          listTitle={selectedCard.listTitle}
          boardId={boardId}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </>
  )
}
