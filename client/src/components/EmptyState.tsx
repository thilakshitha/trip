import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateList: () => void;
}

export default function EmptyState({ onCreateList }: EmptyStateProps) {
  return (
    <div className="col-span-1 sm:col-span-3 bg-white overflow-hidden shadow-sm rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center">
      <img
        src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200"
        alt="Camping equipment neatly arranged"
        className="w-40 h-40 object-cover rounded-lg mb-4"
      />
      <h3 className="text-lg font-medium text-gray-900">Create your first equipment list</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-md">
        Start organizing your trips by creating a checklist of items you need to pack
      </p>
      <Button
        onClick={onCreateList}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <Plus className="mr-1 h-4 w-4" />
        Create New List
      </Button>
    </div>
  );
}
