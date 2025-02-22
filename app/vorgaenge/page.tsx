"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { Vorgang } from "@/lib/session";

export default function Vorgaenge() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { vorgaenge, addVorgang, vorgaengeLoaded, setLoadedVorgaenge } =
    useSession();

  const handleAddVorgang = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/vorgaenge", {
        method: "POST",
      });

      const data: Vorgang = await response.json();

      if (!response.ok) {
        throw new Error("Failed to create Vorgang");
      }

      addVorgang(data);

      router.push(`/vorgaenge/${data.id}`);
    } catch (error) {
      console.error("Error creating Vorgang:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!vorgaengeLoaded) {
    return (
      <div className="min-h-screen p-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Vorgänge</CardTitle>
              <CardDescription>Liste aller erfassten Vorgänge</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p>Vorgänge werden geladen...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Vorgänge</CardTitle>
            <CardDescription>Liste aller erfassten Vorgänge</CardDescription>
          </div>
          <Button onClick={handleAddVorgang} disabled={isLoading}>
            {isLoading ? "Wird erstellt..." : "Vorgang hinzufügen"}
          </Button>
        </CardHeader>
        <CardContent>
          {vorgaenge.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p>Noch keine Vorgänge erfasst</p>
              <p className="text-sm">
                Klicken Sie auf &quot;Vorgang hinzufügen&quot; um einen neuen
                Vorgang zu erstellen
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {vorgaenge.map((vorgang) => (
                <div
                  key={vorgang.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">Vorgang {vorgang.id}</p>
                    <p className="text-sm text-muted-foreground">TODO</p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/vorgaenge/${vorgang.id}`}>Bearbeiten</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
