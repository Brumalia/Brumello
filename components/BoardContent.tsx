'use client'

import { useState } from 'react'
import ListHeader from './ListHeader'
import CreateCardButton from './CreateCardButton'
import CreateListButton from './CreateListButton'
import CardModal from './CardModal'

interface Card {
  id: string
  title: string
  description: string | null
  due_date: string | null
  completed: boolean
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

export default function BoardContent({ lists, boardId }: BoardContentProps) {
  const [selectedCard, setSelectedCard] = useState<{ card: Card; listTitle: string } | null>(null)

  return (
    <>
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
            
            <div className="space-y-2">
              {list.cards?.map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedCard({ card, listTitle: list.title })}
                  className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <p className="text-sm text-gray-900">{card.title}</p>
                  {card.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {card.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
            
            <CreateCardButton listId={list.id} cardsCount={list.cards?.length || 0} />
          </div>
        ))}
        
        <CreateListButton boardId={boardId} listsCount={lists.length} />
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard.card}
          listTitle={selectedCard.listTitle}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </>
  )
}
