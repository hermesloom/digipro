"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Circle,
  ArrowLeft,
  PlusCircle,
  CheckCircle2,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/contexts/SessionContext";
import { Vorgang, Beweismittel } from "@/lib/session";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

const steps = [
  {
    id: "einrichtung",
    title: "1. Einrichtung",
    description: "Ort und Zeit der Maßnahme",
  },
  {
    id: "betroffener",
    title: "2. Betroffener",
    description: "Persönliche Daten des Betroffenen",
  },
  {
    id: "grund",
    title: "3. Grund",
    description: "Grund der polizeilichen Maßnahme",
  },
  {
    id: "durchsuchung",
    title: "4. Durchsuchung",
    description: "Details zur Durchsuchung",
  },
  {
    id: "beweismittel",
    title: "5. Beweismittel",
    description: "Sichergestellte Beweismittel",
    isButton: true,
  },
  {
    id: "anwesende",
    title: "6. Anwesende",
    description: "Anwesende Personen und Zeugen",
  },
  {
    id: "erklaerung",
    title: "7. Erklärung",
    description: "Abschließende Erklärung",
  },
];

export default function NeuerVorgang() {
  const params = useParams();
  const router = useRouter();
  const { getVorgang, updateVorgang } = useSession();
  const vorgang = getVorgang(params.id as string);
  const [isAddingBeweismittel, setIsAddingBeweismittel] = useState(false);

  const isEinrichtungComplete = (vorgang?: Vorgang) => {
    if (!vorgang?.einrichtung) return false;
    const { vorgangsnummer, ort, datumBeginn, datumEnde, startTime, endTime } =
      vorgang.einrichtung;
    return Boolean(
      vorgangsnummer && ort && datumBeginn && datumEnde && startTime && endTime
    );
  };

  const isBetroffenerComplete = (vorgang?: Vorgang) => {
    if (!vorgang?.betroffener) return false;
    const { name, birthdate } = vorgang.betroffener;
    return Boolean(name && birthdate);
  };

  const isGrundComplete = (vorgang?: Vorgang) => {
    if (!vorgang?.grund) return false;
    const { zweck, grund, anordnungsTyp, anordnungDetails } = vorgang.grund;

    // Check if at least one purpose is selected
    const hasSelectedPurpose = Object.values(zweck).some((value) => value);

    // Check if all required fields are filled
    return Boolean(
      hasSelectedPurpose && grund && anordnungsTyp && anordnungDetails
    );
  };

  const isDurchsuchungComplete = (vorgang?: Vorgang) => {
    if (!vorgang?.durchsuchung) return false;
    const { person, sachen, wohnung, sonstige } = vorgang.durchsuchung;

    // At least one type must be selected
    if (!person && !sachen.checked && !wohnung.checked && !sonstige.checked) {
      return false;
    }

    return true;
  };

  const isAnwesendeComplete = (vorgang?: Vorgang) => {
    if (!vorgang?.anwesende) return false;
    return Boolean(vorgang.anwesende.names);
  };

  const isBeweismittelComplete = (beweismittel: Beweismittel) => {
    return Boolean(beweismittel.art && beweismittel.sachen);
  };

  const areAllBeweismittelComplete = (vorgang?: Vorgang) => {
    return vorgang?.beweismittel?.every(isBeweismittelComplete);
  };

  const isErklaerungComplete = (vorgang?: Vorgang) => {
    if (!vorgang?.erklaerung) return false;
    const { erklaerer, durchsuchungGestattet, signatureBetroffener } =
      vorgang.erklaerung;

    // Basic required fields
    if (!erklaerer || !durchsuchungGestattet || !signatureBetroffener) {
      return false;
    }

    return true;
  };

  const handleAddBeweismittel = async () => {
    if (!vorgang) return;

    setIsAddingBeweismittel(true);

    const newBeweismittel: Beweismittel = {
      id: uuidv4(),
      lfdNummer: `${(vorgang.beweismittel?.length || 0) + 1}`.padStart(3, "0"),
      art: null,
      sachen: "",
      barcode: "",
      photos: [],
    };

    const updatedVorgang: Vorgang = {
      ...vorgang,
      beweismittel: [...(vorgang.beweismittel || []), newBeweismittel],
    };

    try {
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

      updateVorgang(vorgang.id, updatedVorgang);
      router.push(
        `/vorgaenge/${vorgang.id}/beweismittel/${newBeweismittel.id}`
      );
    } catch (error) {
      console.error("Error updating vorgang:", error);
    } finally {
      setIsAddingBeweismittel(false);
    }
  };

  const handleDeleteBeweismittel = async (beweismittelId: string) => {
    if (!vorgang) return;

    const updatedVorgang: Vorgang = {
      ...vorgang,
      beweismittel: vorgang.beweismittel.filter((b) => b.id !== beweismittelId),
    };

    try {
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

      updateVorgang(vorgang.id, updatedVorgang);
    } catch (error) {
      console.error("Error updating vorgang:", error);
    }
  };

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
                className={`flex items-start gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors ${
                  step.id !== "beweismittel" ? "cursor-pointer" : ""
                }`}
                onClick={() => {
                  if (step.id !== "beweismittel") {
                    router.push(`/vorgaenge/${params.id}/${step.id}`);
                  }
                }}
              >
                <div className="text-muted-foreground">
                  {(step.id === "einrichtung" &&
                    isEinrichtungComplete(vorgang)) ||
                  (step.id === "betroffener" &&
                    isBetroffenerComplete(vorgang)) ||
                  (step.id === "grund" && isGrundComplete(vorgang)) ||
                  (step.id === "durchsuchung" &&
                    isDurchsuchungComplete(vorgang)) ||
                  (step.id === "anwesende" && isAnwesendeComplete(vorgang)) ||
                  (step.id === "beweismittel" &&
                    areAllBeweismittelComplete(vorgang)) ||
                  (step.id === "erklaerung" &&
                    isErklaerungComplete(vorgang)) ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium leading-none mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>

                  {step.id === "beweismittel" &&
                    vorgang &&
                    vorgang?.beweismittel?.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {vorgang.beweismittel.map((beweismittel) => (
                          <div
                            key={beweismittel.id}
                            className="flex items-center justify-between p-3 text-sm border rounded-md bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-medium">
                                #{beweismittel.lfdNummer}
                              </span>
                              <span className="text-muted-foreground">
                                {beweismittel.art
                                  ? {
                                      sicherstellung: "Sicherstellung",
                                      beschlagnahme: "Beschlagnahme",
                                    }[beweismittel.art]
                                  : "Keine Art ausgewählt"}
                              </span>
                              <span className="truncate max-w-[200px]">
                                {beweismittel.sachen || "Keine Beschreibung"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8"
                                asChild
                              >
                                <Link
                                  href={`/vorgaenge/${vorgang.id}/beweismittel/${beweismittel.id}`}
                                  className="flex items-center gap-2"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-destructive hover:text-destructive"
                                onClick={() =>
                                  handleDeleteBeweismittel(beweismittel.id)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
                {step.id === "beweismittel" && (
                  <Button
                    variant="default"
                    className="ml-auto flex items-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddBeweismittel();
                    }}
                    disabled={isAddingBeweismittel}
                  >
                    {isAddingBeweismittel ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Wird hinzugefügt...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4" />
                        Hinzufügen
                      </>
                    )}
                  </Button>
                )}
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
