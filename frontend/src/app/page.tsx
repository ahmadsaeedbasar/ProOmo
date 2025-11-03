import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 text-gray-800 p-4">
      <h1 className="text-5xl md:text-7xl font-extrabold text-center text-purple-800 mb-6 leading-tight">
        ProOmo
      </h1>
      <p className="text-xl md:text-2xl text-center max-w-2xl mb-10 text-gray-600">
        Connect with top creators and brands for impactful promotions.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="px-8 py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
          <Link href="/auth/register">
            Get Started
          </Link>
        </Button>
        <Button asChild variant="outline" className="px-8 py-3 text-lg border-purple-600 text-purple-600 hover:bg-purple-100 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
          <Link href="/creators">
            Explore Creators
          </Link>
        </Button>
      </div>
    </div>
  );
}