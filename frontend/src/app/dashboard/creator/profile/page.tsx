"use client";

import { useSession } from "@/components/SessionContextProvider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CreatorDashboardProfilePage() {
  const { session, supabase } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error logging out: " + error.message);
    } else {
      toast.success("Logged out successfully!");
      router.push("/auth/login");
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-xl border border-gray-200 text-center">
        <h1 className="text-4xl font-bold text-purple-800 mb-6">Creator Dashboard</h1>
        <p className="text-lg text-gray-700 mb-4">Welcome, {session.user.email}!</p>
        <p className="text-md text-gray-600 mb-8">This is your profile page. More features coming soon!</p>
        <Button onClick={handleLogout} variant="destructive" className="px-6 py-3 text-lg rounded-full shadow-lg">
          Logout
        </Button>
      </div>
    </div>
  );
}