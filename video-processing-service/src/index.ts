import express from "express";
import {
  setupDirectories,
  downloadRawVideo,
  uploadProcessedVideo,
  convertVideo,
  deleteRawVideo,
  deleteProcessedVideo,
} from "./storage";
import { isVideoNew, setVideo, VideoStatus } from "./firestore";

setupDirectories();

const app = express();
app.use(express.json());

app.post("/process-video", async (req, res) => {
  // get bucket and filename from cloud pub/sub message

  // TODO: refactor into a separate function
  let data;
  try {
    const message = Buffer.from(req.body.message.data, "base64").toString(
      "utf-8"
    );
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error("No name provided");
    }
  } catch (err) {
    console.error(err);
    return res.status(400).send("Bad Request: missing filename");
  }

  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;
  const videoId = inputFileName.split(".")[0];

  if (!isVideoNew(videoId)) {
    return res.status(400).send("Bad Request: video already processed");
  } else {
    await setVideo(videoId, {
      id: videoId,
      uid: inputFileName.split("-")[0],
      status: VideoStatus.Processing,
    });
  }

  // Download raw video from GCS
  await downloadRawVideo(inputFileName);

  try {
    await convertVideo(inputFileName, outputFileName);
  } catch (e) {
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName),
    ]);
    console.error(e);
    return res
      .status(500)
      .send("Internal Server Error: Video processing failed");
  }

  // Upload processed video to GCS
  await uploadProcessedVideo(outputFileName);

  await setVideo(videoId, {
    status: VideoStatus.Processed,
    filename: outputFileName,
  });

  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName),
  ]);

  return res.status(200).send("Processing completed successfully!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}!`));
