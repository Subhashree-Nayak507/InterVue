"use client"

import { CallRecording } from "@stream-io/video-react-sdk";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { calculateRecordingDuration } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { CalendarIcon, ClockIcon, CopyIcon, PlayIcon } from "lucide-react";
import { Button } from "./ui/button";

function RecordingCard({ recording }: { recording: CallRecording }) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(recording.url);
      toast.success("Recording link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy link to clipboard");
    }
  };

  const formattedStartTime = recording.start_time
    ? format(new Date(recording.start_time), "MMM d, yyyy, hh:mm a")
    : "Unknown";

  const duration =
    recording.start_time && recording.end_time
      ? calculateRecordingDuration(recording.start_time, recording.end_time)
      : "Unknown duration";

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 ease-in-out border border-muted/50 hover:border-primary/50">
      {/* CARD HEADER */}
      <CardHeader className="space-y-1">
        <div className="space-y-2">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>{formattedStartTime}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <ClockIcon className="h-3.5 w-3.5" />
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      {/* CARD CONTENT */}
      <CardContent>
        <div
          className="w-full aspect-video bg-muted/50 rounded-lg flex items-center justify-center cursor-pointer group relative overflow-hidden"
          onClick={() => window.open(recording.url, "_blank")}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
          <div className="size-12 rounded-full bg-background/90 flex items-center justify-center group-hover:bg-primary transition-colors duration-300 ease-in-out z-10">
            <PlayIcon className="size-6 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-300 ease-in-out" />
          </div>
        </div>
      </CardContent>

      {/* CARD FOOTER */}
      <CardFooter className="gap-2">
        <Button
          className="flex-1 bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"
          onClick={() => window.open(recording.url, "_blank")}
        >
          <PlayIcon className="size-4 mr-2" />
          Play Recording
        </Button>
        <Button
          variant="secondary"
          className="bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          onClick={handleCopyLink}
        >
          <CopyIcon className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default RecordingCard;