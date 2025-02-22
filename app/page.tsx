"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

const polizeiDienststellen = [
  "Polizeikommissariat Bad Harzburg",
  "Polizeikommissariat Bundesautobahn",
  "Polizeikommissariat Helmstedt",
  "Polizeikommissariat Königslutter",
  "Polizeikommissariat Meine",
  "Polizeikommissariat Meinersen",
  "Polizeikommissariat Mitte",
  "Polizeikommissariat Nord",
  "Polizeikommissariat Oberharz",
  "Polizeikommissariat Peine",
  "Polizeikommissariat Schöningen",
  "Polizeikommissariat Seesen",
  "Polizeikommissariat Salzgitter-Bad",
  "Polizeikommissariat Süd",
  "Polizeikommissariat Wittingen",
  "Polizeikommissariat Wolfenbüttel",
  "Verkehrsunfalldienst",
  "Zentraler Kriminaldienst",
];

export default function Home() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/vorgaenge");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>DIGIPRO</CardTitle>
          <CardDescription>
            Bitte geben Sie die erforderlichen Informationen ein
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Vollständiger Name" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amtsbezeichnung">Amtsbezeichnung</Label>
                <Input
                  id="amtsbezeichnung"
                  placeholder="Ihre Amtsbezeichnung"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dienststelle">
                  Anzeigende Polizeidienststelle
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Wählen Sie eine Dienststelle" />
                  </SelectTrigger>
                  <SelectContent>
                    {polizeiDienststellen.map((dienststelle) => (
                      <SelectItem key={dienststelle} value={dienststelle}>
                        {dienststelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="mt-4">
                Anmelden
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
