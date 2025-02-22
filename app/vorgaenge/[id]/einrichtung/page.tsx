"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "@/contexts/SessionContext";
import { Vorgang } from "@/lib/session";
import { useVorgang } from "@/contexts/SessionContext";

export default function Einrichtung() {
  const today = new Date().toISOString().split("T")[0];
  const router = useRouter();
  const { updateVorgang } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const vorgang = useVorgang();

  const [formData, setFormData] = useState({
    vorgangsnummer: vorgang?.einrichtung?.vorgangsnummer || "",
    ort: vorgang?.einrichtung?.ort || "",
    datum: vorgang?.einrichtung?.datum || today,
    startTime: vorgang?.einrichtung?.startTime || "",
    endTime: vorgang?.einrichtung?.endTime || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedVorgang: Vorgang = {
        ...vorgang!,
        einrichtung: {
          ...formData,
        },
      };

      const response = await fetch(`/api/vorgaenge/${vorgang.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVorgang),
      });

      if (!response.ok) {
        throw new Error("Failed to update vorgang");
      }

      const data = await response.json();
      updateVorgang(vorgang.id, data);
      router.push(`/vorgaenge/${vorgang.id}`);
    } catch (error) {
      console.error("Error updating vorgang:", error);
      // Here you might want to show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!vorgang) {
    return null;
  }

  return (
    <div className="min-h-screen p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-4">
          <Button variant="ghost" asChild className="w-fit -ml-2">
            <Link
              href={`/vorgaenge/${vorgang.id}`}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück
            </Link>
          </Button>
          <div>
            <CardTitle>Einrichtung</CardTitle>
            <CardDescription>
              Erfassen Sie Ort und Zeit der Maßnahme
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="vorgangsnummer">Vorgangsnummer</Label>
              <Input
                id="vorgangsnummer"
                placeholder="Vorgangsnummer eingeben"
                value={formData.vorgangsnummer}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ort">Ort</Label>
              <Input
                id="ort"
                placeholder="Ort der Maßnahme"
                value={formData.ort}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="datum">Datum</Label>
              <Input
                id="datum"
                type="date"
                value={formData.datum}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="startTime">Uhrzeit Beginn</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endTime">Uhrzeit Ende</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Speichern...
                </>
              ) : (
                "Speichern"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
