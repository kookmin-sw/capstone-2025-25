import { useEffect, useState } from 'react';
import { Trash2, Loader2, FolderInput } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import { Input } from '@/components/ui/Input';
import useUpdateInventoryItem from '@/hooks/queries/inventory/item/useUpdateInventoryItem';
import { UpdateInventoryItemReq } from '@/types/api/inventory/item';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';
import useDeleteInventoryItem from '@/hooks/queries/inventory/item/useDeleteInventoryItem';
import MoveToFolderModal from '@/components/inventory/modal/MoveToFolderModal';

type InventoryItemCardProps = {
  item: {
    id: number;
    title: string;
    memo: string;
    createdAt: string;
    folderId: number;
  };
  initiallyOpen?: boolean;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return '날짜 정보 없음';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekDay = weekDays[date.getDay()];

  return `${year}.${month}.${day} (${weekDay})`;
};

export default function InventoryItemCard({
  item,
  initiallyOpen = false,
}: InventoryItemCardProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [title, setTitle] = useState(item.title);
  const [memo, setMemo] = useState(item.memo || '');
  const [isEditable, setIsEditable] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);

  const { updateInventoryItemMutation, isPending: isUpdating } =
    useUpdateInventoryItem(item.folderId);

  const { deleteInventoryItemMutation, isPending: isDeleting } =
    useDeleteInventoryItem(item.folderId);

  useEffect(() => {
    setIsOpen(initiallyOpen);
  }, [initiallyOpen]);


  const handleSave = () => {
    const updateData: UpdateInventoryItemReq = {
      title,
      memo,
    };

    updateInventoryItemMutation(
      { id: item.id, data: updateData },
      {
        onSuccess: () => {
          // setIsOpen(false);
          setIsEditable(false);
        },
      },
    );
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleDelete = () => {
    deleteInventoryItemMutation(item.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const buttonText = isOpen ? '접기' : '메모보기';

  return (
    <>
      <li className="p-6 bg-white rounded-xl">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <div className="w-1/2">
              {isOpen ? (
                <div className="pb-2">
                  {isEditable ? (
                    <Input
                      autoFocus
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="제목을 입력하세요"
                      className="!text-[20px] text-gray-700 font-semibold px-0 py-0 h-auto border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                    />
                  ) : (
                      <h3 className="text-[20px] text-gray-700 font-semibold pb-2">
                        {title}
                      </h3>
                  )}
                </div>
              ) : (
                <h3 className="text-[20px] text-gray-700 font-semibold pb-2">
                  {title}
                </h3>
              )}
              <p className="text-sm text-gray-400">
                {formatDate(item.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setIsMoveDialogOpen(true)}
                className="px-4 py-[7px] text-blue rounded-full font-semibold flex items-center gap-1 cursor-pointer border-blue border-[1px]"
              >
                {/*<FolderInput size={16} className="mr-1" />*/}
                폴더이동
              </button>

              <CollapsibleTrigger asChild>
                <button className="px-4 py-2 bg-blue-2 text-blue rounded-full font-semibold flex items-center gap-1 cursor-pointer ">
                  {buttonText}
                </button>
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent>
            <div className="w-full bg-gray-scale-200 px-[15px] py-[10px] rounded-lg mt-6 h-[100px]">
              <textarea
                  readOnly={!isEditable}
                  className="w-full resize-none h-full focus:outline-none focus:ring-0 focus:border-transparent"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="메모를 입력해주세요"
              />
            </div>
            <div className="flex items-center justify-end gap-4 mt-4">
              <button
                onClick={isEditable ? handleSave : handleEdit}
                className="text-blue cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUpdating}
              >
                {isUpdating ? '저장 중...' : isEditable ? '저장하기' : '수정하기'}
              </button>
              <div
                className="cursor-pointer p-2  rounded-full"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 size={21} color="#CDCED6" className="" />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </li>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>항목 삭제</DialogTitle>
            <DialogDescription>
              이 항목을 정말 삭제하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <div className="">
            <div className="rounded-[7px] px-6 py-[20px] text-[16px] font-medium  bg-blue-2 ">
              <p>"{title}" 항목이 영구적으로 삭제됩니다.</p>
              <p className="">이 작업은 되돌릴 수 없습니다.</p>
            </div>
          </div>
          <DialogFooter>
            <div className="w-full flex items-center justify-end gap-2">
              <Button
                onClick={() => setIsDeleteDialogOpen(false)}
                variant="outline"
              >
                취소
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-blue text-white"
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    삭제 중...
                  </div>
                ) : (
                  '삭제하기'
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 폴더 이동 모달 */}
      <MoveToFolderModal
        isOpen={isMoveDialogOpen}
        onOpenChange={setIsMoveDialogOpen}
        item={{
          id: item.id,
          title,
          folderId: item.folderId,
        }}
      />
    </>
  );
}
