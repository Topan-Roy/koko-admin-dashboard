import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";

export default function AudioBarsPlayer() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const bars = new Array(25).fill(0); // number of bars

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (!isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Progress ratio (0 to 1)
  const progress = duration ? currentTime / duration : 0;

  return (
    <div className="w-full max-w-xl p-4 rounded-lg flex items-center space-x-4 justify-between">
      {/* Play/Pause button */}
      <button
        onClick={togglePlay}
        className="p-3 rounded-full bg-gray-200 hover:bg-gray-300"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      {/* Audio bars */}
      <div className="flex items-end space-x-[2px] flex-1 h-16">
        {bars.map((_, i) => {
          // Calculate bar height (simulate waveform)
          const barHeight =
            20 + (Math.sin(i + progress * bars.length) * 15 + 15); // animating feel

          return (
            <div
              key={i}
              className="w-[3px] bg-blue-500 rounded"
              style={{
                height: `${barHeight}px`,
                opacity: i / bars.length < progress ? 1 : 0.4, // highlight progress
                transition: "height 0.2s ease",
              }}
            />
          );
        })}
      </div>

      {/* Time */}
      <div className="text-sm text-gray-600 w-20 text-right">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="/audio/sample.mp3" // <-- replace with your audio file
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
