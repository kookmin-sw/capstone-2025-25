'use client';

import { useState } from 'react';
import { Calendar, Star, Tag } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { format } from 'date-fns';
import type { Task } from '@/types/task';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  sectionId: string;
  onCreateTask: (task: Omit<Task, 'id'>) => void;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  sectionTitle,
  sectionId,
  onCreateTask,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [taskType, setTaskType] = useState<'Todo' | 'Thinking'>('Todo');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [memo, setMemo] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) return;

    const newTask: Omit<Task, 'id'> = {
      title,
      memo,
      date: dueDate,
      tags: {
        type: taskType,
        category: category || undefined,
      },
      section: sectionId,
    };

    onCreateTask(newTask);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setTaskType('Todo');
    setCategory('');
    setDueDate('');
    setMemo('');
  };

  const isFormValid = title.trim() !== '';

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          resetForm();
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">{sectionTitle}</p>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="새로운 일정"
                className="text-2xl font-bold border-none p-0 h-auto focus:ring-0 placeholder-gray-300 outline-none w-full"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-sm mr-4">타입</span>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 rounded-full text-xs ${
                    taskType === 'Todo'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                  onClick={() => setTaskType('Todo')}
                >
                  Todo
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-xs ${
                    taskType === 'Thinking'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                  onClick={() => setTaskType('Thinking')}
                >
                  Thinking
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <Tag className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-sm mr-4">카테고리</span>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="비어있음"
                className="h-8 text-sm border rounded-md px-2 outline-none focus:border-purple-300"
              />
            </div>

            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-sm mr-4">마감일</span>
              <div className="relative">
                <input
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="비어있음"
                  className="h-8 text-sm border rounded-md px-2 outline-none focus:border-purple-300"
                  onFocus={() => setShowDatePicker(true)}
                  onBlur={() => setTimeout(() => setShowDatePicker(false), 200)}
                />
                {showDatePicker && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 z-10">
                    {/* Simple date picker UI */}
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 7 }).map((_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i);
                        return (
                          <button
                            key={i}
                            className="w-8 h-8 rounded-full hover:bg-purple-100 flex items-center justify-center text-xs"
                            onClick={() => {
                              setDueDate(format(date, 'yyyy.MM.dd'));
                              setShowDatePicker(false);
                            }}
                          >
                            {format(date, 'd')}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm mb-2">메모</p>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="일정에 관한 메모를 입력하세요."
              className="w-full h-24 p-3 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50"
            >
              취소하기
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                isFormValid
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
