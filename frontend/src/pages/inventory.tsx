import { useNavigate } from 'react-router';
import FolderIcon from '@/assets/folder.png';
import { ChevronRight, Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import useGetInventoryFolderList from '@/hooks/queries/inventory/folder/useGetInventoryFolderList';
import useDeleteInventoryFolder from '@/hooks/queries/inventory/folder/useDeleteInventoryFolder';
import CreateFolderModal from '@/components/inventory/modal/CreateFolderMoal';
import DeleteFolderModal from '@/components/inventory/modal/DeleteFolderMoal';
import useUpdateFolderName from '@/hooks/queries/inventory/folder/useUpdateFolderName';

export default function InventoryPage() {
  const navigate = useNavigate();
  const { inventoryFolderList } = useGetInventoryFolderList();
  const { deleteInventoryFolderMutation, isPending: isDeleting } =
    useDeleteInventoryFolder();
  const { updateFolderNameMutation, isPending: isUpdatingFolderName } =
    useUpdateFolderName();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');

  const handleRouteToStoreDetail = (id: number) => {
    if (editingFolderId === null) {
      navigate(`/inventory/${id}`);
    }
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    store: { id: number; name: string },
  ) => {
    e.stopPropagation();
    setFolderToDelete(store);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteFolder = () => {
    if (folderToDelete) {
      deleteInventoryFolderMutation(folderToDelete.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setFolderToDelete(null);
        },
      });
    }
  };

  const handleDeleteModalChange = (open: boolean) => {
    setIsDeleteModalOpen(open);
    if (!open) {
      setFolderToDelete(null);
    }
  };

  const handleEditClick = (
    e: React.MouseEvent,
    store: { id: number; name: string },
  ) => {
    e.stopPropagation();
    setEditingFolderId(store.id);
    setEditingFolderName(store.name);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingFolderId(null);
    setEditingFolderName('');
  };

  const handleUpdateFolderName = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (editingFolderName.trim() === '') return;

    updateFolderNameMutation(
      {
        id,
        data: { name: editingFolderName.trim() },
      },
      {
        onSuccess: () => {
          setEditingFolderId(null);
          setEditingFolderName('');
        },
      },
    );
  };

  const handleFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingFolderName(e.target.value);
  };

  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <div className="flex items-end gap-4 mb-8">
          <h1 className="text-[28px] text-[#525463] font-semibold">
            나의 보관함
          </h1>
          <p className="text-[#525463]">나의 생각을 보관해보세요</p>
        </div>
        <div
          className="bg-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={18} />
        </div>
      </div>

      <CreateFolderModal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      <DeleteFolderModal
        isOpen={isDeleteModalOpen}
        onOpenChange={handleDeleteModalChange}
        onDelete={handleDeleteFolder}
        isPending={isDeleting}
        folderName={folderToDelete?.name}
      />

      <ul className="bg-gray-scale-200 rounded-lg flex flex-col gap-4">
        {inventoryFolderList &&
          inventoryFolderList.map((store) => (
            <li
              key={store.id}
              className="flex items-center justify-between px-8 py-4 bg-white rounded-xl cursor-pointer"
              onClick={() => handleRouteToStoreDetail(store.id)}
            >
              <div className="flex items-center gap-4">
                <img
                  src={FolderIcon}
                  className="w-[37.5px] h-[30px]"
                  alt="폴더"
                />
                {editingFolderId === store.id ? (
                  <input
                    type="text"
                    value={editingFolderName}
                    onChange={handleFolderNameChange}
                    onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
                    className="text-[20px] font-semibold p-1 border border-blue rounded focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <p className="text-[20px] text-[#15161A] font-semibold">
                    {store.name}
                  </p>
                )}
                <p className="text-[#A9ABB8] font-semibold">
                  {store.itemCount}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {editingFolderId === store.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleCancelEdit(e)}
                      className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                    >
                      <X size={18} />
                    </button>
                    <button
                      onClick={(e) => handleUpdateFolderName(e, store.id)}
                      className="px-3 py-1 bg-blue text-white rounded-full text-sm flex items-center"
                      disabled={isUpdatingFolderName}
                    >
                      {isUpdatingFolderName ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          변경 중...
                        </>
                      ) : (
                        '변경'
                      )}
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      className="p-2 hover:bg-gray-100 rounded-full"
                      onClick={(e) =>
                        handleEditClick(e, { id: store.id, name: store.name })
                      }
                    >
                      <Pencil
                        className="text-[#A9ABB8] hover:text-blue-500"
                        size={18}
                      />
                    </div>
                    <div
                      className="p-2 hover:bg-gray-100 rounded-full"
                      onClick={(e) =>
                        handleDeleteClick(e, { id: store.id, name: store.name })
                      }
                    >
                      <Trash2
                        className="text-[#A9ABB8] hover:text-red-500"
                        size={18}
                      />
                    </div>
                    <ChevronRight className="text-[#A9ABB8]" />
                  </>
                )}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
