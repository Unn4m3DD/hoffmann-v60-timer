import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hoffmann V60 Timer",
    short_name: "V60 Timer",
    description: "A V60 Timer for your coffee",
    start_url: "/",
    display: "standalone",
    icons: [
      {
        src: "/favicon.svg",
        type: "image/svg",
      },
    ],
  };
}
