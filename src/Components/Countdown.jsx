import React, { useState, useEffect, useCallback, useRef } from "react";
import bg_vid from "../assets/videos/BG.mp4";
import earth_hour from "../assets/videos/earthour.mp4";
import lights_on from "../assets/videos/earthour.mp4"; // New video for Lights On phase
import landco from "../assets/pictures/landco.png";

const Countdown = () => {
  // Initial target for the Earth Hour countdown phase.
  const initialTarget = new Date("March 22, 2025 20:30:00").getTime();
  const [phase, setPhase] = useState("earthHourCountdown"); // "earthHourCountdown", "earthHourVideo", "lightsOnCountdown", "lightsOnVideo"
  const [target, setTarget] = useState(initialTarget);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(initialTarget));
  const videoRef = useRef(null);

  function calculateTimeLeft(targetDate) {
    const now = new Date().getTime();
    const difference = targetDate - now;
    return difference > 0
      ? {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        }
      : null;
  }

  // Update the countdown timer when in a countdown phase.
  useEffect(() => {
    if (phase.endsWith("Countdown")) {
      const timer = setInterval(() => {
        const newTimeLeft = calculateTimeLeft(target);
        setTimeLeft(newTimeLeft);
        if (!newTimeLeft) {
          // When countdown finishes, transition to the appropriate video phase.
          if (phase === "earthHourCountdown") {
            setPhase("earthHourVideo");
          } else if (phase === "lightsOnCountdown") {
            setPhase("lightsOnVideo");
          }
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [target, phase]);

  // When a video phase is active, try to play the video with sound.
  useEffect(() => {
    if (!phase.endsWith("Countdown") && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch((err) => {
        console.warn("Auto-play with sound was blocked.", err);
      });
    }
  }, [phase]);

  // Handle video end events for each video phase.
  const handleVideoEnd = useCallback(() => {
    if (phase === "earthHourVideo") {
      // After Earth Hour video ends, start the Lights On countdown.
      const newTarget = new Date("March 22, 2025 21:30:00").getTime();
      setTarget(newTarget);
      setTimeLeft(calculateTimeLeft(newTarget));
      setPhase("lightsOnCountdown");
    } else if (phase === "lightsOnVideo") {
      // After the Lights On video ends, you can either restart a countdown,
      // loop the video, or set a new target as needed.
      // For this example, we simply log that the Lights On video ended.
      console.log("Lights On video ended.");
      // Optionally, reset to a new countdown phase or do another action.
    }
  }, [phase]);

  return (
    <div className="relative flex flex-col justify-center my-22">
      {phase.endsWith("Countdown") ? (
        // During countdown phases, show the background video.
        <video
          src={bg_vid}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-100% object-cover z-0"
        />
      ) : phase === "earthHourVideo" ? (
        <video
          ref={videoRef}
          src={earth_hour}
          autoPlay
          playsInline
          muted={false}
          onEnded={handleVideoEnd}
          className="absolute top-0 left-0 w-full h-100% object-cover z-20"
        />
      ) : (
        // phase === "lightsOnVideo"
        <video
          ref={videoRef}
          src={lights_on}
          autoPlay
          playsInline
          muted={false}
          onEnded={handleVideoEnd}
          className="absolute top-0 left-0 w-full h-100% object-cover z-20"
        />
      )}

      <div className="relative z-10 text-center text-white font-bold p-8">
        <div className="w-full flex flex-row justify-center">
          <img className="h-60" src={landco} alt="landco.png" />
        </div>

        <div className="text-[4rem] drop-shadow-[0_0_10px_rgba(52,204,235,0.8)]">
          {phase === "earthHourCountdown" || phase === "earthHourVideo" ? (
            <>
              <p className="uppercase">Earth Hour 2025</p>
              <p className="uppercase">Countdown</p>
              <p className="text-3xl">#BiggestHourForEarth</p>
            </>
          ) : (
            <>
              <p className="uppercase">Countdown to Lights On</p>
              <p className="text-3xl">#LightsOnSoon</p>
            </>
          )}
        </div>

        {phase.endsWith("Countdown") && timeLeft && (
          <div className="flex justify-center gap-24 text-[8rem] drop-shadow-[0_0_10px_rgba(104,201,68,0.8)] uppercase ">
            <div className="flex flex-col items-center">
              <span className="text-white rounded-full p-4 shadow-md">
                {timeLeft.days || "0"}
              </span>
              <span className="text-lg text-white">Days</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white rounded-full p-4 shadow-md">
                {timeLeft.hours || "0"}
              </span>
              <span className="text-lg text-white">Hours</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white rounded-full p-4 shadow-md">
                {timeLeft.minutes || "0"}
              </span>
              <span className="text-lg text-white">Minutes</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-white rounded-full p-4 shadow-md">
                {timeLeft.seconds || "0"}
              </span>
              <span className="text-lg text-white">Seconds</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Countdown;
