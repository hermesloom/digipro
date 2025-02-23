"use client";

import { useSession } from "@/contexts/SessionContext";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

function LoadingSpinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-4 w-4 animate-spin", className)} />;
}

export default function VorgaengeLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setSetup, vorgaengeLoaded, setLoadedVorgaenge } = useSession();

  useEffect(() => {
    const loadVorgaenge = async () => {
      if (vorgaengeLoaded) return;

      try {
        const response = await fetch("/api/vorgaenge");
        if (!response.ok) {
          throw new Error("Failed to fetch Vorgänge");
        }

        const { setup, vorgaenge } = await response.json();
        setSetup(setup);
        setLoadedVorgaenge(vorgaenge);
      } catch (error) {
        console.error("Error loading Vorgänge:", error);
      }
    };

    loadVorgaenge();
  }, [vorgaengeLoaded, setLoadedVorgaenge]);

  if (!vorgaengeLoaded) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner className="h-8 w-8" />
          <p className="text-muted-foreground text-lg">Lade Vorgänge...</p>
        </div>
      </div>
    );
  }

  return children;
}
