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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { VorgangDialog } from "@/app/components/VorgangDialog";

export default function Vorgaenge() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { vorgaenge, addVorgang, vorgaengeLoaded, removeVorgang } =
    useSession();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedVorgang, setSelectedVorgang] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await fetch(`/api/vorgaenge/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete Vorgang");
      }

      removeVorgang(id);
    } catch (error) {
      console.error("Error deleting Vorgang:", error);
    } finally {
      setDeletingId(null);
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
                  <div className="space-y-1">
                    <p className="font-medium">
                      {vorgang.einrichtung?.vorgangsnummer
                        ? `Vorgang ${vorgang.einrichtung.vorgangsnummer}`
                        : `Vorgang ${vorgang.id}`}
                    </p>
                    {vorgang.einrichtung?.ort && (
                      <p className="text-sm text-muted-foreground">
                        Ort: {vorgang.einrichtung.ort}
                      </p>
                    )}
                    {vorgang.einrichtung?.datumBeginn && (
                      <p className="text-sm text-muted-foreground">
                        Datum:{" "}
                        {new Date(
                          vorgang.einrichtung.datumBeginn
                        ).toLocaleDateString("de-DE")}
                        {vorgang.einrichtung.startTime &&
                          ` ${vorgang.einrichtung.startTime} Uhr`}
                      </p>
                    )}
                    {vorgang.betroffener?.name && (
                      <p className="text-sm text-muted-foreground">
                        Betroffene Person: {vorgang.betroffener.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedVorgang(vorgang.id)}
                        className="flex items-center gap-2"
                      >
                        Anzeigen
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/vorgaenge/${vorgang.id}`}>
                          Bearbeiten
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            disabled={deletingId === vorgang.id}
                          >
                            {deletingId === vorgang.id
                              ? "Wird gelöscht..."
                              : "Löschen"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Vorgang löschen</AlertDialogTitle>
                            <AlertDialogDescription>
                              Möchten Sie diesen Vorgang wirklich löschen? Diese
                              Aktion kann nicht rückgängig gemacht werden.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(vorgang.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Löschen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline">
                        Export für NIVADIS erstellen
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedVorgang && (
        <VorgangDialog
          vorgang={vorgaenge.find((v) => v.id === selectedVorgang)!}
          open={Boolean(selectedVorgang)}
          onOpenChange={(open) => !open && setSelectedVorgang(null)}
        />
      )}
    </div>
  );
}
