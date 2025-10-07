import GenAIArcadeClientPage, { Player } from './pageClient';

let BASE_URL = process.env.BASE_URL || 'http://localhost:3000/';
BASE_URL = BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/';

export default async function GenAIArcadePage() {
  let leaderboard = [];
  try {
    const response = await fetch(`${BASE_URL}api/arcade`,
      { cache: 'no-store' });
    const data = await response.json();
    leaderboard = data.leaderboard;
  } catch (err) {
    console.log("Error fetching leaderboard:", err);
  }

  return (
    <GenAIArcadeClientPage leaderboard={leaderboard as Player[]} />
  );
}
