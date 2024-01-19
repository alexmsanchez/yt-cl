import { Firestore } from "@google-cloud/firestore";
import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

initializeApp({ credential: credential.applicationDefault() });

const firestore = new Firestore();

const videoCollectionId = "videos";

export enum VideoStatus {
  Processing = "processing",
  Processed = "processed",
}

export interface Video {
  id?: string;
  uid?: string;
  filename?: string;
  status?: VideoStatus;
  title?: string;
  description?: string;
}

const getVideo = async (videoId: string) => {
  const snapshot = await firestore
    .collection(videoCollectionId)
    .doc(videoId)
    .get();
  return snapshot.data() ?? {};
};

export const setVideo = (videoId: string, video: Video) => {
  // merge true merges the new data with the existing data (overwrites existing data)
  console.log("Setting video", videoId, video);
  return firestore
    .collection(videoCollectionId)
    .doc(videoId)
    .set(video, { merge: true });
};

export const isVideoNew = async (videoId: string) => {
  const video = await getVideo(videoId);
  return video?.status === undefined;
};
