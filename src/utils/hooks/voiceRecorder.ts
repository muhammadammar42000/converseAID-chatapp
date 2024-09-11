import useStore from "@/lib/zustand";
import { useEffect, useState, useRef } from "react";
import { shallow } from "zustand/shallow";
interface UseRecordVoiceReturn {
  recording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export const useRecordVoice = (
  SendVoiceResponse: any,
  open?: Boolean
): UseRecordVoiceReturn => {
  const { setNotify } = useStore(
    (state: any) => ({
      setNotify: state?.setNotify,
    }),
    shallow
  );
  // State to hold the media recorder instance
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);

  // State to track whether recording is currently in progress
  const [recording, setRecording] = useState<boolean>(false);

  // Ref to store audio chunks during recording
  const chunks = useRef<Blob[]>([]);
  let streamRef = useRef<MediaStream | null>(null);

  // Function to initialize the media recorder with the provided stream
  async function convertBlobToFile(blobData: any, fileName: any) {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  }

  // Function to start the recording
  const startRecording = () => {
    if (
      typeof window !== "undefined" &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    ) {
      // Browser supports getUserMedia
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(async (stream) => {
          const mediaRecorder = new MediaRecorder(stream);

          // Event handler when recording starts
          mediaRecorder.onstart = () => {
            chunks.current = []; // Resetting chunks array
          };

          // Event handler when data becomes available during recording
          mediaRecorder.ondataavailable = (ev: BlobEvent) => {
            chunks.current.push(ev.data); // Storing data chunks
          };

          // Event handler when recording stops
          mediaRecorder.onstop = async () => {
            // Creating a blob from accumulated audio chunks with WAV format
            const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
            let data = await convertBlobToFile(audioBlob, "audio/wav");
            SendVoiceResponse(data);
            if (mediaRecorder)
              mediaRecorder.stream
                .getAudioTracks()
                .forEach((track: any) => track.stop());

            // You can do something with the audioBlob, like sending it to a server or processing it further
          };

          setMediaRecorder(mediaRecorder);
          if (mediaRecorder) {
            setRecording(true);
            mediaRecorder.start();
          }
        })
        .catch((error) => {
          console.log(error,'----------')
          setNotify({
            message: `Error accessing microphone:${error}`,
            type: "error",
            open: true,
          });
          // Provide user feedback or fallback options
        });
    }
  };

  // Function to stop the recording
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }

      // Explicitly stop all tracks on the media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null; // Clear the ref after stopping the tracks
      }
    }
  };
  return {
    recording,
    startRecording,
    stopRecording,
  };
};
