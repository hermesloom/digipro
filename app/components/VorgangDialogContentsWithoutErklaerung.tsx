import { Vorgang } from "@/lib/session";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import Image from "next/image";
import { useSession } from "@/contexts/SessionContext";
import Barcode from "react-barcode";

interface VorgangDialogContentsWithoutErklaerungProps {
  vorgang: Vorgang;
}

export function VorgangDialogContentsWithoutErklaerung({
  vorgang,
}: VorgangDialogContentsWithoutErklaerungProps) {
  const { setup } = useSession();

  const formatDate = (date: string) => {
    return format(new Date(date), "dd.MM.yyyy", { locale: de });
  };

  // Add helper function for time formatting
  const formatTime = (time?: string) => {
    return time ? `${time} Uhr` : "Keine Angabe";
  };

  return (
    <>
      {setup && (
        <section className="space-y-3">
          <h3 className="font-semibold">Dienstliche Angaben</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span> {setup.name}
            </div>
            <div>
              <span className="text-muted-foreground">Amtsbezeichnung:</span>{" "}
              {setup.amtsbezeichnung}
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Dienststelle:</span>{" "}
              {setup.polizeiDienststelle}
            </div>
          </div>
        </section>
      )}

      {/* Einrichtung */}
      <section className="space-y-3">
        <h3 className="font-semibold">Einrichtung</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Ort:</span>{" "}
            {vorgang.einrichtung?.ort || "Keine Angabe"}
          </div>
          <div>
            <span className="text-muted-foreground">Beginn:</span>{" "}
            {vorgang.einrichtung?.datumBeginn
              ? `${formatDate(vorgang.einrichtung.datumBeginn)}, ${formatTime(
                  vorgang.einrichtung.startTime
                )}`
              : "Keine Angabe"}
          </div>
          <div>
            <span className="text-muted-foreground">Ende:</span>{" "}
            {vorgang.einrichtung?.datumEnde
              ? `${formatDate(vorgang.einrichtung.datumEnde)}, ${formatTime(
                  vorgang.einrichtung.endTime
                )}`
              : "Keine Angabe"}
          </div>
        </div>
      </section>

      {/* Betroffener */}
      {vorgang.betroffener && (
        <section className="space-y-3">
          <h3 className="font-semibold">Betroffener</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Name:</span>{" "}
              {vorgang.betroffener.name}
            </div>
            <div>
              <span className="text-muted-foreground">Geburtsdatum:</span>{" "}
              {formatDate(vorgang.betroffener.birthdate)}
            </div>
          </div>
        </section>
      )}

      {/* Grund */}
      {vorgang.grund && (
        <section className="space-y-3">
          <h3 className="font-semibold">Grund</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Zweck:</span>{" "}
              {Object.entries(vorgang.grund.zweck)
                .filter((x) => x[1])
                .map(
                  ([key]) =>
                    ({
                      strafverfolgung: "Strafverfolgung",
                      ordnungswidrigkeiten:
                        "Verfolgung von Ordnungswidrigkeiten",
                      gefahrenabwehr: "Gefahrenabwehr",
                    }[key])
                )
                .join(", ")}
            </div>
            <div>
              <span className="text-muted-foreground">Grund:</span>{" "}
              {vorgang.grund.grund}
            </div>
            <div>
              <span className="text-muted-foreground">Ursprung:</span>{" "}
              {vorgang.grund.anordnungsTyp === "anordnung"
                ? `Auf Anordnung: ${vorgang.grund.anordnungDetails}`
                : vorgang.grund.anordnungsTyp === "gefahr"
                ? `Gefahr im Verzuge bei: ${vorgang.grund.anordnungDetails}`
                : "Keine Angabe"}
            </div>
          </div>
        </section>
      )}

      {/* Durchsuchung */}
      {vorgang.durchsuchung && (
        <section className="space-y-3">
          <h3 className="font-semibold">Durchsuchung</h3>
          <div className="space-y-2 text-sm">
            {vorgang.durchsuchung.person && (
              <div>
                <span className="text-muted-foreground">Person:</span> Ja
              </div>
            )}
            {vorgang.durchsuchung.sachen.checked && (
              <div>
                <span className="text-muted-foreground">Sachen:</span>{" "}
                {vorgang.durchsuchung.sachen.description}
              </div>
            )}
            {vorgang.durchsuchung.wohnung.checked && (
              <div>
                <span className="text-muted-foreground">Wohnung:</span>{" "}
                {vorgang.durchsuchung.wohnung.description}
              </div>
            )}
            {vorgang.durchsuchung.sonstige.checked && (
              <div>
                <span className="text-muted-foreground">Sonstige:</span>{" "}
                {vorgang.durchsuchung.sonstige.description}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Beweismittel */}
      {vorgang.beweismittel?.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold">Beweismittel</h3>
          <div className="space-y-4">
            {vorgang.beweismittel.map((beweismittel) => (
              <div key={beweismittel.id} className="space-y-2 text-sm">
                <div className="font-medium">#{beweismittel.lfdNummer}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Art:</span>{" "}
                    {beweismittel.art === "sicherstellung"
                      ? "Sicherstellung"
                      : beweismittel.art === "beschlagnahme"
                      ? "Beschlagnahme"
                      : "Keine Angabe"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Barcode:</span>{" "}
                    {beweismittel.barcode ? (
                      <div className="mt-2">
                        <Barcode
                          value={beweismittel.barcode}
                          height={40}
                          width={1.5}
                          fontSize={12}
                        />
                      </div>
                    ) : (
                      "Nicht erfasst"
                    )}
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Beschreibung:</span>{" "}
                    {beweismittel.sachen}
                  </div>
                </div>
                {beweismittel.photos.length > 0 && (
                  <div>
                    <div className="text-muted-foreground mb-2">Fotos:</div>
                    <div className="grid grid-cols-3 gap-2">
                      {beweismittel.photos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-md overflow-hidden border"
                        >
                          <Image
                            src={photo}
                            alt={`Foto ${index + 1} von Beweismittel #${
                              beweismittel.lfdNummer
                            }`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Anwesende */}
      {vorgang.anwesende && (
        <section className="space-y-3">
          <h3 className="font-semibold">Anwesende Personen</h3>
          <div className="text-sm">{vorgang.anwesende.names}</div>
        </section>
      )}
    </>
  );
}
