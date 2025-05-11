import { useNavigate } from 'react-router';
import FolderIcon from '@/assets/folder.png';
import { ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import useGetInventoryFolderList from '@/hooks/queries/inventory/folder/useGetInventoryFolderList';
import useCreateInventoryFolder from '@/hooks/queries/inventory/folder/useCreateInventoryFolder';
import useDeleteInventoryFolder from '@/hooks/queries/inventory/folder/useDeleteInventoryFolder';
import CreateFolderModal from '@/components/inventory/modal/CreateFolderMoal';
import DeleteFolderModal from '@/components/inventory/modal/DeleteFolderMoal';

export default function StorePage() {
  const navigate = useNavigate();
  const { inventoryFolderList } = useGetInventoryFolderList();
  const { createInventoryFolderMutation, isPending: isCreating } =
    useCreateInventoryFolder();
  const { deleteInventoryFolderMutation, isPending: isDeleting } =
    useDeleteInventoryFolder();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const handleRouteToStoreDetail = (id: number) => {
    navigate(`/inventory/${id}`);
  };

  const handleCreateFolder = (name: string) => {
    createInventoryFolderMutation(
      { name },
      {
        onSuccess: () => {
          setIsCreateModalOpen(false);
        },
      },
    );
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
        onSubmit={handleCreateFolder}
        isPending={isCreating}
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
                <p className="text-[20px] text-[#15161A] font-semibold">
                  {store.name}
                </p>
                <p className="text-[#A9ABB8] font-semibold">
                  {store.itemCount}
                </p>
              </div>
              <div className="flex items-center gap-4">
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
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
