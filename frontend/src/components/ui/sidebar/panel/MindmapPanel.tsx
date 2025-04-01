import { useState } from 'react';
import CommonPanelWrapper from './CommonPanelWrapper';
import { ChevronDown, ChevronRight, Link2, Shuffle } from 'lucide-react';
import MindmapCard from '@/components/ui/sidebar/MindmapCard';

export default function MindmapPanel({ onClose }: { onClose: () => void }) {
  const [accordionOpen, setAccordionOpen] = useState({
    connected: false,
    free: true,
  });
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleCardSelect = (id: string) => {
    setSelectedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <CommonPanelWrapper title="마인드맵" onClose={onClose}>
      {/* 연결된 마인드맵 */}
      <div>
        <button
          className="flex items-center w-full justify-between text-left font-semibold mb-2 cursor-pointer"
          onClick={() =>
            setAccordionOpen((prev) => ({
              ...prev,
              connected: !prev.connected,
            }))
          }
        >
          <span className="flex items-center gap-2">
            <Link2 size={16} /> 연결된 마인드맵
          </span>
          {accordionOpen.connected ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>
        {accordionOpen.connected && (
          <div className="space-y-4">
            <MindmapCard
              title="개인 계획"
              selected={selectedCardId === 'card-1'}
              onClick={() => handleCardSelect('card-1')}
            />
            <MindmapCard
              title="정리하기"
              selected={selectedCardId === 'card-2'}
              onClick={() => handleCardSelect('card-2')}
            />
          </div>
        )}
      </div>

      {/* 자유로운 마인드맵 */}
      <div className="mt-6">
        <button
          className="flex items-center w-full justify-between text-left font-semibold mb-2"
          onClick={() =>
            setAccordionOpen((prev) => ({ ...prev, free: !prev.free }))
          }
        >
          <span className="flex items-center gap-2">
            <Shuffle size={16} /> 자유로운 마인드맵
          </span>
          {accordionOpen.free ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>
        {accordionOpen.free && (
          <div className="space-y-4">
            <MindmapCard
              title="개인 계획"
              selected={selectedCardId === '3'}
              onClick={() => handleCardSelect('3')}
            />
            <MindmapCard
              title="정리하기"
              selected={selectedCardId === '4'}
              onClick={() => handleCardSelect('4')}
            />
            <MindmapCard
              title="생각입니다"
              status="Thinking"
              selected={selectedCardId === '5'}
              onClick={() => handleCardSelect('5')}
            />
          </div>
        )}
      </div>
    </CommonPanelWrapper>
  );
}
