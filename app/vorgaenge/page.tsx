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
import { PlusCircle, ChevronRight } from "lucide-react";

export default function Vorgaenge() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { vorgaenge, addVorgang, vorgaengeLoaded } = useSession();

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

  return (
    <div className="min-h-screen p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Vorgänge</CardTitle>
              <CardDescription>
                Übersicht aller Durchsuchungs- und Sicherstellungsprotokolle
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/vorgaenge/neu">
                <PlusCircle className="h-4 w-4 mr-2" />
                Neuer Vorgang
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!vorgaengeLoaded ? (
            <div className="text-center py-8 text-muted-foreground">
              Vorgänge werden geladen...
            </div>
          ) : vorgaenge.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Keine Vorgänge vorhanden. Erstellen Sie einen neuen Vorgang.
            </div>
          ) : (
            <div className="space-y-4">
              {vorgaenge.map((vorgang) => (
                <Link
                  key={vorgang.id}
                  href={`/vorgaenge/${vorgang.id}`}
                  className="block"
                >
                  <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium">
                        {vorgang.einrichtung?.vorgangsnummer || "Ohne Nummer"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {vorgang.einrichtung?.ort || "Kein Ort"} -{" "}
                        {vorgang.einrichtung?.datumBeginn || "Kein Datum"}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
