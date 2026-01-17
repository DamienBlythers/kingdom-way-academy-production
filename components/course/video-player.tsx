"use client";

import { useRef, useEffect, useState } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  lessonId: string;
  onVideoComplete?: () => void;
}

export function VideoPlayer({ videoUrl, lessonId, onVideoComplete }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [watchTime, setWatchTime] = useState(0);
  const [hasWatchedThreshold, setHasWatchedThreshold] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = async () => {
      const currentTime = video.currentTime;
      const duration = video.duration;
      
      // Track watch time every 5 seconds
      if (Math.floor(currentTime) % 5 === 0 && currentTime !== watchTime) {
        setWatchTime(currentTime);
        
        // Save progress to backend
        try {
          await fetch("/api/progress/video", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lessonId,
              watchTime: Math.floor(currentTime),
            }),
          });
        } catch (error) {
          console.error("Failed to save video progress:", error);
        }
      }

      // Check if user has watched 90% of the video
      if (!hasWatchedThreshold && duration && (currentTime / duration) >= 0.9) {
        setHasWatchedThreshold(true);
        onVideoComplete?.();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [lessonId, watchTime, hasWatchedThreshold, onVideoComplete]);

  return (
    <div className="w-full h-full">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        controlsList="nodownload"
        src={videoUrl}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}