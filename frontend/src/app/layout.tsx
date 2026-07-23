import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard de Despachos",
  description: "Trackeo en tiempo real",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>
      <body style={{ margin: 0, fontFamily: "system-ui" }}>{children}</body>
    </html>
  );
}