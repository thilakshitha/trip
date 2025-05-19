import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu, User, Settings, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Navbar() {
  const { currentUser, logOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await logOut();
      setLocation("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-xl font-bold text-primary flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-2xl h-6 w-6"
              >
                <path d="M20 6h-4a2 2 0 0 1-2-2c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2c0 1.1-.9 2-2 2Z" />
                <path d="M14 6h-4a2 2 0 0 1-2-2c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2c0 1.1-.9 2-2 2Z" />
                <path d="M8 6H4a2 2 0 0 1-2-2c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2c0 1.1-.9 2-2 2Z" />
                <path d="M18 22H6a2 2 0 0 1-2-2V9h16v11a2 2 0 0 1-2 2Z" />
                <path d="M9 14v1" />
                <path d="M15 14v1" />
                <path d="M9 18v1" />
                <path d="M15 18v1" />
              </svg>
              TripPrep
            </h1>
          </div>
          <div className="flex items-center">
            {currentUser && (
              <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-primary text-white">
                      <span className="sr-only">Open user menu</span>
                      {currentUser.displayName?.[0].toUpperCase() || "U"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-4 py-2 text-xs text-gray-500">
                      {currentUser.email}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Your Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <div className="ml-3 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && currentUser && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <a href="/dashboard" className="block pl-3 pr-4 py-2 border-l-4 border-primary text-base font-medium text-primary bg-blue-50">
              Dashboard
            </a>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                  {currentUser.displayName?.[0].toUpperCase() || "U"}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {currentUser.displayName || "User"}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {currentUser.email}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <a
                href="#profile"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Your Profile
              </a>
              <a
                href="#settings"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
