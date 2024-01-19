"use client";

import { useSearchParams } from "next/navigation";

export default function Watch() {
  const videoSrc = useSearchParams().get("v");
  const videoPrefix = "https://storage.googleapis.com/as-yt-processed-videos/";

  return (
    <div>
      <video controls src={`${videoPrefix}${videoSrc}`} />
    </div>
  );
}
