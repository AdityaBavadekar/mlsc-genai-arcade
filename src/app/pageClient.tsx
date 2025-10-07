"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Zap, Trophy, Users, Calendar, MapPin, User, Linkedin, Cpu, Speaker, CodeIcon } from 'lucide-react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export type Player = {
  name: string;
  rank: number;
  score: number;
};

function Leaderboard({ leaderboard }: { leaderboard: Player[] }) {
  const [players, setPlayers] = useState<Player[]>(leaderboard || []);
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-5xl mx-auto my-12 px-4">
      <div className="mx-auto mb-6"></div>
      <h2
        className="text-4xl font-extrabold text-center mb-12 tracking-widest"
        style={{
          background: "linear-gradient(135deg, #00FFF7, #FF2EF5)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Arcade Leaderboard
      </h2>

      {loading ? (
        <p className="text-center font-mono text-[#00FFF7]">Loading...</p>
      ) : (
        <div className="bg-[#1A1B26] border border-[#00FFF7] rounded-lg overflow-hidden shadow-lg">
          <div className="grid grid-cols-12 gap-2 bg-[#0D0E16] p-4 font-mono uppercase text-[#FF2EF5]">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-4">Player</div>
            <div className="col-span-3 text-right">Score</div>
          </div>

          {players.length === 0 && (
            <p className="text-center font-mono text-[#00FFF7] p-4">No players yet. Be the first to play!</p>
          )}

          {players.map((player, idx) => (
            <div
              key={player.rank}
              className={`grid grid-cols-12 gap-2 p-4 font-mono items-center ${idx % 2 === 0 ? "bg-[#1A1B26]" : "bg-[#161724]"
                } hover:bg-[#0f1018] transition-all`}
            >
              <div className="col-span-1 text-center text-[#00FFF7]">
                {idx < 3 ? <Trophy className="inline w-5 h-5 text-yellow-400" /> : idx + 1}
              </div>
              <div className="col-span-4 flex items-center gap-2 text-[#FF2EF5]">
                <User className="w-5 h-5" />
                {player.name}
              </div>
              <div className="col-span-3 text-right text-[#FF2EF5]">{player.score}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const messages = [
  "Hey there, ready to explore some generative magic?",
  "Welcome to the GEN AI ARCADE!",
  "Hello there!"
];


function ArcadeAIBot() {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let charIndex = 0;
    setDisplayText('');
    setTyping(true);

    const typingInterval = setInterval(() => {
      if (charIndex < messages[index].length) {
        const nextChar = messages[index][charIndex];
        if (nextChar !== undefined) {
          setDisplayText((prev) => prev + nextChar);
        }
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTyping(false);

        setTimeout(() => {
          setIndex((prev) => (prev + 1) % messages.length);
        }, 2500);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [index]);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="border border-cyan-400 p-4 rounded-xl text-cyan-300 font-mono text-lg sm:text-xl min-h-[15vh] max-w-xl w-full text-center relative overflow-hidden justify-center flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {displayText}
            {typing && <span className="animate-pulse text-cyan-100">█</span>}
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 pointer-events-none opacity-[0.07] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#0ff1_3px)]"></div>
      </div>
    </div>
  );
}

const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [lines, setLines] = useState<string[]>([]);
  const bootMessages = [
    '> Initializing Neural Systems...',
    '> Loading GEN AI ARCADE environment...',
    '> Connecting to quantum processors...',
    '> Ready.',
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootMessages.length) {
        setLines(prev => [...prev, bootMessages[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 200);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0B0C10] z-50 flex items-center justify-center">
      <div className="font-mono text-[#39FF14] text-lg space-y-2">
        {lines.map((line, i) => (
          <div key={i} className="animate-pulse">{line}</div>
        ))}
      </div>
    </div>
  );
};


function HeroCountdown() {
  const targetDate = new Date("2025-10-10T10:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  return (
    <div className="relative z-10 w-full flex flex-col px-4 sm:px-8 min-h-[85vh] justify-center items-center text-white">
      {/* Logo & Header */}
      <div className="flex flex-col items-center mt-12 sm:mt-16">
        <img
          src="/logo.jpg"
          alt="MLSC VIT Pune Logo"
          className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 rounded-full"
        />

        <div className="text-center mb-8 sm:mb-12">
          <p className="text-[#00FFF7] text-lg sm:text-xl md:text-2xl font-mono tracking-widest uppercase">
            MLSC VIT Pune
          </p>
          <p className="text-[#FF2EF5] text-base sm:text-lg md:text-xl font-mono tracking-widest uppercase">
            Presents
          </p>
        </div>
      </div>

      <h1
        className="text-[10vw] sm:text-[8vw] md:text-[6vw] font-extrabold mb-8 sm:mb-12 tracking-widest neon-text text-center"
        style={{
          textShadow: `
          0 0 15px #00FFF7,
          0 0 25px #00FFF7,
          0 0 35px #FF2EF5,
          0 0 60px #FF2EF5,
          0 0 80px #FF2EF5
        `,
          animation: "flicker 4s infinite alternate",
          lineHeight: "1.1",
        }}
      >
        GEN AI ARCADE
      </h1>

      <p
        className="text-[4vw] sm:text-[2.5vw] md:text-3xl font-mono text-center mb-8 sm:mb-16"
        style={{
          color: "#00FFF7",
          textShadow: "0 0 6px #00FFF7, 0 0 12px #00FFF7",
          letterSpacing: "1.5px",
          lineHeight: "1.5",
          animation: "scanline 2s infinite linear",
          maxWidth: "95%",
        }}
      >
        THE FUTURE OF AI & ITS REAL-WORLD IMPACT
      </p>

      {/* Countdown */}
      <div className="grid md:grid-cols-4 grid-cols-3 gap-4 sm:gap-8 w-full max-w-3xl font-mono text-[3vw] md:text-[1.5vw] tracking-widest uppercase text-[#00FFF7] mb-8 justify-items-center">
        <div className="flex flex-col items-center">
          <span>{timeLeft.days}</span>
          <span className="text-xs sm:text-sm mt-1">Days</span>
        </div>
        <div className="flex flex-col items-center animate-pulse">
          <span>{timeLeft.hours}</span>
          <span className="text-xs sm:text-sm mt-1">Hours</span>
        </div>
        <div className="flex flex-col items-center animate-pulse">
          <span>{timeLeft.minutes}</span>
          <span className="text-xs sm:text-sm mt-1">Minutes</span>
        </div>
        <div className="flex flex-col items-center animate-pulse hidden md:flex">
          <span>{timeLeft.seconds}</span>
          <span className="text-xs sm:text-sm mt-1">Seconds</span>
        </div>
      </div>

      {/*   {/* Register Button */}
      {/*   <div className="mt-6 sm:mt-12 flex justify-center w-full"> */}
      {/*     <a */}
      {/*       href="https://forms.google.com" */}
      {/*       target="_blank" */}
      {/*       rel="noopener noreferrer" */}
      {/*       className=" */}
      {/*   px-8 sm:px-12 md:px-16 py-4 sm:py-5 md:py-6  */}
      {/*   text-lg sm:text-xl md:text-2xl font-extrabold uppercase  */}
      {/*   rounded-lg tracking-widest flex items-center justify-center  */}
      {/*   transition-all duration-300 text-center */}
      {/* " */}
      {/*       style={{ */}
      {/*         background: "linear-gradient(135deg, #00FFF7, #FF2EF5, #39FF14)", // default on mobile */}
      {/*         border: "4px solid #00FFF7", */}
      {/*         color: "#000", // readable on gradient */}
      {/*         textShadow: "2px 2px #000", */}
      {/*       }} */}
      {/*       onMouseEnter={(e) => { */}
      {/*         if (window.innerWidth >= 640) { // hover only for sm and up */}
      {/*           const el = e.currentTarget as HTMLAnchorElement; */}
      {/*           el.style.background = "linear-gradient(135deg, #00FFF7, #FF2EF5, #39FF14)"; */}
      {/*           el.style.color = "#000"; */}
      {/*         } */}
      {/*       }} */}
      {/*       onMouseLeave={(e) => { */}
      {/*         if (window.innerWidth >= 640) { */}
      {/*           const el = e.currentTarget as HTMLAnchorElement; */}
      {/*           el.style.background = "transparent"; */}
      {/*           el.style.color = "#00FFF7"; */}
      {/*         } */}
      {/*       }} */}
      {/*     > */}
      {/*       REGISTER NOW */}
      {/*     </a> */}
      {/*   </div> */}
      {/**/}

      <div className="mt-6 sm:mt-12 flex justify-center w-full">
        <a
          href="https://forms.gle/o2WQ6fdcZ7dtkgcWA"
          target="_blank"
          rel="noopener noreferrer"
          className="
      px-8 sm:px-12 md:px-16 py-4 sm:py-5 md:py-6 
      text-lg sm:text-xl md:text-2xl font-extrabold uppercase 
      rounded-lg tracking-widest flex items-center justify-center 
      transition-all duration-300 text-center
    "
          style={{
            background: "linear-gradient(135deg, #00FFF7, #FF2EF5, #39FF14)", // default on mobile
            border: "4px solid #00FFF7",
            color: "#000", // readable on gradient
            textShadow: "2px 2px #000",
          }}
        >
          REGISTER NOW
        </a>
      </div>



    </div>
  );
}



const KeynoteSpeakerSection = () => {
  return (
    <div className="max-w-5xl mx-auto mb-20">
      <div
        className="relative bg-[#1A1B26] rounded-xl border-4 border-[#00FFF7] overflow-hidden flex flex-col md:flex-row items-center md:items-stretch"
        style={{
          boxShadow: '0 0 10px rgba(0, 255, 247, 0.2)',
        }}
      >
        <div className="md:w-1/3 w-full relative">
          <img
            src="/speaker_avatar.png"
            alt="Aditya Rane"
            className="w-full h-full object-cover md:rounded-l-xl rounded-t-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1A1B26]/30 pointer-events-none animate-[pixelScan_3s linear infinite]"></div>
        </div>

        <div className="md:w-2/3 w-full p-8 text-left flex flex-col justify-center">
          <h2
            className="text-4xl font-bold mb-3 tracking-[2px] pixel-font"
            style={{
              background: 'linear-gradient(135deg, #00FFF7, #FF2EF5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            KEYNOTE SPEAKER
          </h2>
          <p className="text-3xl font-bold text-[#00FFF7] mb-1 pixel-font">Aditya Rane</p>
          <p className="text-sm text-gray-400 mb-4">AI Consultant @ Google</p>
          <p className="text-[#E2E8F0] leading-relaxed mb-6 pixel-font">
            Aditya brings years of experience in AI and Generative systems, helping
            shape Google’s large-scale AI architectures. He’ll dive into how real-world
            AI systems are evolving towards creative autonomy.
          </p>

          <a
            href="https://linkedin.com/in/aditya-rane"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-bold text-[#00FFF7] pixel-font border-2 border-[#00FFF7] hover:bg-[#00FFF7]/20 transition-all duration-300"
          >
            <Linkedin className="w-5 h-5" />
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

const EventInfoCards = () => {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto mb-16 px-4 sm:px-6">

      {/* Date & Time */}
      <div className="bg-[#1A1B26] p-6 sm:p-8 rounded-2xl border-2 border-[#FF2EF5] flex flex-col items-center text-center shadow-[0_0_20px_#FF2EF5] hover:shadow-[0_0_30px_#FF2EF5] transition-all duration-300">
        <Calendar className="w-12 h-12 mb-4 text-[#FF2EF5] animate-pulse" />
        <h3 className="text-xl sm:text-2xl font-extrabold mb-2 tracking-wider text-[#FF2EF5] neon-text">
          DATE & TIME
        </h3>
        <p className="text-lg sm:text-xl font-mono text-[#00FFF7] mb-1">10th October 2025</p>
        <p className="text-sm sm:text-base font-mono text-[#FF2EF5]">10:00 AM onwards</p>
      </div>

      {/* Venue */}
      <div className="bg-[#1A1B26] p-6 sm:p-8 rounded-2xl border-2 border-[#39FF14] flex flex-col items-center text-center shadow-[0_0_20px_#39FF14] hover:shadow-[0_0_30px_#39FF14] transition-all duration-300">
        <MapPin className="w-12 h-12 mb-4 text-[#39FF14] animate-pulse" />
        <h3 className="text-xl sm:text-2xl font-extrabold mb-2 tracking-wider text-[#39FF14] neon-text">
          VENUE
        </h3>
        <p className="text-lg sm:text-xl font-mono text-[#00FFF7] mb-1">Seminar Hall</p>
        <p className="text-sm sm:text-base font-mono text-[#39FF14]">VIT Pune, Bibwewadi Campus</p>
      </div>

    </div>
  );
}; const AI_ICONS = [
  { name: "ChatGPT", src: "/icons/openai.png" },
  { name: "Ollama", src: "/icons/ollama.png" },
  { name: "Microsoft Copilot", src: "/icons/copilot.png" },
  { name: "Google Gemini", src: "/icons/unnamed.png" },
  { name: "Anthropics Claude", src: "/icons/unnamed.webp" },
  { name: "Meta LLaMA", src: "/icons/meta.png" }
];

function AiIconsShowcase() {
  return (
    <div className="relative w-full h-[300px] overflow-hidden rounded-2xl flex flex-wrap justify-center items-center gap-8 p-8">
      {AI_ICONS.map((icon, idx) => {
        return (
          <div
            key={idx}
            className="relative flex flex-col items-center"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg flex items-center justify-center">
              <Image
                src={icon.src}
                alt={icon.name}
                width={48}
                height={48}
                className="object-contain rounded-full"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const ArcadeBase = () => {
  const router = useRouter();
  const onEnterArcadeClick = () => {
    router.push('/arcade');
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-press-start text-3xl md:text-4xl text-[#f7b731] leading-relaxed">
          The Arcade Game
        </h1>

        <p className="font-vt323 text-lg md:text-xl text-[#00FFF7] mb-4 leading-relaxed mt-8">
          Welcome to the ultimate AI playground! Explore, compete, and experience the future of Generative AI in real-time games and challenges.
        </p>
        <p className="font-vt323 text-lg md:text-xl text-[#FF2EF5] mb-8">
          Complete challenges, rise up the leaderboard, and earn your spot as an AI Arcade champion.
        </p>

        {/* <button */}
        {/*   className=" */}
        {/*     font-press-start text-xl text-black  */}
        {/*     bg-[#E9438D]  */}
        {/*     px-12 py-4 mt-8  */}
        {/*     border-b-4 border-[#C73B7C]  */}
        {/*     hover:bg-[#d83c7f] hover:border-[#b63570] */}
        {/*     active:border-b-0 active:translate-y-1 */}
        {/*     transition-transform duration-100 ease-in-out rounded-lg" */}
        {/* > */}
        {/*   START! */}
        {/* </button> */}

        <button
          onClick={onEnterArcadeClick}
          className={`
            relative px-12 py-5 font-extrabold text-lg md:text-xl tracking-widest 
            rounded-lg uppercase overflow-hidden cursor-pointer flex items-center
            text-[#00FFF7] border-2 border-[#00FFF7] hover:text-[#1A1B26] 
            hover:bg-gradient-to-r hover:from-[#00FFF7] hover:via-[#FF2EF5] hover:to-[#39FF14]
            
          `}
          style={{ letterSpacing: "2px" }}
        >
          <Zap className="inline mr-8 sm:hidden" /> ENTER THE ARCADE
        </button>
      </div>
    </div>
  );
};


const WhyJoinSection = () => {
  return (
    <section className="w-full py-16 bg-[#0B0C10] text-white flex flex-col items-center px-6 md:px-16">
      <h2
        className="text-4xl md:text-5xl font-extrabold my-18 text-center neon-text"
        style={{
          textShadow: `
            0 0 10px #00FFF7,
            0 0 20px #00FFF7,
            0 0 30px #FF2EF5
          `,
          lineHeight: "1.2",
        }}
      >
        WHY JOIN THE GEN AI ARCADE?
      </h2>

      <div className="grid gap-8 md:gap-12 md:grid-cols-3 w-full max-w-6xl text-center">
        <div className="bg-[#1A1B26] rounded-xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300">
          <CodeIcon className="w-16 h-16 mb-4 text-[#00FFF7]" />
          <h3 className="text-2xl font-bold mb-2 text-[#00FFF7] min-h-[5rem] flex items-center justify-center">
            Hands-on Workshop
          </h3>
          <p className="text-gray-300 text-sm md:text-base">
            Gain practical experience with AI tools and implement projects under guidance.
          </p>
        </div>

        <div className="bg-[#1A1B26] rounded-xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300">
          <Speaker className="w-16 h-16 mb-4 text-[#FF2EF5]" />
          <h3 className="text-2xl font-bold mb-2 text-[#FF2EF5] min-h-[5rem] flex items-center justify-center">
            Gen AI Tech Talks
          </h3>
          <p className="text-gray-300 text-sm md:text-base">
            Learn the latest trends in AI from keynote speakers and industry experts.
          </p>
        </div>

        <div className="bg-[#1A1B26] rounded-xl p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300">
          <Users className="w-16 h-16 mb-4 text-[#39FF14]" />
          <h3 className="text-2xl font-bold mb-2 text-[#39FF14] min-h-[5rem] flex items-center justify-center">
            Networking
          </h3>
          <p className="text-gray-300 text-sm md:text-base">
            Meet peers, collaborate on ideas, and connect with fellow students and enthusiasts.
          </p>
        </div>
      </div>
    </section>
  );
}

const LandingPage = ({ leaderboard }: { leaderboard: Player[] }) => {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#E2E8F0] relative overflow-hidden sm:px-3">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#00FFF7 1px, transparent 1px), linear-gradient(90deg, #00FFF7 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }} />
      </div>

      <style jsx>{`
  .neon-text {
    text-transform: uppercase;
    letter-spacing: 3px;
    text-shadow: 0 0 15px #00FFF7, 0 0 30px #00FFF7;
  }

  .glow-btn {
    background: linear-gradient(90deg, rgba(0,255,247,0.2), rgba(255,46,245,0.2));
    border: 1px solid rgba(0,255,247,0.6);
    backdrop-filter: blur(8px);
    box-shadow: 0 0 15px rgba(0,255,247,0.3);
    transition: all 0.3s ease;
  }

  .glow-btn:hover {
    box-shadow: 0 0 25px rgba(0,255,247,0.6), 0 0 45px rgba(255,46,245,0.4);
    transform: scale(1.05);
  }

  .scanline {
    position: relative;
    overflow: hidden;
  }

  .scanline::after {
    content: "";
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: repeating-linear-gradient(
      to bottom,
      rgba(255,255,255,0.03) 0px,
      rgba(255,255,255,0.03) 1px,
      transparent 2px,
      transparent 4px
    );
    pointer-events: none;
    animation: scan 6s linear infinite;
  }

  @keyframes scan {
    0% { transform: translateY(0); }
    100% { transform: translateY(100%); }
  }

  @keyframes flicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
      opacity: 1;
    }
    20%, 22%, 24%, 55% {
      opacity: 0.4;
    }
  }

  @keyframes scanline {
    0% { background-position: 0 0; }
    100% { background-position: 0 100%; }
  }

`}</style>

      <HeroCountdown />

      {/* <AiIconsShowcase /> */}

      <KeynoteSpeakerSection />

      <div>
        <div>
          <EventInfoCards />
          <WhyJoinSection />
          <ArcadeAIBot />
          <ArcadeBase />
          <Leaderboard leaderboard={leaderboard} />
        </div>

        {/* Footer */}
        <footer className="mt-20 bg-[#0F111A] py-12 border-t-4 border-[#00FFF7]">
          <div className="max-w-5xl mx-auto text-center">
            <div className="h-2 w-48 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4285F4] via-[#FBBC05] to-[#34A853]"></div>
              <div className="absolute inset-0 border-t-4 border-[#00FFF7]"></div>
            </div>

            <p className="font-mono text-lg md:text-xl tracking-widest text-[#00FFF7] uppercase">
              Powered by <br /> Microsoft Learn Student Chapter, VIT Pune
            </p>

            <div className="flex justify-center mt-6 gap-2">
              <div className="w-2 h-2 bg-[#FF2EF5]"></div>
              <div className="w-2 h-2 bg-[#00FFF7]"></div>
              <div className="w-2 h-2 bg-[#FF2EF5]"></div>
              <div className="w-2 h-2 bg-[#00FFF7]"></div>
            </div>
          </div>
        </footer>

      </div>

      <style>{`
        @keyframes gridMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
      `}</style>
    </div>
  );
};

export default function GenAIArcadeClientPage({ leaderboard }: { leaderboard: Player[] }) {
  const [stage, setStage] = useState('boot');
  const [finalScore, setFinalScore] = useState(0);

  const handleBootComplete = () => setStage('landing');

  return (
    <>
      {stage === 'boot' && <BootSequence onComplete={handleBootComplete} />}
      {stage === 'landing' && <LandingPage leaderboard={leaderboard} />}
    </>
  );
}
