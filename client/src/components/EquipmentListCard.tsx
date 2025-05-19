import { useState } from "react";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EquipmentList, EquipmentItem } from "@/lib/types";
import { db, doc, updateDoc } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EquipmentListCardProps {
  list: EquipmentList;
  onDelete: () => void;
  onToggleItem: (listId: string, itemIndex: number, checked: boolean) => Promise<void>;
}

export default function EquipmentListCard({ list, onDelete, onToggleItem }: EquipmentListCardProps) {
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(list.listTitle);
  const [newItemName, setNewItemName] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleEditList = async () => {
    try {
      await updateDoc(doc(db, "equipmentLists", list.id), {
        listTitle: editTitle,
      });
      setIsEditOpen(false);
      toast({
        title: "List updated",
        description: "Your list has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating list:", error);
      toast({
        title: "Error",
        description: "Could not update the list. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddItem = async () => {
    if (!newItemName.trim()) return;

    try {
      const newItem: EquipmentItem = {
        name: newItemName.trim(),
        checked: false,
      };
      
      await updateDoc(doc(db, "equipmentLists", list.id), {
        items: [...list.items, newItem],
      });
      
      setNewItemName("");
      setIsAddingItem(false);
      
      toast({
        title: "Item added",
        description: "New item has been added to your list.",
      });
    } catch (error) {
      console.error("Error adding item:", error);
      toast({
        title: "Error",
        description: "Could not add the item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getCompletionStatus = () => {
    const totalItems = list.items.length;
    if (totalItems === 0) return "0/0";
    
    const checkedItems = list.items.filter(item => item.checked).length;
    return `${checkedItems}/${totalItems}`;
  };

  return (
    <>
      <Card className="bg-white overflow-hidden shadow-sm rounded-lg h-full flex flex-col">
        <div className="p-5 flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">{list.listTitle}</h3>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsEditOpen(true)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onDelete}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Created on {format(list.createdAt, "MMM d, yyyy")}
          </p>
          
          <div className="mt-4 space-y-2">
            {list.items.map((item, index) => (
              <div key={index} className="flex items-center group">
                <input
                  type="checkbox"
                  id={`item-${list.id}-${index}`}
                  className="sr-only"
                  checked={item.checked}
                  onChange={(e) => onToggleItem(list.id, index, e.target.checked)}
                />
                <label
                  htmlFor={`item-${list.id}-${index}`}
                  className={`relative flex items-center justify-center w-5 h-5 rounded-sm border mr-3 cursor-pointer flex-shrink-0 transition-colors group-hover:border-blue-500 ${
                    item.checked
                      ? "bg-green-500 border-green-500 group-hover:border-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {item.checked && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </label>
                <span className={`text-gray-700 ${item.checked ? "line-through text-gray-400" : ""}`}>
                  {item.name}
                </span>
              </div>
            ))}
            
            {isAddingItem && (
              <div className="flex items-center mt-2">
                <Input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Enter item name"
                  className="flex-grow mr-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddItem();
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={handleAddItem}
                  className="bg-primary text-white hover:bg-blue-700"
                >
                  Add
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{getCompletionStatus()}</span> items packed
            </div>
            <Button
              variant="link"
              onClick={() => setIsAddingItem(!isAddingItem)}
              className="text-sm font-medium text-primary hover:text-blue-700"
            >
              {isAddingItem ? "Cancel" : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add item
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit List</DialogTitle>
            <DialogDescription>
              Change the title of your equipment list.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="List Title"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditList}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
