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

export default function Einrichtung() {
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

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
            <CardTitle>Einrichtung</CardTitle>
            <CardDescription>
              Erfassen Sie Ort und Zeit der Maßnahme
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="ort">Ort</Label>
              <Input id="ort" placeholder="Ort der Maßnahme" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="datum">Datum</Label>
              <Input id="datum" type="date" defaultValue={today} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="startTime">Uhrzeit Beginn</Label>
              <Input id="startTime" type="time" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endTime">Uhrzeit Ende</Label>
              <Input id="endTime" type="time" />
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
