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
import { useState } from "react";
import { useSession } from "@/contexts/SessionContext";
import { Setup } from "@/lib/session";
import Image from "next/image";

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
  const { setSetup, setup } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Setup>(() => ({
    name: setup?.name || "",
    amtsbezeichnung: setup?.amtsbezeichnung || "",
    polizeiDienststelle: setup?.polizeiDienststelle || "",
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save setup");
      }

      setSetup(formData);
      router.push("/vorgaenge");
    } catch (error) {
      console.error("Error saving setup:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-4 items-center text-center">
          <Image
            src="/logo.png"
            alt="DIGIPRO Logo"
            width={200}
            height={80}
            priority
            className="mx-auto"
          />
          <div>
            <CardTitle>DIGIPRO</CardTitle>
            <CardDescription>
              Bitte geben Sie die erforderlichen Informationen ein
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Vollständiger Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amtsbezeichnung">Amtsbezeichnung</Label>
                <Input
                  id="amtsbezeichnung"
                  placeholder="Ihre Amtsbezeichnung"
                  value={formData.amtsbezeichnung}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      amtsbezeichnung: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dienststelle">
                  Anzeigende Polizeidienststelle
                </Label>
                <Select
                  value={formData.polizeiDienststelle}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      polizeiDienststelle: value,
                    }))
                  }
                  required
                >
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

              <Button type="submit" className="mt-4" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2">Wird gespeichert</span>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </>
                ) : (
                  "Anmelden"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
