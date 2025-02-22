"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, QrCode } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Beweismittel() {
  const [isScanning, setIsScanning] = useState(false);
  const [barcode, setBarcode] = useState("");

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
            <CardTitle>Beweismittel</CardTitle>
            <CardDescription>
              Erfassen Sie die sichergestellten oder beschlagnahmten
              Beweismittel
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Art der Maßnahme</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Bitte wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sicherstellung">
                      Sicherstellung
                    </SelectItem>
                    <SelectItem value="beschlagnahme">Beschlagnahme</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sachen">Sachen</Label>
                <Input
                  id="sachen"
                  placeholder="Beschreibung der Beweismittel"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="barcode">Barcode</Label>
                <div className="flex gap-2">
                  <Input
                    id="barcode"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Barcode eingeben oder scannen"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsScanning(true)}
                    className="flex items-center gap-2"
                  >
                    <QrCode className="h-4 w-4" />
                    Scannen
                  </Button>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" asChild>
              <Link href="/vorgaenge/neu">Speichern</Link>
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={isScanning} onOpenChange={setIsScanning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Barcode scannen</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
            {/* Scanner will be integrated here */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
