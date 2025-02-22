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

export default function Betroffener() {
  return (
    <div className="min-h-screen p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-4">
          <Button variant="ghost" asChild className="w-fit -ml-2">
            <Link href="/vorgaenge/neu" className="flex items-center gap-2">
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
          <form className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Vollständiger Name des Betroffenen"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="birthdate">Geburtsdatum</Label>
              <Input id="birthdate" type="date" placeholder="TT.MM.JJJJ" />
            </div>

            <Button type="submit" className="w-full" asChild>
              <Link href="/vorgaenge/neu">Speichern</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
