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
import { useSession } from "@/contexts/SessionContext";
import { SaveButton } from "@/app/components/SaveButton";
import { useState } from "react";

export default function Anwesende() {
  const vorgang = useVorgang();
  const { updateVorgang } = useSession();

  const [formData, setFormData] = useState({
    names: vorgang.anwesende?.names || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({ names: value });
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
            <CardTitle>Anwesende</CardTitle>
            <CardDescription>
              Erfassen Sie die anwesenden Personen
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-2">
              <Label htmlFor="names">
                Außer der Unterzeichnerin oder dem Unterzeichner waren anwesend
                (auch Zeugen angeben)
              </Label>
              <Input
                id="names"
                placeholder="Namen der anwesenden Personen"
                value={formData.names}
                onChange={handleChange}
              />
            </div>

            <SaveButton
              vorgang={vorgang}
              updateVorgang={updateVorgang}
              sectionName="anwesende"
              formData={formData}
              className="w-full"
              label="Speichern und weiter zur Erklärung"
              targetRoute="/erklaerung"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
