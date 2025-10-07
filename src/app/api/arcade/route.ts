import prisma from "@/utils/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

let leaderboardCache: {
  id: number;
  name: string;
  score: number;
  updatedAt: Date;
  rank: number;
}[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 30 * 1000; // 30 sec

const fetchAndCacheLeaderboard = async () => {
  const scores = await prisma.playerScore.findMany({
    orderBy: [{ score: "desc" }, { updatedAt: "asc" }],
    take: 20,
    select: { id: true, name: true, score: true, updatedAt: true },
  });

  leaderboardCache = scores.map((player, index) => {
    return {
      id: player.id,
      name: player.name,
      rank: index + 1,
      score: player.score,
      updatedAt: player.updatedAt,
    };
  });

  cacheTimestamp = Date.now();
};

export const GET = async () => {
  const now = Date.now();

  // cached data
  if (
    cacheTimestamp > 0 &&
    now - cacheTimestamp < CACHE_DURATION &&
    leaderboardCache.length
  ) {
    return NextResponse.json(
      { leaderboard: leaderboardCache.map((p) => ({ ...p, id: undefined })) },
      { status: 200 },
    );
  }

  await fetchAndCacheLeaderboard();

  return NextResponse.json(
    {
      leaderboard: leaderboardCache.map((p) => ({
        ...p,
        id: undefined,
      })),
    },
    { status: 200 },
  );
};

export async function POST(req: Request) {
  const { name, score } = await req.json();
  const ip = (req.headers.get("x-forwarded-for") || "unknown")
    .split(",")[0]
    .trim();
  if (!name) {
    return NextResponse.json(
      { error: "Invalid input, name is required" },
      { status: 400 },
    );
  }
  if (typeof score !== "number" || score < 0) {
    return NextResponse.json(
      { error: "Invalid input, score must be a non-negative number" },
      { status: 400 },
    );
  }

  if (!ip || ip === "unknown") {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // upsert
  const player = await prisma.playerScore.upsert({
    where: { ip: String(ip) },
    update: { name, score },
    create: { name, score, ip: String(ip) },
  });

  cacheTimestamp = -1;
  await fetchAndCacheLeaderboard();

  const leaderboardEntry = leaderboardCache.find((p) => p.id === player.id);
  if (!leaderboardEntry) {
    return NextResponse.json(
      { error: "Could not find player in leaderboard" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      message: "Score saved",
      player: {
        ...leaderboardEntry,
        id: undefined,
      },
    },
    { status: 200 },
  );
  // possible ip spoofing
}
