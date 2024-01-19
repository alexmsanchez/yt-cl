import Image from "next/image";
import Link from "next/link";
import { getVideos } from "./firebase/functions";

export default async function Home() {
  const videos = await getVideos();
  return (
    <main>
      <div className="flex">
        {videos.map((video) => (
          <Link href={`/watch?v=${video.filename}`} key={video.id}>
            <Image
              src={"/thumbnail.png"}
              alt="video"
              width={120}
              height={80}
              className="m-3"
            />
          </Link>
        ))}
      </div>
    </main>
  );
}

// re-cache every 30 seconds
export const revalidate = 30;
