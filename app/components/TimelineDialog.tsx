import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Vorgang } from "@/lib/session";

interface TimelineDialogProps {
  vorgang: Vorgang;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TimelineDialog({
  vorgang,
  open,
  onOpenChange,
}: TimelineDialogProps) {
  // Generate timeline events based on Vorgang data
  const timelineEvents = [
    {
      date: new Date(),
      event: "Vorgang erstellt",
      details: `Vorgang ${vorgang.id} wurde angelegt`,
    },
    // Einrichtung events
    ...(vorgang.einrichtung
      ? [
          {
            date: new Date(),
            event: "Einrichtung erfasst",
            details: [
              vorgang.einrichtung.vorgangsnummer &&
                `Vorgangsnummer: ${vorgang.einrichtung.vorgangsnummer}`,
              vorgang.einrichtung.ort && `Ort: ${vorgang.einrichtung.ort}`,
              vorgang.einrichtung.datumBeginn &&
                `Datum: ${new Date(
                  vorgang.einrichtung.datumBeginn
                ).toLocaleDateString("de-DE")}`,
              vorgang.einrichtung.startTime &&
                `Uhrzeit: ${vorgang.einrichtung.startTime} Uhr`,
            ]
              .filter(Boolean)
              .join(", "),
          },
        ]
      : []),

    // Betroffener events
    ...(vorgang.betroffener
      ? [
          {
            date: new Date(),
            event: "Betroffene Person erfasst",
            details: `${vorgang.betroffener.name}${
              vorgang.betroffener.birthdate
                ? `, geboren am ${new Date(
                    vorgang.betroffener.birthdate
                  ).toLocaleDateString("de-DE")}`
                : ""
            }`,
          },
        ]
      : []),

    // Grund events
    ...(vorgang.grund
      ? [
          {
            date: new Date(),
            event: "Grund erfasst",
            details: [
              `Grund: ${vorgang.grund.grund}`,
              vorgang.grund.zweck.strafverfolgung && "Strafverfolgung",
              vorgang.grund.zweck.ordnungswidrigkeiten &&
                "Ordnungswidrigkeiten",
              vorgang.grund.zweck.gefahrenabwehr && "Gefahrenabwehr",
              vorgang.grund.anordnungsTyp &&
                `Anordnungstyp: ${vorgang.grund.anordnungsTyp}`,
            ]
              .filter(Boolean)
              .join(", "),
          },
        ]
      : []),

    // Durchsuchung events
    ...(vorgang.durchsuchung
      ? [
          {
            date: new Date(),
            event: "Durchsuchung dokumentiert",
            details: [
              vorgang.durchsuchung.person && "Person",
              vorgang.durchsuchung.sachen.checked &&
                `Sachen${
                  vorgang.durchsuchung.sachen.description
                    ? `: ${vorgang.durchsuchung.sachen.description}`
                    : ""
                }`,
              vorgang.durchsuchung.wohnung.checked &&
                `Wohnung${
                  vorgang.durchsuchung.wohnung.description
                    ? `: ${vorgang.durchsuchung.wohnung.description}`
                    : ""
                }`,
              vorgang.durchsuchung.sonstige.checked &&
                `Sonstige${
                  vorgang.durchsuchung.sonstige.description
                    ? `: ${vorgang.durchsuchung.sonstige.description}`
                    : ""
                }`,
            ]
              .filter(Boolean)
              .join(", "),
          },
        ]
      : []),

    // Anwesende events
    ...(vorgang.anwesende?.names
      ? [
          {
            date: new Date(),
            event: "Anwesende Personen erfasst",
            details: vorgang.anwesende.names,
          },
        ]
      : []),

    // Beweismittel events
    ...vorgang.beweismittel.map((beweismittel) => ({
      date: new Date(),
      event: "Beweismittel erfasst",
      details: [
        `Nr. ${beweismittel.lfdNummer}`,
        beweismittel.art && `Art: ${beweismittel.art}`,
        beweismittel.sachen && `Sachen: ${beweismittel.sachen}`,
        beweismittel.barcode && `Barcode: ${beweismittel.barcode}`,
        beweismittel.photos.length > 0 && `${beweismittel.photos.length} Fotos`,
      ]
        .filter(Boolean)
        .join(", "),
    })),

    // Erklärung events
    ...(vorgang.erklaerung
      ? [
          {
            date: new Date(),
            event: "Erklärung aufgenommen",
            details: [
              vorgang.erklaerung.erklaerer &&
                `Erklärer: ${vorgang.erklaerung.erklaerer}`,
              vorgang.erklaerung.durchsuchungGestattet &&
                `Durchsuchung ${vorgang.erklaerung.durchsuchungGestattet}`,
              vorgang.erklaerung.widerspruch?.length > 0 &&
                `Widerspruch: ${vorgang.erklaerung.widerspruch.join(", ")}`,
              vorgang.erklaerung.durchsichtEinverstanden &&
                "Durchsicht einverstanden",
              vorgang.erklaerung.zeugeVerzichtet && "Zeuge verzichtet",
              vorgang.erklaerung.signatureBetroffener &&
                "Unterschrift Betroffener vorhanden",
              vorgang.erklaerung.signatureZeuge &&
                "Unterschrift Zeuge vorhanden",
            ]
              .filter(Boolean)
              .join(", "),
          },
        ]
      : []),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Verlauf</DialogTitle>
        </DialogHeader>
        <div className="mt-4 overflow-y-auto px-6 -mr-6">
          {timelineEvents.map((event, index) => (
            <div
              key={index}
              className="relative pl-8 border-l-2 border-muted pb-8 last:pb-0"
            >
              <div className="absolute -left-2 w-4 h-4 rounded-full bg-primary" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {event.date.toLocaleDateString("de-DE")}{" "}
                  {event.date.toLocaleTimeString("de-DE")}
                </p>
                <p className="font-medium">{event.event}</p>
                <p className="text-sm text-muted-foreground">{event.details}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
