# DIGIPRO

## Gruppenname
DIGIPRO

## Mitglieder
* Julian Nalenz
* Ramnish Gupta
* Anton Scheck 
* Milena Schott
* Kaan-Batuhan Cakir

## Projektbeschreibung
Unser Team hat, infolge von Gesprächen mit mehreren anwesenden Beamt*innen der Polizei, entschieden, das Formular "Niederschrift über Durchsuchung, Sicherstellung, Beschlagnahme" zu digitalisieren. Dafür haben wir eine Webanwendung erstellt, die geräteunabhängig ist und identisch auf Desktop und Mobilengeräten läuft.

Das Formular haben wir, basierend auf dem Feedback, auch teilweise vereinfacht und leichter zu bedienen erstellt. Über die Seite können neue Vorgänge hinzugefügt, alte Vorgänge bearbeitet, Bilder von Beweismitteln gemacht, Barcodes eingescannt und auch Unterschrifte direkt in die Anwendung gesammelt werden.

Die Daten können auch über eine REST-API Schnittstelle von anderen Systemen wie dem NIVADIS-System aufgerufen und importiert werden.

## Setup

1. Have node and pnpm installed
2. Clone this repository and cd into it
3. `cp .env.template .env`
4. In `.env`, insert your MongoDB connection string
5. `pnpm install`
6. `pnpm run dev`
