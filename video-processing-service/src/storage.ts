import { Storage } from "@google-cloud/storage";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { dir } from "console";

const storage = new Storage();

const rawVideoBucket = "as-yt-raw-videos";
const processedVideoBucket = "as-yt-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

export const setupDirectories = () => {
  ensureDirectoryExists(localRawVideoPath);
  ensureDirectoryExists(localProcessedVideoPath);
};

export const convertVideo = (
  rawVideoName: string,
  processedVideoName: string
) => {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
      .outputOptions("-vf", "scale=-1:360")
      .on("end", () => {
        console.log("Video processing finished successfully");
        resolve();
      })
      .on("error", (err) => {
        console.log(`Internal Server Error: ${err}`);
        reject(err);
      })
      .save(`${localProcessedVideoPath}/${processedVideoName}`);
  });
};

export const downloadRawVideo = async (fileName: string) => {
  await storage
    .bucket(rawVideoBucket)
    .file(fileName)
    .download({ destination: `${localRawVideoPath}/${fileName}` });

  console.log(
    `gs://${rawVideoBucket}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
  );
};

export const uploadProcessedVideo = async (fileName: string) => {
  const bucket = storage.bucket(processedVideoBucket);

  await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
    destination: fileName,
  });

  console.log(`gs://${processedVideoBucket}/${fileName} uploaded.`);

  // needs to explicitly make public after upload
  await bucket.file(fileName).makePublic();
};

export const deleteRawVideo = (fileName: string) => {
  return deleteFile(`${localRawVideoPath}/${fileName}`);
};

export const deleteProcessedVideo = (fileName: string) => {
  return deleteFile(`${localProcessedVideoPath}/${fileName}`);
};

const deleteFile = (filePath: string) => {
  return new Promise<void>((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(`Error deleting file: ${err}`);
          reject(err);
        } else {
          console.log(`File deleted: ${filePath}`);
          resolve();
        }
      });
    }
  });
};

const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};
