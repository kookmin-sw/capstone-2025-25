import { useEffect, useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
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
import { FileText, Folder, ChevronUp } from 'lucide-react';
import { useResponsive } from '@/hooks/use-mobile'; // 이미 사용 중이라면 OK

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

  const [originalTitle, setOriginalTitle] = useState(item.title);
  const [originalMemo, setOriginalMemo] = useState(item.memo || '');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);

  const { updateInventoryItemMutation, isPending: isUpdating } =
    useUpdateInventoryItem(item.folderId);

  const { deleteInventoryItemMutation, isPending: isDeleting } =
    useDeleteInventoryItem(item.folderId);

  useEffect(() => {
    setIsOpen(initiallyOpen);
  }, [initiallyOpen]);

  useEffect(() => {
    setTitle(item.title);
    setMemo(item.memo || '');
    setOriginalTitle(item.title);
    setOriginalMemo(item.memo || '');
  }, [item]);

  const handleSave = () => {
    const updateData: UpdateInventoryItemReq = {
      title,
      memo,
    };

    updateInventoryItemMutation(
      { id: item.id, data: updateData },
      {
        onSuccess: () => {
          setIsEditable(false);
          setOriginalTitle(title);
          setOriginalMemo(memo);
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

  const handleToggle = (newOpenState: boolean) => {
    if (isEditable && !newOpenState) {
      setTitle(originalTitle);
      setMemo(originalMemo);
      setIsEditable(false);
    }
    setIsOpen(newOpenState);
  };

  const buttonText = isOpen ? '접기' : '메모보기';

  return (
    <>
      <li className="px-6 py-4 bg-white rounded-xl">
        <Collapsible open={isOpen} onOpenChange={handleToggle}>
          <div className="flex items-center justify-between gap-6">
            <div className="overflow-hidden flex flex-col gap-2">
              {/*<div className="w-1/2 overflow-hidden flex flex-col gap-2">*/}
              {isOpen ? (
                <div>
                  {isEditable ? (
                    <Input
                      autoFocus
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="제목을 입력하세요"
                      className="text-[16px] md:text-[20px] text-gray-700 font-semibold px-0 py-0 h-auto border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                    />
                  ) : (
                    <h3 className="text-[16px] md:text-[20px] text-gray-700 font-semibold truncate">
                      {title}
                    </h3>
                  )}
                </div>
              ) : (
                <h3 className="text-[16px] md:text-[20px] text-gray-700 font-semibold truncate">
                  {title}
                </h3>
              )}
              <p className="text-[14px] text-gray-400">
                {formatDate(item.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* 모바일: 아이콘 버튼 */}
              <CollapsibleTrigger asChild>
                <button className="md:hidden px-4 py-2 bg-blue-2 text-blue text-[14px] rounded-full font-semibold flex items-center gap-1 cursor-pointer">
                  {isOpen ? <ChevronUp size={18} /> : <FileText size={18} />}
                </button>
              </CollapsibleTrigger>

              <button
                onClick={() => setIsMoveDialogOpen(true)}
                className="md:hidden px-4 py-[7px] text-blue text-[14px] rounded-full font-semibold flex items-center gap-1 cursor-pointer border-blue border-[1px]"
              >
                <Folder size={18} />
              </button>

              {/* PC: 텍스트 버튼 */}
              <CollapsibleTrigger asChild>
                <button className="hidden md:flex px-4 py-2 bg-blue-2 text-blue text-[16px] rounded-full font-semibold items-center gap-1 cursor-pointer">
                  {buttonText}
                </button>
              </CollapsibleTrigger>

              <button
                onClick={() => setIsMoveDialogOpen(true)}
                className="hidden md:flex px-4 py-[7px] text-blue text-[16px] rounded-full font-semibold items-center gap-1 cursor-pointer border-blue border-[1px]"
              >
                폴더이동
              </button>
            </div>
          </div>

          <CollapsibleContent>
            <div className="w-full bg-gray-scale-200 px-[15px] py-[10px] rounded-lg mt-6 h-[100px]">
              <textarea
                readOnly={!isEditable}
                className="w-full resize-none h-full focus:outline-none focus:ring-0 focus:border-transparent bg-transparent"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="메모를 입력해주세요"
              />
            </div>
            <div className="flex items-center justify-end gap-4 mt-4">
              {isEditable && (
                <button
                  onClick={() => {
                    setTitle(originalTitle);
                    setMemo(originalMemo);
                    setIsEditable(false);
                  }}
                  className="text-gray-500 cursor-pointer"
                >
                  취소
                </button>
              )}
              <button
                onClick={isEditable ? handleSave : handleEdit}
                className="text-blue cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUpdating}
              >
                {isUpdating
                  ? '저장 중...'
                  : isEditable
                    ? '저장하기'
                    : '수정하기'}
              </button>
              <div
                className="cursor-pointer p-2 rounded-full"
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
            <div className="rounded-[7px] px-6 py-[20px] text-[16px] font-medium bg-blue-2 text-gray-700">
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
