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
import { useVorgang } from "@/contexts/SessionContext";
import { useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { SaveButton } from "@/app/components/SaveButton";

export default function Betroffener() {
  const vorgang = useVorgang();
  const { updateVorgang } = useSession();
  const [formData, setFormData] = useState({
    name: vorgang.betroffener?.name || "",
    birthdate: vorgang.betroffener?.birthdate || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

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
            <CardTitle>Betroffener</CardTitle>
            <CardDescription>
              Erfassen Sie die persönlichen Daten des Betroffenen
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Vollständiger Name des Betroffenen"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="birthdate">Geburtsdatum</Label>
              <Input
                id="birthdate"
                type="date"
                placeholder="TT.MM.JJJJ"
                value={formData.birthdate}
                onChange={handleChange}
                required
              />
            </div>

            <SaveButton
              vorgang={vorgang}
              updateVorgang={updateVorgang}
              sectionName="betroffener"
              formData={formData}
              className="w-full"
              label="Speichern und weiter zum Grund"
              targetRoute="/grund"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
