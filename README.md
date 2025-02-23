This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Gruppenname
Digipro

## Mitglieder*innen
* Julian Nalenz
* Ramnish Gupta
* Anton Scheck 
* Milena Schott
* Kaan-Batuhan Cakir

## Projektbeschreibung
Unser Team hat, nach Gesprächen mit mehreren Beamten*innen der Polizei die hier anwesend sind, entschieden das Sicherstellungsformular zu digitalisieren. Dafür haben wir, eine Webanwendung bereitgestellt, die Geräteunabhängig ist, und identisch auf Desktop und Mobilengeräten läuft.

Das Formular haben wir, basierend auf das Feedback, auch teilweise vereinfacht und leichter zu bedienen erstellt. Über die Seite können neue Vorgänge hinzugefügt werden, alte Vorgänge bearbeitet werden, Bilder von Beweismitteln gemacht werden, Barcodes eingescannt werden und auch Unterschrifte direkt in die Anwendung gesammelt werden.

Die Daten können auch über eine REST-API Schnittstelle von anderen Systemen wie zum Beispiel das Nivadis System aufgerufen und importiert werden.

# Setup

1. Have node and pnpm installed
2. Clone this repository and cd into it
3. `cp .env.template .env`
4. In `.env`, insert your MongoDB connection string
5. `pnpm install`
6. `pnpm run dev`
