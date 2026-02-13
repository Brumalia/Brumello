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
  const router = useRouter()
  const supabase = createClient()

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

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {lists.map((list) => (
            <div
              key={list.id}
              className="bg-gray-100 rounded-lg p-4 min-w-[300px] max-w-[300px]"
            >
              <ListHeader
                listId={list.id}
                title={list.title}
                cardsCount={list.cards?.length || 0}
              />
              
              <SortableContext
                items={list.cards.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 min-h-[50px]">
                  {list.cards?.map((card) => (
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
            <div className="bg-white rounded-lg p-3 shadow-xl rotate-3 cursor-grabbing opacity-90">
              <p className="text-sm text-gray-900">{activeCard.title}</p>
              {activeCard.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
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
