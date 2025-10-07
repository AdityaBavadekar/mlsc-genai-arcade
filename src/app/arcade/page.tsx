"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Zap, Trophy, Users, Calendar, MapPin, User, Linkedin, Shield, Target, Crosshair, AlertTriangle, Clock, UserPlus, BubblesIcon, Globe } from 'lucide-react';
import { Player } from '../pageClient';
import Image from 'next/image';

type Enemy = {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
};

const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [lines, setLines] = useState<string[]>([]);
  const bootMessages = [
    '> Initializing Neural Systems...',
    '> Loading GEN AI ARCADE environment...',
    '> Connecting to quantum processors...',
    '> Loading the spaceship control module...',
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

type GameState = {
  player: { x: number; y: number; width: number; height: number; speed: number };
  bullets: { x: number; y: number; width: number; height: number; speed: number }[];
  enemies: Enemy[];
  keys: { [key: string]: boolean };
  score: number;
  gameRunning: boolean;
  spawnCooldown: number;
  startTime: number;
  gameOverReason: number; // 0 = time up, 1 = hit, 2 = won
};

const NameInput = ({ onNameInputComplete, score }: { onNameInputComplete: (name: string) => void, score: number }) => {
  const [playerName, setPlayerName] = useState('');
  const [savedName, setSavedName] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('player.name') || '';
    setPlayerName(savedName);
  }, []);

  const onSaveClick = async () => {
    if (!playerName.trim()) return alert("Enter your name first!");
    localStorage.setItem("player.name", playerName);
    setSavedName(playerName);
    await savePlayerScore(playerName, score);
    onNameInputComplete(playerName);
  };

  return (
    <div>
      {savedName != '' ? (
        <p className="text-sm text-[#888] mb-6 font-mono">
          Saved as: <span className="font-bold text-[#39FF14]">{savedName}</span>
        </p>
      ) : (
        <div className="flex flex-col items-center mb-6">
          <label className="text-[#00FFF7] font-mono text-lg mb-6">
            Enter Your Name:
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="px-4 py-3 w-64 text-center text-[#00FFF7] bg-[#0B0C10] border-2 border-[#00FFF7] rounded-md font-mono focus:outline-none focus:border-[#39FF14] transition"
            placeholder="PLAYER_1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveClick();
            }}
            autoFocus
          />
        </div>
      )}

      <div className="flex  items-center justify-center gap-6 text-sm font-mono text-[#E2E8F0] mb-4">
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 rounded-lg font-bold text-md  cursor-pointer hover:scale-105 text-center"
          style={{
            borderColor: '#FF2EF5',
            color: '#FF2EF5',
          }}
        >
          RETRY
        </button>
        <button
          onClick={() => onSaveClick()}
          className="px-8 py-3 rounded-lg font-bold text-md  cursor-pointer hover:scale-105 text-center"
          style={{
            background: "linear-gradient(135deg, #007F7F, #7F007F)"
          }}
        >
          SAVE SCORE
        </button>
      </div>
    </div>
  );
}

let playerRealStatus: Player | null = null;

const savePlayerScore = async (name: string, score: number) => {
  try {
    const res = await fetch('/api/arcade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score }),
    });
    if (!res.ok) throw new Error('Failed to save score');
    const data = await res.json();
    playerRealStatus = data.player;
    return true;
  } catch (error) { }
  return false;
}

const SpaceshipGame = ({ onGameComplete }: { onGameComplete: (score: number, won?: boolean) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const GAME_DURATION = 60; // seconds
  const [remainingTime, setRemainingTime] = useState(GAME_DURATION);
  const [isMobile, setIsMobile] = useState(false);
  const gameStateRef = useRef<GameState>({
    player: { x: 400, y: 500, width: 40, height: 40, speed: 2.5 },
    bullets: [],
    enemies: [],
    keys: {},
    score: 0,
    gameRunning: true,
    spawnCooldown: 0,
    startTime: -1,
    gameOverReason: -1
  });

  useEffect(() => {
    // Detect mobile device
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = gameStateRef.current;
    let lastTime = performance.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      state.keys[e.key] = true;
      if (e.key === " ") {
        e.preventDefault();
        state.bullets.push({
          x: state.player.x + state.player.width / 2 - 2,
          y: state.player.y,
          width: 4,
          height: 15,
          speed: 7,
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      state.keys[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Mobile touch controls
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;
      
      // Fire bullets on tap
      state.bullets.push({
        x: state.player.x + state.player.width / 2 - 2,
        y: state.player.y,
        width: 4,
        height: 15,
        speed: 7,
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      
      // Move player to touch X position
      const canvasScale = canvas.width / rect.width;
      const gameX = touchX * canvasScale;
      state.player.x = Math.max(0, Math.min(canvas.width - state.player.width, gameX - state.player.width / 2));
    };

    if (isMobile) {
      canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    }

    const gameLoop = (time: number) => {
      const delta = (time - lastTime) / 1000; // seconds
      lastTime = time;

      if (!state.gameRunning) return;
      if (state.startTime == -1)
        state.startTime = Date.now();

      if (remainingTime <= 0) {
        state.gameOverReason = 0;
        ctx.fillStyle = "#00FFF7";
        ctx.font = "bold 36px monospace";
        ctx.textAlign = "center";
        ctx.fillText("TIME'S UP!", canvas.width / 2, canvas.height / 2);
        setGameOver(true);
        state.gameRunning = false;
        return; // stop further updates
      }

      ctx.fillStyle = "#0B0C10";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines for retro look
      ctx.strokeStyle = "#00FFF722";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // --- Movement ---
      const moveDist = state.player.speed * (delta * 60); // normalized for FPS
      if (state.keys["ArrowLeft"]) state.player.x = Math.max(0, state.player.x - moveDist);
      if (state.keys["ArrowRight"]) state.player.x = Math.min(canvas.width - state.player.width, state.player.x + moveDist);

      // Draw player
      ctx.fillStyle = "#00FFF7";
      ctx.beginPath();
      ctx.moveTo(state.player.x + state.player.width / 2, state.player.y);
      ctx.lineTo(state.player.x, state.player.y + state.player.height);
      ctx.lineTo(state.player.x + state.player.width, state.player.y + state.player.height);
      ctx.closePath();
      ctx.fill();

      // --- Bullets ---
      state.bullets = state.bullets.filter((bullet) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) return false;
        ctx.fillStyle = "#39FF14";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        return true;
      });

      // --- Enemy Spawning (Controlled) ---
      state.spawnCooldown -= delta;
      if (state.spawnCooldown <= 0) {
        const enemyWidth = 30;
        const enemyHeight = 30;
        const minSpeed = 0.4;
        const maxSpeed = 1.1;
        state.enemies.push({
          x: Math.random() * (canvas.width - enemyWidth),
          y: -enemyHeight,
          width: enemyWidth,
          height: enemyHeight,
          speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
        });

        // next spawn between 0.8–1.8 seconds
        state.spawnCooldown = 0.8 + Math.random() * 1.0;
      }

      // --- Enemies ---
      state.enemies = state.enemies.filter((enemy: Enemy) => {
        enemy.y += enemy.speed * (delta * 60);
        if (enemy.y > canvas.height) return false;

        // Collision with bullets
        for (let i = state.bullets.length - 1; i >= 0; i--) {
          const bullet = state.bullets[i];
          if (
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y
          ) {
            state.bullets.splice(i, 1);
            state.score += 10;
            setScore(state.score);
            return false;
          }
        }

        // Collision with player
        if (
          state.player.x < enemy.x + enemy.width &&
          state.player.x + state.player.width > enemy.x &&
          state.player.y < enemy.y + enemy.height &&
          state.player.y + state.player.height > enemy.y
        ) {
          state.gameOverReason = 1;
          state.gameRunning = false;
          setGameOver(true);
          return false;
        }

        ctx.fillStyle = "#FF2EF5";
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        return true;
      });

      if (state.score >= 1000) {
        state.gameOverReason = 2;
        state.gameRunning = false;
        setWon(true);
        setGameOver(true);
      }

      if (state.gameRunning) requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (isMobile) {
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [isMobile]);

  useEffect(() => {
    const state = gameStateRef.current;
    const timer = setInterval(() => {
      if (!state.gameRunning) return;
      setRemainingTime((prev) => {
        const newTime = prev - 0.1;
        if (newTime <= 0) {
          state.gameOverReason = 0;
          state.gameRunning = false;
          setGameOver(true);
          return 0;
        }
        return newTime;
      });

      if (remainingTime <= 0) {
        state.gameRunning = false;
        setGameOver(true);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [remainingTime]);

  return (
    <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center p-2 sm:p-4">
      <div className="text-center max-w-4xl w-full">
        {/* Header */}
        <div className="mb-6 animate-[fadeIn_0.5s_ease-in]">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Zap className="w-10 h-10 text-[#00FFF7] animate-pulse" />
            <h1 className="text-5xl font-bold tracking-wider text-[#00FFF7]">
              NEURAL DEFENDER
            </h1>
            <Zap className="w-10 h-10 text-[#00FFF7] animate-pulse" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#FF2EF5] animate-bounce" />
            <p className="text-lg font-mono text-[#FF2EF5] tracking-wide">
              HOSTILE AI DETECTED - ELIMINATE ALL THREATS
            </p>
            <AlertTriangle className="w-5 h-5 text-[#FF2EF5] animate-bounce" />
          </div>
        </div>

        {/* Stats Display */}
        <div className="flex justify-center gap-4 sm:gap-8 mb-4 flex-wrap">
          <div className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl font-mono px-3 sm:px-6 py-2 sm:py-3 rounded-lg border-2 border-[#00FFF7] bg-[#0B0C10] transition-all hover:scale-105">
            <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-[#00FFF7]" />
            <span className="text-[#00FFF7]">
              TIME: {remainingTime?.toFixed(1)}s
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl font-mono px-3 sm:px-6 py-2 sm:py-3 rounded-lg border-2 border-[#39FF14] bg-[#0B0C10] transition-all hover:scale-105">
            <Target className="w-4 h-4 sm:w-6 sm:h-6 text-[#39FF14]" />
            <span className="text-[#39FF14]">POINTS: {score}</span>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border-4 rounded-lg border-[#00FFF7] bg-black animate-[fadeIn_1s_ease-in] max-w-full h-auto"
            style={{ touchAction: 'none', maxWidth: isMobile ? '100vw' : '800px', height: 'auto' }}
          />
        </div>

        {/* Controls */}
        <div className="mt-6 space-y-3 animate-[slideUp_0.8s_ease-out]">
          <div className="flex items-center justify-center gap-2">
            <Crosshair className="w-5 h-5 text-[#39FF14]" />
            <div className="text-xl font-bold font-mono text-[#39FF14]">
              CONTROLS
            </div>
            <Crosshair className="w-5 h-5 text-[#39FF14]" />
          </div>
          <div className="flex justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono text-[#E2E8F0] flex-wrap">
            {!isMobile ? (
              <>
                <span className="px-3 sm:px-4 py-2 rounded bg-[#1A1B26] border border-[#00FFF7] transition-all hover:border-[#00FFF7] hover:bg-[#00FFF710]">
                  ← → MOVE
                </span>
                <span className="px-3 sm:px-4 py-2 rounded bg-[#1A1B26] border border-[#39FF14] transition-all hover:border-[#39FF14] hover:bg-[#39FF1410]">
                  SPACE FIRE
                </span>
              </>
            ) : (
              <>
                <span className="px-3 sm:px-4 py-2 rounded bg-[#1A1B26] border border-[#00FFF7] transition-all">
                  DRAG TO MOVE
                </span>
                <span className="px-3 sm:px-4 py-2 rounded bg-[#1A1B26] border border-[#39FF14] transition-all">
                  TAP TO FIRE
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-[#888] mt-2 font-mono">
            » Eliminate 100 hostile AI units to stabilize the neural core «
          </p>
        </div>


        {gameOver && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div
              className="bg-[#1A1B26] rounded-xl border-3 text-center max-w-md w-full sm:max-w-lg p-6 sm:p-12"
              style={{ borderColor: won ? '#39FF14' : '#FF2EF5' }}
            >
              <div className="mb-4 sm:mb-6">
                {won ? (
                  <Trophy className="w-20 h-20 sm:w-24 sm:h-24 mx-auto text-[#39FF14] animate-bounce" />
                ) : (
                  <></>
                )}
              </div>

              <h2
                className={`text-3xl sm:text-5xl font-bold my-8 tracking-wider` + (won ? ' animate-[pulse_2s_ease-in-out_infinite]' : ' animate-pulse')}
                style={{ color: won ? '#39FF14' : '#FF2EF5' }}
              >
                {won ? 'VICTORY!' : 'GAME OVER'}
              </h2>

              <div className="mb-6 animate-[slideUp_0.5s_ease-out]">
                <p className="text-sm sm:text-base text-[#E2E8F0] mb-2">
                  Final Score: <span className="font-bold text-[#39FF14]">{score}</span>
                </p>
                <p className="text-sm sm:text-base text-[#888] font-mono">
                  {gameStateRef.current.gameOverReason === 1
                    ? '~ You were hit by an enemy!'
                    : '~ Time ran out!'}
                </p>
              </div>

              <div className="mb-4">
                <NameInput
                  onNameInputComplete={(name) => {
                    onGameComplete(score, won);
                  }}
                  score={score}
                />
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};


const PostGameUnlockedPage = ({
  score,
  won,
}: {
  score: number;
  won: boolean;
}) => {
  return (
    <div className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center p-4 text-center py-20">
      <div className="max-w-2xl animate-[fadeIn_0.8s_ease-in] w-full">
        <Trophy className="w-32 h-32 mx-auto mb-6 text-[#39FF14] animate-bounce" />
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-wider text-[#39FF14] animate-[pulse_2s_ease-in-out_infinite]">
          {won ? "MISSION SUCCESS" : "MISSION COMPLETE"}
        </h1>

        <p className="text-lg text-[#888] font-mono mb-10">
          {won
            ? "You have successfully neutralized the AI threat and stabilized the neural core."
            : "You have completed your mission"}
        </p>

        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-left border-collapse rounded-xl overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-[#1A1B26] border-b-2 border-[#00FFF7]">
                <th className="px-4 py-3 text-[#00FFF7] text-lg">Rank</th>
                <th className="px-4 py-3 text-[#00FFF7] text-lg">Player</th>
                <th className="px-4 py-3 text-[#00FFF7] text-lg">Final Score</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[#00FFF722] transition-all">
                <td className="px-4 py-3 text-[#E2E8F0]">{playerRealStatus ? playerRealStatus.rank : "N/A"}</td>
                <td className="px-4 py-3 text-[#E2E8F0]">{playerRealStatus ? playerRealStatus.name : "N/A"}</td>
                <td className="px-4 py-3 text-[#E2E8F0]">{playerRealStatus ? playerRealStatus.score : score}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-lg text-[#00FFF7] font-mono mb-6 pt-10">
          Take your next steps:<br />
          <span className="font-bold text-[#FF2EF5]"> Register now</span> to secure your seat and
          <span className="font-bold text-[#39FF14]"> join the WhatsApp group</span> for updates, news, and upcoming challenges. Don’t miss out!
        </p>

        <div className="my-14 w-full text-center">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#00FFF7] my-8">
            Stay Connected & Join
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 w-full">
            <a
              href="https://forms.gle/o2WQ6fdcZ7dtkgcWA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-lg border-2 border-[#00FFF7] text-[#00FFF7] font-bold text-lg hover:bg-[#00FFF722]"
            >
              <UserPlus className="w-6 h-6" />
              Register Now
            </a>
            <a
              href="https://chat.whatsapp.com/KfqHxXxOxjI26FsZf7SMmQ"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-lg border-2 border-[#FF2EF5] text-[#FF2EF5] font-bold text-lg hover:bg-[#FF2EF522]"
            >
              <Image src="/whatsapp_logo.png" alt="WhatsApp" width={48} height={48} className="mx-2" />
              Join WhatsApp Group
            </a>
          </div>
        </div>


        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="px-8 py-4 rounded-lg font-bold text-md cursor-pointer text-[#FF2EF5]"
          >
            GO HOME
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 rounded-lg font-bold text-lg cursor-pointer text-[#E2E8F0] bg-gradient-to-r from-[#007F7F] via-[#7F007F] to-[#FF2EF5] hover:scale-105 transition-all"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    </div>
  );
};


export default function GenAIArcade() {
  const [stage, setStage] = useState('boot');
  const [finalScore, setFinalScore] = useState(0);
  const [won, setWon] = useState(false);

  const handleBootComplete = () => setStage('game');
  const handleGameComplete = (score: number, won?: boolean) => {
    setFinalScore(score);
    if (won) setWon(true);
    setStage('unlocked');
  };

  return (
    <>

      <style jsx global>{`
  /* Prevent zoom on mobile */
  @media (max-width: 768px) {
    html {
      touch-action: manipulation;
    }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes scaleIn {
    from { 
      opacity: 0;
      transform: scale(0.8);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    canvas {
      max-width: 95vw !important;
      height: auto !important;
    }
  }
`}</style>
      {stage === 'boot' && <BootSequence onComplete={handleBootComplete} />}
      {stage === 'game' && <SpaceshipGame onGameComplete={handleGameComplete} />}
      {stage === 'unlocked' && <PostGameUnlockedPage score={finalScore} won={won} />}
    </>
  );
}

