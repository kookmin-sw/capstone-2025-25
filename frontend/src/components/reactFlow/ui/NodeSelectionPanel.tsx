import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronUp, Loader2, X } from 'lucide-react';
import {
  useClearSelectedNodes,
  useRemoveSelectedNode,
  useSelectedNodes,
  useToggleNodeSelectionMode,
} from '@/store/nodeSelection';
import useConvertScheduleToTodo from '@/hooks/queries/mindmap/useConvertScheduleToTodo';
import { ConvertedToTaskReq } from '@/types/api/mindmap';

export function NodeSelectionPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const selectedNodes = useSelectedNodes();
  const removeSelectedNode = useRemoveSelectedNode();
  const clearSelectedNodes = useClearSelectedNodes();
  const toggleNodeSelectionMode = useToggleNodeSelectionMode();

  const { convertScheduleToTodoMutation, isPending } =
    useConvertScheduleToTodo();

  const handleCancelSelection = () => {
    clearSelectedNodes();
    toggleNodeSelectionMode();
  };

  const handleCreateSchedule = () => {
    console.log('선택된 노드로 일정 생성:', selectedNodes);

    const requestData: ConvertedToTaskReq = {
      selectedNodes: selectedNodes.map((node) => ({
        summary: node.data.summary || node.data.label,
      })),
    };

    /* 아이젠하워 개발 완료되면, 연결 시키는 부분 개발할 예정 */
    convertScheduleToTodoMutation(requestData, {
      onSuccess: (data) => {
        console.log('data', data);

        clearSelectedNodes();
        toggleNodeSelectionMode();
      },
      onError: (error) => {
        console.error('할 일 생성 중 오류가 발생했습니다:', error);
      },
    });
  };

  return (
    <div className="w-[481px] fixed top-4 right-4 bg-white p-4 rounded-lg shadow-md border border-gray-200 z-[9999]">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-bold mb-2">일정으로 생성할 노드 선택</div>
            <p className="text-sm text-gray-500">
              노드를 선택하여 하나의 일정으로 생성해 보세요
            </p>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="p-0 h-8 w-8">
              <ChevronUp
                className={`h-5 w-5 transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`}
              />
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          {selectedNodes.length > 0 ? (
            <ul className="flex-col space-y-2 mb-4">
              {selectedNodes.map((node) => (
                <li
                  key={node.id}
                  className="flex items-center justify-between border border-border-gray px-[20px] py-[15px] rounded-md"
                >
                  <p>{node.data.summary || node.data.label}</p>
                  <X
                    size={20}
                    color="#6e726e"
                    className="cursor-pointer hover:bg-gray-100 rounded-full p-1 transition-colors"
                    onClick={() => removeSelectedNode(node.id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-4 mb-4 text-gray-500">
              선택된 노드가 없습니다. 노드를 클릭하여 선택해주세요.
            </div>
          )}

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancelSelection}
            >
              취소하기
            </Button>
            <Button
              className="flex-1"
              onClick={handleCreateSchedule}
              disabled={selectedNodes.length === 0 || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />할 일 생성
                  중...
                </>
              ) : (
                '생성하기'
              )}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
