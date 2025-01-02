"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";

export default function Home() {
  const { user } = useUser();
  const createUser = useMutation(api.user.createUser);

  // Ensure `CheckUser` runs only when `user` is fully available
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
        imageUrl: user.imageUrl || "", // Provide a default if `imageUrl` is null
        userName: user.fullName.trim() || "Anonymous", // Provide a fallback if `fullName` is empty
      });

      console.log("User created successfully:", result);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div>
      <h1>Hello World</h1>
      <Button>Click me</Button>
      <UserButton />
    </div>
  );
}
