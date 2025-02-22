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
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useVorgang } from "@/contexts/SessionContext";
import { useSession } from "@/contexts/SessionContext";
import { SaveButton } from "@/app/components/SaveButton";

export default function Durchsuchung() {
  const vorgang = useVorgang();
  const { updateVorgang } = useSession();

  const [formData, setFormData] = useState({
    person: vorgang.durchsuchung?.person || false,
    sachen: {
      checked: vorgang.durchsuchung?.sachen.checked || false,
      description: vorgang.durchsuchung?.sachen.description || "",
    },
    wohnung: {
      checked: vorgang.durchsuchung?.wohnung.checked || false,
      description: vorgang.durchsuchung?.wohnung.description || "",
    },
    sonstige: {
      checked: vorgang.durchsuchung?.sonstige.checked || false,
      description: vorgang.durchsuchung?.sonstige.description || "",
    },
  });

  const handleCheckboxChange = (
    id: "person" | "sachen" | "wohnung" | "sonstige"
  ) => {
    if (id === "person") {
      setFormData((prev) => ({
        ...prev,
        person: !prev.person,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          checked: !prev[id].checked,
        },
      }));
    }
  };

  const handleInputChange = (
    id: "sachen" | "wohnung" | "sonstige",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        description: value,
      },
    }));
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
            <CardTitle>Durchsuchung</CardTitle>
            <CardDescription>Art und Ort der Durchsuchung</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="person"
                  checked={formData.person}
                  onCheckedChange={() => handleCheckboxChange("person")}
                />
                <Label htmlFor="person" className="font-normal cursor-pointer">
                  der o. a. Person
                </Label>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sachen"
                    checked={formData.sachen.checked}
                    onCheckedChange={() => handleCheckboxChange("sachen")}
                  />
                  <Label
                    htmlFor="sachen"
                    className="font-normal cursor-pointer"
                  >
                    der Sachen
                  </Label>
                </div>
                {formData.sachen.checked && (
                  <div className="pl-6">
                    <Input
                      placeholder="Beschreibung der Sachen"
                      value={formData.sachen.description}
                      onChange={(e) =>
                        handleInputChange("sachen", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wohnung"
                    checked={formData.wohnung.checked}
                    onCheckedChange={() => handleCheckboxChange("wohnung")}
                  />
                  <Label
                    htmlFor="wohnung"
                    className="font-normal cursor-pointer"
                  >
                    der Wohnung in
                  </Label>
                </div>
                {formData.wohnung.checked && (
                  <div className="pl-6">
                    <Input
                      placeholder="Adresse der Wohnung"
                      value={formData.wohnung.description}
                      onChange={(e) =>
                        handleInputChange("wohnung", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sonstige"
                    checked={formData.sonstige.checked}
                    onCheckedChange={() => handleCheckboxChange("sonstige")}
                  />
                  <Label
                    htmlFor="sonstige"
                    className="font-normal cursor-pointer"
                  >
                    sonstiger Räume
                  </Label>
                </div>
                {formData.sonstige.checked && (
                  <div className="pl-6">
                    <Input
                      placeholder="Bezeichnung der Räume, Ortsangabe"
                      value={formData.sonstige.description}
                      onChange={(e) =>
                        handleInputChange("sonstige", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            <SaveButton
              vorgang={vorgang}
              updateVorgang={updateVorgang}
              sectionName="durchsuchung"
              formData={formData}
              className="w-full"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
