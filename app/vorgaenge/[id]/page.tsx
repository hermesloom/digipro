"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Circle, ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";

const steps = [
  {
    id: "einrichtung",
    title: "Einrichtung",
    description: "Ort und Zeit der Maßnahme",
  },
  {
    id: "betroffener",
    title: "Betroffener",
    description: "Persönliche Daten des Betroffenen",
  },
  {
    id: "grund",
    title: "Grund",
    description: "Grund der polizeilichen Maßnahme",
  },
  {
    id: "durchsuchung",
    title: "Durchsuchung",
    description: "Details zur Durchsuchung",
  },
  {
    id: "beweismittel",
    title: "Beweismittel",
    description: "Sichergestellte Beweismittel",
    isButton: true,
  },
  {
    id: "anwesende",
    title: "Anwesende",
    description: "Anwesende Personen und Zeugen",
  },
  {
    id: "erklaerung",
    title: "Erklärung",
    description: "Abschließende Erklärung",
  },
];

export default function NeuerVorgang() {
  const params = useParams();

  return (
    <div className="min-h-screen p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-4">
          <Button variant="ghost" asChild className="w-fit -ml-2">
            <Link href="/vorgaenge" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Zurück
            </Link>
          </Button>
          <div>
            <CardTitle>Vorgang bearbeiten</CardTitle>
            <CardDescription>
              Bitte füllen Sie alle erforderlichen Schritte aus
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="text-muted-foreground">
                  <Circle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium leading-none mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                <Button
                  variant={step.isButton ? "default" : "outline"}
                  className="ml-auto flex items-center gap-2"
                  asChild
                >
                  <Link href={`/vorgaenge/${params.id}/${step.id}`}>
                    {step.isButton && <PlusCircle className="h-4 w-4" />}
                    {step.isButton ? "Hinzufügen" : "Ausfüllen"}
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="border-t pt-6">
            <Button className="w-full" size="lg" asChild>
              <Link href="/vorgaenge">Vorgang speichern</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
