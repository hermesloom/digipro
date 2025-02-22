export interface Vorgang {
  id: string;
  einrichtung: {
    vorgangsnummer: string;
    ort: string;
    datum: string;
    startTime: string;
    endTime: string;
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
