export interface Vorgang {
  id: string;
}

export interface Session {
  vorgaenge: Vorgang[];
  addVorgang: (vorgang: Vorgang) => void;
  removeVorgang: (id: string) => void;
  vorgaengeLoaded: boolean;
  setLoadedVorgaenge: (vorgaenge: Vorgang[]) => void;
}
