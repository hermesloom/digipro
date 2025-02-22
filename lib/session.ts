export interface Beweismittel {
  id: string;
  lfdNummer: string;
  art: "sicherstellung" | "beschlagnahme" | null;
  sachen: string;
  barcode: string;
  photos: string[];
}

export interface Vorgang {
  id: string;
  einrichtung: {
    vorgangsnummer: string;
    ort: string;
    datumBeginn: string;
    datumEnde: string;
    startTime: string;
    endTime: string;
  };
  betroffener?: {
    name: string;
    birthdate: string;
  };
  grund?: {
    zweck: {
      strafverfolgung: boolean;
      ordnungswidrigkeiten: boolean;
      gefahrenabwehr: boolean;
    };
    grund: string;
    anordnungsTyp: "anordnung" | "gefahr" | null;
    anordnungDetails?: string;
  };
  durchsuchung?: {
    person: boolean;
    sachen: {
      checked: boolean;
      description?: string;
    };
    wohnung: {
      checked: boolean;
      description?: string;
    };
    sonstige: {
      checked: boolean;
      description?: string;
    };
  };
  anwesende?: {
    names: string;
  };
  beweismittel: Beweismittel[];
  erklaerung?: {
    erklaerer: "betroffener" | "vertreter" | null;
    durchsuchungGestattet: "ja" | "nein" | "nicht" | null;
    widerspruch: string[];
    durchsichtEinverstanden: boolean;
    zeugeVerzichtet: boolean;
    signatureBetroffener?: string;
    signatureZeuge?: string;
  };
}

export interface Session {
  vorgaenge: Vorgang[];
  getVorgang: (id: string) => Vorgang | undefined;
  addVorgang: (vorgang: Vorgang) => void;
  updateVorgang: (id: string, vorgang: Vorgang) => void;
  removeVorgang: (id: string) => void;
  vorgaengeLoaded: boolean;
  setLoadedVorgaenge: (vorgaenge: Vorgang[]) => void;
}
