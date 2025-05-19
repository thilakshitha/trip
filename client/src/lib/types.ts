export interface EquipmentItem {
  id?: string;
  name: string;
  checked: boolean;
}

export interface EquipmentList {
  id: string;
  userId: string;
  listTitle: string;
  createdAt: Date;
  items: EquipmentItem[];
}

export interface TripInspirationItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}
