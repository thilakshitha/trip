import { TripInspirationItem } from "@/lib/types";

const inspirationItems: TripInspirationItem[] = [
  {
    id: 1,
    title: "Beach Getaway",
    description: "Relax on pristine shores",
    imageUrl: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  },
  {
    id: 2,
    title: "Mountain Trails",
    description: "Explore scenic hiking routes",
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  },
  {
    id: 3,
    title: "Cabin Retreat",
    description: "Disconnect in nature",
    imageUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  },
  {
    id: 4,
    title: "Desert Adventure",
    description: "Explore unique landscapes",
    imageUrl: "https://images.unsplash.com/photo-1542401886-65d6c61db217?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  },
  {
    id: 5,
    title: "City Exploration",
    description: "Discover urban treasures",
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  },
  {
    id: 6,
    title: "Island Paradise",
    description: "Escape to tropical serenity",
    imageUrl: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
  },
];

export default function TripInspiration() {
  return (
    <div className="mt-12 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Trip Inspiration</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {inspirationItems.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg shadow h-64 transition-transform hover:scale-[1.02]"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm opacity-80">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
