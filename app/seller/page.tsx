"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSeller } from "@/lib/seller-context";
import SellerDashboardContent from "./seller-dashboard-content";

export default function SellerPage() {
  const router = useRouter();
  const { seller, isSellerLoggedIn } = useSeller();

  useEffect(() => {
    if (!isSellerLoggedIn || !seller) {
      router.push("/login");
    }
  }, [isSellerLoggedIn, seller, router]);

  if (!isSellerLoggedIn || !seller) {
    return null; // or a loading state
  }

  return <SellerDashboardContent />;
}
