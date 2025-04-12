import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/Dialog';

interface CreateMindmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (mindmap: { title: string; type: 'Todo' | 'Thinking' }) => void;
}

export function CreateMindmapModal({
  isOpen,
  onClose,
  onCreate,
}: CreateMindmapModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Todo' | 'Thinking'>('Todo');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreate({ title, type });
    setTitle('');
    setType('Todo');
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setTitle('');
          setType('Todo');
        }
      }}
    >
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-xl">
        <div className="bg-white p-6">
          <h2 className="text-2xl font-bold mb-1">마인드맵 생성하기</h2>
          <p className="text-sm text-gray-500 mb-6">
            해야 할 일이나 생각이 떠올랐다면 여기 적어보세요!
            <br />
            질문을 통해 더 깊이 고민할 수 있도록 도와줄게요
          </p>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">
              마인드맵 주제
            </label>
            <input
              type="text"
              placeholder="주제를 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium">
              마인드맵 타입
            </label>
            <div className="flex gap-2">
              {(['Todo', 'Thinking'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-md border text-sm font-medium ${
                    type === t
                      ? 'border-purple-500 text-purple-600'
                      : 'border-gray-300 text-gray-500'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className={`w-full py-2 rounded-md text-white font-medium ${
                title.trim()
                  ? 'bg-black hover:bg-gray-800'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              생성하기
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
