"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Vorgang } from "@/lib/session";

export interface SaveButtonProps {
  vorgang: Vorgang;
  updateVorgang: (id: string, vorgang: Vorgang) => void;
  sectionName: string;
  formData: any;
  className?: string;
  onBeforeSave?: () => void;
}

export function SaveButton({
  vorgang,
  updateVorgang,
  sectionName,
  formData,
  className,
  onBeforeSave,
}: SaveButtonProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!vorgang) return;
    setIsSaving(true);

    try {
      onBeforeSave?.();

      const updatedVorgang = {
        ...vorgang,
        [sectionName]: formData,
      };

      const response = await fetch(`/api/vorgaenge/${vorgang.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVorgang),
      });

      if (!response.ok) {
        throw new Error("Failed to update vorgang");
      }

      updateVorgang(vorgang.id, updatedVorgang);
      router.push(`/vorgaenge/${vorgang.id}`);
    } catch (error) {
      console.error("Error updating vorgang:", error);
      // Here you might want to show an error message to the user
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      type="submit"
      className={className}
      disabled={isSaving}
      onClick={handleSave}
    >
      {isSaving ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Speichern...
        </>
      ) : (
        "Speichern"
      )}
    </Button>
  );
}
