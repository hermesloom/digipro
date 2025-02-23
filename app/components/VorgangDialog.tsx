import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRef } from "react";
import { Vorgang } from "@/lib/session";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { useSession } from "@/contexts/SessionContext";
import { VorgangDialogContentsWithoutErklaerung } from "./VorgangDialogContentsWithoutErklaerung";

interface VorgangDialogProps {
  vorgang: Vorgang;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VorgangDialog({
  vorgang,
  open,
  onOpenChange,
}: VorgangDialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    bodyClass: "p-12",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              Vorgang #{vorgang.einrichtung?.vorgangsnummer || "N/A"}
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => reactToPrintFn()}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              PDF Export
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4" ref={contentRef}>
          <Image
            src="/logo.png"
            alt="DIGIPRO Logo"
            width={200}
            height={80}
            priority
            className="mx-auto"
          />

          <VorgangDialogContentsWithoutErklaerung vorgang={vorgang} />

          {/* Erklärung */}
          {vorgang.erklaerung && (
            <section className="space-y-3">
              <h3 className="font-semibold">Erklärung</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Erklärender:</span>{" "}
                  {vorgang.erklaerung.erklaerer === "betroffener"
                    ? "Betroffene/r"
                    : "Vertreter/in"}
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Durchsuchung gestattet:
                  </span>{" "}
                  {vorgang.erklaerung.durchsuchungGestattet
                    ? {
                        ja: "Ja",
                        nein: "Nein",
                        nicht: "Nicht stattgefunden",
                      }[vorgang.erklaerung.durchsuchungGestattet]
                    : "Nicht erfasst"}
                </div>
                {vorgang.erklaerung.widerspruch.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">
                      Widerspruch gegen:
                    </span>{" "}
                    {vorgang.erklaerung.widerspruch
                      .map(
                        (id) =>
                          `#${
                            vorgang.beweismittel.find((b) => b.id === id)
                              ?.lfdNummer
                          }`
                      )
                      .join(", ")}
                  </div>
                )}
                {vorgang.erklaerung.durchsichtEinverstanden && (
                  <div>Mit Durchsicht einverstanden</div>
                )}
                {vorgang.erklaerung.zeugeVerzichtet && (
                  <div>Auf unabhängigen Zeugen verzichtet</div>
                )}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {vorgang.erklaerung.signatureBetroffener && (
                    <div className="space-y-2">
                      <div className="text-muted-foreground">
                        Unterschrift Betroffener/Vertreter:
                      </div>
                      <div className="relative h-32 border rounded-md overflow-hidden bg-white">
                        <Image
                          src={vorgang.erklaerung.signatureBetroffener}
                          alt="Unterschrift Betroffener/Vertreter"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                  {vorgang.erklaerung.signatureZeuge && (
                    <div className="space-y-2">
                      <div className="text-muted-foreground">
                        Unterschrift Zeuge/Zeugin:
                      </div>
                      <div className="relative h-32 border rounded-md overflow-hidden bg-white">
                        <Image
                          src={vorgang.erklaerung.signatureZeuge}
                          alt="Unterschrift Zeuge/Zeugin"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
