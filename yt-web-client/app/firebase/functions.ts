import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

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

const generateUploadUrl = httpsCallable(functions, "generateUploadUrl");
const getVideosFunction = httpsCallable(functions, "getVideos");

export const uploadVideo = async (file: File) => {
  const fileExtension = file.name.split(".").pop();
  const response: any = await generateUploadUrl({ fileExtension });

  // upload file with signed url
  return await fetch(response?.data?.url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });
};

export const getVideos = async () => {
  const response = await getVideosFunction();
  return response?.data as Video[];
};
