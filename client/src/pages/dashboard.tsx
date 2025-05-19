import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import EquipmentListCard from "@/components/EquipmentListCard";
import EmptyState from "@/components/EmptyState";
import CreateListModal from "@/components/CreateListModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import TripInspiration from "@/components/TripInspiration";
import { useAuth } from "@/lib/hooks/useAuth";
import { EquipmentList } from "@/lib/types";
import { db, collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [equipmentLists, setEquipmentLists] = useState<EquipmentList[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<EquipmentList | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "equipmentLists"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const lists: EquipmentList[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId,
            listTitle: data.listTitle,
            createdAt: data.createdAt?.toDate() || new Date(),
            items: data.items || [],
          };
        });
        setEquipmentLists(lists);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching equipment lists:", error);
        toast({
          title: "Error",
          description: "Could not load your equipment lists. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser, toast]);

  const handleDeleteList = (list: EquipmentList) => {
    setSelectedList(list);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteList = async () => {
    if (!selectedList) return;

    try {
      await deleteDoc(doc(db, "equipmentLists", selectedList.id));
      setIsDeleteModalOpen(false);
      setSelectedList(null);
      toast({
        title: "List deleted",
        description: "Your list has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting list:", error);
      toast({
        title: "Error",
        description: "Could not delete the list. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleItemChecked = async (listId: string, itemIndex: number, checked: boolean) => {
    try {
      const listRef = doc(db, "equipmentLists", listId);
      const list = equipmentLists.find((list) => list.id === listId);
      
      if (!list) return;
      
      const updatedItems = [...list.items];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], checked };
      
      await updateDoc(listRef, { items: updatedItems });
    } catch (error) {
      console.error("Error toggling item:", error);
      toast({
        title: "Error",
        description: "Could not update the item. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
            <div 
              className="h-40 bg-gradient-to-r from-blue-400 to-blue-600 flex items-end"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&h=500')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="w-full h-full bg-gradient-to-t from-black/50 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h1 className="text-2xl font-bold">Welcome, {currentUser?.displayName?.split(' ')[0] || 'Traveler'}!</h1>
                  <p className="text-white/80">Manage your trip equipment lists</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-xl font-bold text-gray-800">Your Trip Equipment Lists</h2>
              <p className="text-sm text-gray-600">Create and manage packing lists for your adventures</p>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <Plus className="mr-1 h-4 w-4" />
              Create New List
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white overflow-hidden shadow-sm rounded-lg h-48 animate-pulse">
                  <div className="p-5 h-full">
                    <div className="flex justify-between items-start">
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                      <div className="flex space-x-1">
                        <div className="h-6 w-6 bg-gray-200 rounded"></div>
                        <div className="h-6 w-6 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
                    <div className="mt-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : equipmentLists.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {equipmentLists.map((list) => (
                <EquipmentListCard
                  key={list.id}
                  list={list}
                  onDelete={() => handleDeleteList(list)}
                  onToggleItem={toggleItemChecked}
                />
              ))}
            </div>
          ) : (
            <EmptyState onCreateList={() => setIsCreateModalOpen(true)} />
          )}

          <TripInspiration />
        </div>
      </div>

      <CreateListModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        userId={currentUser?.uid || ""}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteList}
      />
    </Layout>
  );
}
