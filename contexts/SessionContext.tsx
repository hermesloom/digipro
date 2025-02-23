"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Session, Vorgang, Setup } from "@/lib/session";
import { useParams } from "next/navigation";
const SessionContext = createContext<Session | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [setup, setSetup] = useState<Setup | undefined>(undefined);
  const [vorgaenge, setVorgaenge] = useState<Vorgang[]>([]);
  const [vorgaengeLoaded, setVorgaengeLoaded] = useState(false);

  const getVorgang = (id: string) => {
    return vorgaenge.find((v) => v.id === id);
  };

  const addVorgang = (vorgang: Vorgang) => {
    setVorgaenge((prev) => [...prev, vorgang]);
  };

  const updateVorgang = (id: string, vorgang: Vorgang) => {
    setVorgaenge((prev) => prev.map((v) => (v.id === id ? vorgang : v)));
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
        getVorgang,
        addVorgang,
        updateVorgang,
        removeVorgang,
        vorgaengeLoaded,
        setLoadedVorgaenge,
        setup,
        setSetup,
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

export function useVorgang(): Vorgang {
  const { vorgaenge } = useSession();
  const params = useParams();
  const vorgang = vorgaenge.find((v) => v.id === params.id);
  if (!vorgang) {
    throw new Error("Vorgang not found");
  }
  return vorgang;
}
