import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, CheckSquare } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { db, collection, addDoc, serverTimestamp } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function CreateListModal({ isOpen, onClose, userId }: CreateListModalProps) {
  const { toast } = useToast();
  const [listTitle, setListTitle] = useState("");
  const [items, setItems] = useState([{ name: "", checked: false }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddItem = () => {
    setItems([...items, { name: "", checked: false }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index].name = value;
    setItems(newItems);
  };

  const handleCreateList = async () => {
    if (!listTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a list title.",
        variant: "destructive",
      });
      return;
    }

    // Filter out empty items
    const validItems = items.filter(item => item.name.trim() !== "");

    if (validItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to your list.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "equipmentLists"), {
        userId,
        listTitle: listTitle.trim(),
        createdAt: serverTimestamp(),
        items: validItems.map(item => ({ name: item.name.trim(), checked: false })),
      });

      toast({
        title: "Success",
        description: "Equipment list created successfully.",
      });

      // Reset form
      setListTitle("");
      setItems([{ name: "", checked: false }]);
      onClose();
    } catch (error) {
      console.error("Error creating equipment list:", error);
      toast({
        title: "Error",
        description: "Could not create the list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setListTitle("");
    setItems([{ name: "", checked: false }]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CheckSquare className="mr-2 h-5 w-5 text-blue-600" />
            Create New Equipment List
          </DialogTitle>
          <DialogDescription>
            Create a new list to help organize your trip items.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="list-title" className="text-sm font-medium text-gray-700">
              List Title
            </label>
            <Input
              id="list-title"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              placeholder="e.g. Camping Trip, Beach Vacation"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Initial Items</label>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={item.name}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    placeholder="Item name"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length === 1}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddItem}
              className="mt-2 w-full sm:w-auto"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Another Item
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateList} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create List"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
