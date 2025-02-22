import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function Vorgaenge() {
  return (
    <div className="min-h-screen p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Vorgänge</CardTitle>
            <CardDescription>Liste aller erfassten Vorgänge</CardDescription>
          </div>
          <Button asChild className="flex items-center gap-2">
            <Link href="/vorgaenge/neu">
              <PlusCircle className="h-4 w-4" />
              Vorgang hinzufügen
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p>Noch keine Vorgänge erfasst</p>
            <p className="text-sm">
              Klicken Sie auf &quot;Vorgang hinzufügen&quot; um einen neuen
              Vorgang zu erstellen
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
