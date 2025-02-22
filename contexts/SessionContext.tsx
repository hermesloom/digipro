"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Session, Vorgang } from "@/lib/session";

const SessionContext = createContext<Session | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [vorgaenge, setVorgaenge] = useState<Vorgang[]>([]);
  const [vorgaengeLoaded, setVorgaengeLoaded] = useState(false);

  const addVorgang = (vorgang: Vorgang) => {
    setVorgaenge((prev) => [...prev, vorgang]);
  };

  const removeVorgang = (id: string) => {
    setVorgaenge((prev) => prev.filter((v) => v.id !== id));
  };

  const setLoadedVorgaenge = (vorgaenge: Vorgang[]) => {
    setVorgaenge(vorgaenge);
    setVorgaengeLoaded(true);
  };

  return (
    <SessionContext.Provider
      value={{
        vorgaenge,
        addVorgang,
        removeVorgang,
        vorgaengeLoaded,
        setLoadedVorgaenge,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): Session {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
