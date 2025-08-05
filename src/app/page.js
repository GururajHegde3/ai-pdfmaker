"use client";

import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import Link from "next/link";
import { useEffect } from "react";
import { FileText, FolderOpen, Save, Brain } from "lucide-react";
import Image from "next/image";

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
    <div className="min-h-screen bg-gradient-to-r from-white to-blue-100 text-black flex flex-col">
      <header className="w-full py-5 shadow-sm flex justify-between items-center px-8 bg-white border-b border-gray-200">
        <div className="flex items-center">
          <Image
            src="/ai-shiksha-logo.png"
            alt="Ai-Shiksha Logo"
            width={180}
            height={60}
            className="mr-2"
            priority
          />
        </div>
        <UserButton />
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto mt-10 px-4">
        <section className="flex flex-col md:flex-row items-center justify-between mb-16">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-4xl font-bold mb-4 text-blue-900">
              Smart PDF Management with Ai-Shiksha
            </h2>
            <p className="text-xl mb-6 text-gray-700">
              Where Innovation Meets Education - Manage and interact with your
              PDFs using advanced AI technology.
            </p>
            <Link href="/sign-in?redirect_url=/dashboard">
              <Button className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 text-lg">
                Get Started
              </Button>
            </Link>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/ai-shiksha-logo.png"
              alt="Ai-Shiksha"
              width={400}
              height={200}
              className="w-full h-auto"
              priority
            />
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-semibold mb-8 text-center text-blue-900">
            Powerful Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<FileText size={24} />}
              title="Upload PDFs"
              description="Quickly upload and store your PDF files securely."
            />
            <FeatureCard
              icon={<FolderOpen size={24} />}
              title="Organize Files"
              description="Categorize and manage your PDFs with ease."
            />
            <FeatureCard
              icon={<Save size={24} />}
              title="Save PDFs"
              description="Save and access your PDFs anytime, anywhere."
            />
            <FeatureCard
              icon={<Brain size={24} />}
              title="AI-Powered Insights"
              description="Ask questions and get instant answers from your PDFs."
            />
          </div>
        </section>

        <section className="bg-white border border-blue-200 p-8 rounded-lg mb-16 shadow-sm">
          <h3 className="text-2xl font-semibold mb-4 text-blue-900">
            AI-Powered PDF Interaction
          </h3>
          <p className="text-lg mb-6 text-gray-700">
            Our integrated Gemini AI allows you to ask questions about your PDF
            content and receive instant, accurate answers.
          </p>
          <Button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800">
            Try AI Feature
          </Button>
        </section>

        <section className="text-center mb-16">
          <h3 className="text-2xl font-semibold mb-4 text-blue-900">
            Ready to revolutionize your PDF experience?
          </h3>
          <Link href="/sign-in?redirect_url=/dashboard">
            <Button className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 text-lg">
              Start Now
            </Button>
          </Link>
        </section>
      </main>

      <footer className="w-full py-6 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} Ai-Shiksha. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 bg-white border border-blue-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="text-blue-900 mb-4">{icon}</div>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
