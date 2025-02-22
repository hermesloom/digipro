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

export default function Durchsuchung() {
  const vorgang = useVorgang();
  const [checkedItems, setCheckedItems] = useState({
    person: false,
    sachen: false,
    wohnung: false,
    sonstige: false,
  });

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
          <form className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="person"
                  checked={checkedItems.person}
                  onCheckedChange={(checked) =>
                    setCheckedItems((prev) => ({
                      ...prev,
                      person: checked === true,
                    }))
                  }
                />
                <Label htmlFor="person" className="font-normal cursor-pointer">
                  der o. a. Person
                </Label>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sachen"
                    checked={checkedItems.sachen}
                    onCheckedChange={(checked) =>
                      setCheckedItems((prev) => ({
                        ...prev,
                        sachen: checked === true,
                      }))
                    }
                  />
                  <Label
                    htmlFor="sachen"
                    className="font-normal cursor-pointer"
                  >
                    der Sachen
                  </Label>
                </div>
                {checkedItems.sachen && (
                  <div className="pl-6">
                    <Input placeholder="Beschreibung der Sachen" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wohnung"
                    checked={checkedItems.wohnung}
                    onCheckedChange={(checked) =>
                      setCheckedItems((prev) => ({
                        ...prev,
                        wohnung: checked === true,
                      }))
                    }
                  />
                  <Label
                    htmlFor="wohnung"
                    className="font-normal cursor-pointer"
                  >
                    der Wohnung in
                  </Label>
                </div>
                {checkedItems.wohnung && (
                  <div className="pl-6">
                    <Input placeholder="Adresse der Wohnung" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sonstige"
                    checked={checkedItems.sonstige}
                    onCheckedChange={(checked) =>
                      setCheckedItems((prev) => ({
                        ...prev,
                        sonstige: checked === true,
                      }))
                    }
                  />
                  <Label
                    htmlFor="sonstige"
                    className="font-normal cursor-pointer"
                  >
                    sonstiger Räume
                  </Label>
                </div>
                {checkedItems.sonstige && (
                  <div className="pl-6">
                    <Input placeholder="Bezeichnung der Räume, Ortsangabe" />
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" asChild>
              <Link href={`/vorgaenge/${vorgang.id}/erklaerung`}>
                Speichern
              </Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
