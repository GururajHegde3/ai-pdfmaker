"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const { user } = useUser();
  const createUser = useMutation(api.user.createUser);

  useEffect(() => {
    if (user) {
      CheckUser();
    }
  }, [user]);

  const CheckUser = async () => {
    try {
      if (!user?.fullName || !user.primaryEmailAddress?.emailAddress) {
        console.error("User details are incomplete.");
        return;
      }

      const result = await createUser({
        email: user.primaryEmailAddress.emailAddress,
        imageUrl: user.imageUrl || "",
        userName: user.fullName.trim() || "Anonymous",
      });

      console.log("User created successfully:", result);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center">
      <header className="w-full py-5 shadow-md flex justify-between items-center px-8 border-b border-gray-300">
        <h1 className="text-3xl font-bold">PDF Taker</h1>
        <UserButton />
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto mt-10 px-4">
        <div className="p-6 text-center border border-gray-300 rounded-md">
          <h2 className="text-2xl font-semibold mb-4">Welcome to PDF Taker</h2>
          <p className="mb-6">
            Easily manage and organize your PDF files. Upload, view, and share
            your PDFs with just a few clicks.
          </p>
          <Link href="/sign-in">
            <Button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-700">
              Get Started
            </Button>
          </Link>
        </div>

        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-300 rounded-md text-center">
            <h3 className="text-lg font-semibold">Upload PDFs</h3>
            <p className="mt-2">
              Quickly upload your PDF files to keep them organized and
              accessible.
            </p>
          </div>
          <div className="p-6 border border-gray-300 rounded-md text-center">
            <h3 className="text-lg font-semibold">Organize Files</h3>
            <p className="mt-2">Categorize and manage your PDF files with ease.</p>
          </div>
          <div className="p-6 border border-gray-300 rounded-md text-center">
            <h3 className="text-lg font-semibold">Share PDFs</h3>
            <p className="mt-2">Seamlessly share your PDFs with others.</p>
          </div>
        </section>
      </main>

      <footer className="w-full py-4 text-center border-t border-gray-300">
        <p>© {new Date().getFullYear()} PDF Taker. All rights reserved.</p>
      </footer>
    </div>
  );
}
