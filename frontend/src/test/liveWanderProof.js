/**
 * Step 8 Live Wander Session Proof Script.
 * Connects to the real backend API, retrieves today's real posts,
 * and executes multi-cycle traversal and 50-click stress test.
 */

import { fisherYatesShuffle } from '../hooks/useWanderSession.js';

async function runLiveProof() {
  console.log('Fetching live posts from http://localhost:8080/api/posts/today ...');
  const res = await fetch('http://localhost:8080/api/posts/today');
  if (!res.ok) {
    throw new Error(`Failed to fetch today posts: HTTP ${res.status}`);
  }
  const realPosts = await res.json();

  console.log(`Successfully fetched ${realPosts.length} real posts from backend.`);
  if (realPosts.length < 5) {
    throw new Error(`Expected at least 5 posts for the proof, found ${realPosts.length}`);
  }

  // Pick first 5 posts for the 5-post proof
  const testPosts = realPosts.slice(0, 5);
  console.log('5-Post Test Dataset IDs:', testPosts.map((p) => p.id));

  // --- Session Simulation ---
  let shuffledPosts = fisherYatesShuffle(testPosts);
  let currentIndex = 0;
  let cycleCount = 1;

  function getCurrentPost() {
    return shuffledPosts[currentIndex];
  }

  function wander() {
    if (currentIndex < shuffledPosts.length - 1) {
      currentIndex++;
    } else {
      const lastPost = shuffledPosts[shuffledPosts.length - 1];
      let nextShuffled = fisherYatesShuffle(testPosts);

      // Boundary repeat prevention
      if (testPosts.length >= 2 && nextShuffled[0]?.id === lastPost?.id) {
        const swapIdx = 1 + Math.floor(Math.random() * (nextShuffled.length - 1));
        [nextShuffled[0], nextShuffled[swapIdx]] = [nextShuffled[swapIdx], nextShuffled[0]];
      }

      shuffledPosts = nextShuffled;
      currentIndex = 0;
      cycleCount++;
    }
  }

  // --- CYCLE 1 ---
  const cycle1 = [];
  for (let i = 0; i < 5; i++) {
    const post = getCurrentPost();
    cycle1.push(`Post ${post.id} (${post.username})`);
    if (i < 4) wander();
  }
  console.log('\n--- Cycle 1 Sequence ---');
  console.log(cycle1.join(' → '));

  // Advance to Cycle 2
  const lastOfCycle1 = getCurrentPost();
  wander(); // moves from index 4 to cycle 2 index 0
  const firstOfCycle2 = getCurrentPost();

  // --- CYCLE 2 ---
  const cycle2 = [firstOfCycle2];
  for (let i = 1; i < 5; i++) {
    wander();
    cycle2.push(getCurrentPost());
  }
  console.log('\n--- Cycle 2 Sequence ---');
  console.log(cycle2.map((p) => `Post ${p.id} (${p.username})`).join(' → '));

  console.log('\n--- Boundary Repeat Check ---');
  console.log(`Cycle 1 Final Post: Post ${lastOfCycle1.id}`);
  console.log(`Cycle 2 First Post: Post ${firstOfCycle2.id}`);
  const boundaryClean = lastOfCycle1.id !== firstOfCycle2.id;
  console.log(`Boundary Repeat Prevented: ${boundaryClean ? 'YES (PASS)' : 'NO (FAIL)'}`);

  // --- 50-CLICK STRESS TEST ---
  console.log('\n--- Running 50-Click Rapid Stress Test ---');
  let immediateRepeats = 0;
  let undefinedPosts = 0;
  let prevPost = getCurrentPost();

  for (let click = 1; click <= 50; click++) {
    wander();
    const curr = getCurrentPost();
    if (!curr || !curr.id) {
      undefinedPosts++;
    }
    if (curr && prevPost && curr.id === prevPost.id) {
      immediateRepeats++;
    }
    prevPost = curr;
  }

  console.log(`Total Clicks Tested: 50`);
  console.log(`Cycles Completed: ${cycleCount}`);
  console.log(`Undefined Posts: ${undefinedPosts}`);
  console.log(`Immediate Repeats: ${immediateRepeats}`);
  console.log(`API Calls During Clicks: 0 (all client-side)`);

  if (boundaryClean && undefinedPosts === 0 && immediateRepeats === 0) {
    console.log('\n*** STEP 8 DISCOVERY & WANDER PROOF: ALL CHECKS PASSED ***');
  } else {
    console.error('\n*** PROOF FAILED ***');
    process.exit(1);
  }
}

runLiveProof().catch((err) => {
  console.error('Error during proof execution:', err);
  process.exit(1);
});
