let player; 
let playerImg; 
let lives = 5; 
let playerLasers = []; 
let laserImg; 
let aliens = []; 
let alienImg; 
let alienBullets = []; 
let boss; 
let bossImg; 
let enemiesDestroyed = 0; 
let bossActive = false; 
let bossHealth = 30; 

// LEVEL & CUSTOM BOSS VARIABLES 
let currentLevel = 1; 
let enemyPlaneImg; 
let elitePlanes = []; 
let elitePlanesSpawned = false; 

// Level 2 Boss (The Watcher) 
let watcherBoss; 
let watcherImg; 
let watcherHealth = 40; 
let watcherActive = false; 

// Level 3 Boss (The Doom Star) 
let doomStarBoss; 
let doomStarImg;
let doomStarHealth = 30; 
let doomStarActive = false; 
let doomStarAngle = 0; 

// Level 4 Final Boss (The Void Archdemon) 
let demonBoss; 
let demonHealth = 80; 
let demonActive = false; 

// Level 5 Boss (The Cosmic Flare)
let flareBoss;
let flareHealth = 60;
let flareActive = false;

// Level 6 Final Boss (The Nebula Dragon)
let dragonBoss;
let dragonHealth = 100; // The legendary final 100 HP bar!
let dragonActive = false;

// Shield System Variables 
let shieldActive = false; 
let shieldSprite; 
let killsSinceLastShield = 0; 
let shieldHealthInventory = 0; 
let currentActiveShieldHealth = 0; 

// Tracks if we are on the home screen or playing 
let gameState = 'start'; 

// SAFETY TIMERS
let levelStartTime = 0; 
let victoryScreenTime = 0; 

// === AUDIO TRACK VARIABLES ===
let trackMenu, trackFight, trackBoss1, trackBoss2, trackBoss3, trackBoss4, trackBoss5, trackBoss6;
let currentlyPlayingTrack = null;

function preload() {
  // Image Assets
  playerImg = loadImage('Assets/player-plane.png'); 
  alienImg = loadImage('Assets/Alien.png'); 
  laserImg = loadImage('Assets/bullet.png'); 
  bossImg = loadImage('Assets/Octo-Boss.png'); 
  enemyPlaneImg = loadImage('Assets/enemy-plane.png'); 
  watcherImg = loadImage('Assets/watcher.png'); 
  doomStarImg = loadImage('Assets/doom-star.png')

  // Audio Assets (Loaded with fallback strings)
  trackMenu = loadSound('Assets/menu.mp3');
  trackFight = loadSound('Assets/fight.mp3');
  trackBoss1 = loadSound('Assets/boss1.mp3');
  trackBoss2 = loadSound('Assets/boss2.mp3');
  trackBoss3 = loadSound('Assets/boss3.mp3');
  trackBoss4 = loadSound('Assets/Midnight-Killstreak(boss 4).mp3');
  trackBoss5 = loadSound('Assets/violent_precision(level 5).mp3');
  trackBoss6 = loadSound('Assets/piston_breach(level 6).mp3');
}

function setup() {
  cursor(); 
  new Canvas(windowWidth, windowHeight); 
  
  player = new Sprite(windowWidth / 2, windowHeight / 2, 50, 50); 
  player.img = playerImg; 
  player.scale = 1.5; 
  player.rotationLock = true; 
  player.visible = false; 
  
  angleMode(DEGREES); 
}

// === CENTRAL MUSIC MANAGER FUNCTION ===
// Safely stops the old track and loops the new track without overlapping audio
function changeMusic(newTrack) {
  if (currentlyPlayingTrack === newTrack) return; // Already running this track!
  
  if (currentlyPlayingTrack && currentlyPlayingTrack.isPlaying()) {
    currentlyPlayingTrack.stop();
  }
  
  currentlyPlayingTrack = newTrack;
  
  if (currentlyPlayingTrack) {
    currentlyPlayingTrack.loop();
    currentlyPlayingTrack.setVolume(0.4); // Balance audio mixing comfort
  }
}
function draw() { 
  background('teal'); 
  
  // State switcher 
  if (gameState === 'start') { 
    drawStartScreen(); 
  } else if (gameState === 'play') { 
    runGameLogic(); 
  } 
} 

// Renders the name, instructions, and handles level selection 
function drawStartScreen() { 
  // Browser standard: Ensure menu music loops once user clicks/interacts
  changeMusic(trackMenu);
  
  textAlign(CENTER); 
  
  // Game Name 
  fill('gold'); 
  textSize(60); 
  text("AREA 56", width / 2, height / 2 - 140); 
  
  // Instructions Summary Box 
  fill('rgba(0,0,0,0.4)'); 
  rectMode(CENTER); 
  rect(width / 2, height / 2 - 45, 480, 95, 10); 
  fill('white'); 
  textSize(16); 
  text("• Move: WASD / Arrow Keys • Shoot: Hold Left Mouse", width / 2, height / 2 - 65); 
  text("• Shield: Earn +1 Shield Hit every 5 kills", width / 2, height / 2 - 45); 
  text("• Activate Shield: Press SPACEBAR", width / 2, height / 2 - 25); 
  text("• Speed decreases while shooting for precision focus", width / 2, height / 2 - 5); 
  
    // === NEW SPACED GRID (Pushed lower to stop instruction overlap) === 
  // Row 1: Levels 1 & 2
  fill('rgba(0, 255, 255, 0.15)'); stroke('cyan'); strokeWeight(2); 
  rect(width / 2 - 120, height / 2 + 65, 200, 45, 8); noStroke(); fill('white'); textSize(15); 
  text("LEVEL 1", width / 2 - 120, height / 2 + 63); textSize(10); text("The Octopus Overlord", width / 2 - 120, height / 2 + 77); 

  fill('rgba(255, 215, 0, 0.15)'); stroke('gold'); strokeWeight(2); 
  rect(width / 2 + 120, height / 2 + 65, 200, 45, 8); noStroke(); fill('white'); textSize(15); 
  text("LEVEL 2", width / 2 + 120, height / 2 + 63); textSize(10); text("The Watcher", width / 2 + 120, height / 2 + 77); 

  // Row 2: Levels 3 & 4
  fill('rgba(255, 0, 255, 0.15)'); stroke('magenta'); strokeWeight(2); 
  rect(width / 2 - 120, height / 2 + 120, 200, 45, 8); noStroke(); fill('white'); textSize(15); 
  text("LEVEL 3", width / 2 - 120, height / 2 + 118); textSize(10); text("The Doom Star", width / 2 - 120, height / 2 + 132); 

  fill('rgba(255, 50, 50, 0.15)'); stroke('red'); strokeWeight(2); 
  rect(width / 2 + 120, height / 2 + 120, 200, 45, 8); noStroke(); fill('white'); textSize(15); 
  text("LEVEL 4", width / 2 + 120, height / 2 + 118); textSize(10); text("The Void Archdemon", width / 2 + 120, height / 2 + 132); 

  // Row 3: Levels 5 & 6
  fill('rgba(255, 130, 0, 0.15)'); stroke('orange'); strokeWeight(2); 
  rect(width / 2 - 120, height / 2 + 175, 200, 45, 8); noStroke(); fill('white'); textSize(15); 
  text("LEVEL 5", width / 2 - 120, height / 2 + 173); textSize(10); text("The Cosmic Flare", width / 2 - 120, height / 2 + 187); 

  fill('rgba(150, 0, 255, 0.15)'); stroke('purple'); strokeWeight(2); 
  rect(width / 2 + 120, height / 2 + 175, 200, 45, 8); noStroke(); fill('white'); textSize(15); 
  text("LEVEL 6", width / 2 + 120, height / 2 + 173); textSize(10); text("The Nebula Dragon", width / 2 + 120, height / 2 + 187); 

  // ACCURATE CLICK ZONES (Updated to match the lower grid coordinates)
  if (mouse.pressed()) { 
    // Row 1 Clicks
    if (mouseX > width/2 - 220 && mouseX < width/2 - 20 && mouseY > height/2 + 42 && mouseY < height/2 + 88) { 
      currentLevel = 1; restartGameSession(); 
    } 
    if (mouseX > width/2 + 20 && mouseX < width/2 + 220 && mouseY > height/2 + 42 && mouseY < height/2 + 88) { 
      currentLevel = 2; restartGameSession(); 
    } 
    // Row 2 Clicks
    if (mouseX > width/2 - 220 && mouseX < width/2 - 20 && mouseY > height/2 + 97 && mouseY < height/2 + 142) { 
      currentLevel = 3; restartGameSession(); 
    } 
    if (mouseX > width/2 + 20 && mouseX < width/2 + 220 && mouseY > height/2 + 97 && mouseY < height/2 + 142) { 
      currentLevel = 4; restartGameSession(); 
    } 
    // Row 3 Clicks
    if (mouseX > width/2 - 220 && mouseX < width/2 - 20 && mouseY > height/2 + 152 && mouseY < height/2 + 198) { 
      currentLevel = 5; restartGameSession(); 
    } 
    if (mouseX > width/2 + 20 && mouseX < width/2 + 220 && mouseY > height/2 + 152 && mouseY < height/2 + 198) { 
      currentLevel = 6; restartGameSession(); 
    } 
  }

} 

// Core game mechanics engine 
function runGameLogic() { 
  // Dynamic Music Handling: Shift to normal fight music if no boss is active
  if (!bossActive && !watcherActive && !doomStarActive && !demonActive && !flareActive && !dragonActive) { 
    changeMusic(trackFight); 
  }

  // === DYNAMIC SPEED MOVEMENT === 
  let moveSpeed = 5; 
  if (mouse.pressing()) { 
    moveSpeed = 3; 
  } 
  
  // Horizontal Movement 
  if (kb.pressing('left') || kb.pressing('a')) { 
    player.vel.x = -moveSpeed; 
  } else if (kb.pressing('right') || kb.pressing('d')) { 
    player.vel.x = moveSpeed; 
  } else { 
    player.vel.x = 0; 
  } 
  
  // Vertical Movement 
  if (kb.pressing('up') || kb.pressing('w')) { 
    player.vel.y = -moveSpeed; 
  } else if (kb.pressing('down') || kb.pressing('s')) { 
    player.vel.y = moveSpeed; 
  } else { 
    player.vel.y = 0; 
  } 
  
  // === FIXED BOUNDARIES === 
  if (player.x < 25) { player.x = 25; player.vel.x = 0; } 
  if (player.x > width - 25) { player.x = width - 25; player.vel.x = 0; } 
  if (player.y < 25) { player.y = 25; player.vel.y = 0; } 
  if (player.y > height - 25) { player.y = height - 25; player.vel.y = 0; } 
  
  // Continuous Laser Firing 
  if (mouse.pressing() && frameCount % 10 === 0 && lives > 0 && millis() - levelStartTime > 500) { 
    let laser = new Sprite(player.x, player.y - 20, 5, 20); 
    laser.img = laserImg; 
    laser.vel.y = -10; 
    laser.collider = 'none'; 
    playerLasers.push(laser); 
  } 
  
  // === STACKING SHIELD POWER-UP LOGIC === 
  if (killsSinceLastShield >= 5) { 
    killsSinceLastShield = 0; 
    shieldHealthInventory = shieldHealthInventory + 1; 
  } 
  
  // MANUAL ACTIVATION 
  if (kb.pressed('space') && shieldHealthInventory > 0 && !shieldActive && lives > 0) { 
    shieldActive = true; 
    currentActiveShieldHealth = shieldHealthInventory; 
    shieldHealthInventory = 0; 
    shieldSprite = new Sprite(player.x, player.y, 120); 
    shieldSprite.shape = 'circle'; 
    shieldSprite.collider = 'none'; 
    if (currentActiveShieldHealth > 1) { 
      shieldSprite.color = 'rgba(0, 255, 100, 0.25)'; 
      shieldSprite.stroke = '#00ff64'; 
    } else { 
      shieldSprite.color = 'rgba(255, 50, 50, 0.25)'; 
      shieldSprite.stroke = '#ff3232'; 
    } 
    shieldSprite.strokeWeight = 4; 
  } 
  
  // Make shield follow player 
  if (shieldActive && lives > 0) { 
    shieldSprite.x = player.x + 4; 
    shieldSprite.y = player.y - 4; 
  }
    // === LEVEL-BASED SPAWNING SYSTEM === 
  if (enemiesDestroyed < 10) { 
    
    // Levels 2 and 3 keep their original layout (spawn exactly 2 planes once)
    if ((currentLevel === 2 || currentLevel === 3) && !elitePlanesSpawned) { 
        elitePlanesSpawned = true; 
        let ep1 = new Sprite(width * 0.25, -50); 
        let ep2 = new Sprite(width * 0.75, -50); 
        for (let ep of [ep1, ep2]) { 
        ep.img = enemyPlaneImg; 
        ep.scale = 2.2; 
        ep.vel.y = 2; 
        ep.rotationLock = true; 
        ep.collider = 'none'; 
        ep.stopY = random(100, 200); 
        ep.vel.x = random([-2, 2]); 
        elitePlanes.push(ep); 
        } 
    } 

    // CONTINUOUS LEVEL 4 ELITE PLANE RESPAWNING ===
    if (currentLevel === 4 || currentLevel === 5 || currentLevel === 6) {
        // If there are less than 2 elite planes on the screen, spawn a fresh one!
        if (elitePlanes.length < 2) {
        if (frameCount % 120 === 0) { // Spawns a replacement every 2 seconds if missing
            let ep = new Sprite(random(50, width - 50), -50);
            ep.img = enemyPlaneImg; 
            ep.scale = 2.2; 
            ep.vel.y = 2; 
            ep.rotationLock = true; 
            ep.collider = 'none'; 
            ep.stopY = random(100, 200); 
            ep.vel.x = random([-2, 2]); 
            elitePlanes.push(ep);
        }
        }
    }
    let maxAliensOnScreen = 6; 
    if (currentLevel === 2) maxAliensOnScreen = 8; 
    if (currentLevel === 3) maxAliensOnScreen = 9; 
    if (currentLevel === 4) maxAliensOnScreen = 10; 
    if (currentLevel === 5) maxAliensOnScreen = 10; 
    if (currentLevel === 6) maxAliensOnScreen = 10;
    if (aliens.length < maxAliensOnScreen) { 
      if (frameCount % 90 === 0) { 
        let alien = new Sprite(random(50, width - 50), -50); 
        alien.img = alienImg; 
        alien.scale = 1.1
        alien.vel.y = 2; 
        alien.rotationLock = true; 
        alien.collider = 'none'; 
        alien.stopY = random(100, 300); 
        aliens.push(alien); 
      } 
    } 
  }   // FIXED ACTIVATOR CHECK: Includes Level 5 and Level 6 flags so the game can reach them!
  else if (enemiesDestroyed >= 10 && bossActive === false && watcherActive === false && doomStarActive === false && demonActive === false && flareActive === false && dragonActive === false && aliens.length === 0 && elitePlanes.length === 0) { 
    if (currentLevel === 1) { 
      bossActive = true; 
      boss = new Sprite(width / 2, -100); 
      boss.img = bossImg; 
      boss.scale = 5.0; 
      boss.vel.y = 1.5; 
      boss.rotationLock = true; 
      boss.collider = 'none'; 
    } else if (currentLevel === 2) { 
      watcherActive = true; 
      watcherBoss = new Sprite(width / 2, -100); 
      watcherBoss.img = watcherImg; 
      watcherBoss.rotationLock = true; 
      watcherBoss.vel.y = 1.5; 
      watcherBoss.collider = 'none'; 
      watcherBoss.scale = 5.0; 
    } else if (currentLevel === 3) { 
      doomStarActive = true; 
      doomStarBoss = new Sprite(width / 2, -130); 
      doomStarBoss.img = doomStarImg;
      doomStarBoss.vel.y = 1.5; 
      doomStarBoss.rotationLock = true;
      doomStarBoss.collider = 'none'; 
      doomStarBoss.scale = 2;
    } else if (currentLevel === 4) { 
      demonActive = true; 
      demonBoss = new Sprite(width / 2, -160); 
      demonBoss.shape = 'circle'; 
      demonBoss.width = 220; 
      demonBoss.height = 190; 
      demonBoss.color = '#1a052e'; 
      demonBoss.stroke = '#ff0033'; 
      demonBoss.strokeWeight = 6; 
      demonBoss.vel.y = 1.0; 
      demonBoss.collider = 'none'; 
    } else if (currentLevel === 5) { 
      // FIXED LEVEL 5 INITIALIZATION: Using .d stops the sprite shape from stretching infinitely!
      flareActive = true; 
      flareBoss = new Sprite(width / 2, -120); 
      flareBoss = new Sprite(width / 2, -160); 
      flareBoss.shape = 'circle'; 
      flareBoss.width = 220; 
      flareBoss.height = 190; 
      flareBoss.color = '#ffcc00'; 
      flareBoss.stroke = '#ff6600'; 
      flareBoss.strokeWeight = 6; 
      flareBoss.vel.y = 1.0; 
      flareBoss.collider = 'none'; 
    } else if (currentLevel === 6) { 
      // FIXED LEVEL 6 INITIALIZATION: Removed .scale to prevent null texture crashes!
      dragonActive = true; 
      dragonBoss = new Sprite(width / 2, -140); 
      dragonBoss.shape = 'circle'; 
      dragonBoss.width = 180; 
      dragonBoss.height = 150; 
      dragonBoss.color = '#4a0e4e'; 
      dragonBoss.stroke = '#00ffcc'; 
      dragonBoss.strokeWeight = 5; 
      dragonBoss.vel.y = 1.2; 
      dragonBoss.collider = 'none'; 
    } 

  } 

  for (let ep of elitePlanes) { 
    if (ep.y >= ep.stopY && ep.vel.y !== 0) { 
      ep.vel.y = 0; 
      ep.y = ep.stopY; 
    } 
    if (ep.x < 50) ep.vel.x = 2; 
    if (ep.x > width - 50) ep.vel.x = -2; 
    if (frameCount % 60 === 0 && ep.vel.y === 0) { 
      let bullet = new Sprite(ep.x, ep.y + 25, 12, 12); 
      bullet.color = 'orange'; 
      bullet.shape = 'circle'; 
      bullet.vel.y = 6; 
      bullet.collider = 'none'; 
      alienBullets.push(bullet); 
    } 
  }

  // === BOSS ATTACK & UNIQUE MUSIC TRIGGER LOGIC ===
  if (currentLevel === 1 && bossActive && bossHealth > 0) { 
    changeMusic(trackBoss1); // Plays boss1.mp3
    if (boss.y >= 200 && boss.vel.y !== 0) { boss.vel.y = 0; boss.y = 200; boss.vel.x = 3; } 
    if (boss.x < 100) boss.vel.x = 3; 
    if (boss.x > width - 100) boss.vel.x = -3; 
    if (frameCount % 120 === 0 && boss.vel.y === 0) { 
      let totalBullets = 12; 
      for (let i = 0; i < totalBullets; i++) { 
        let b = new Sprite(boss.x, boss.y + 30, 14, 14); 
        b.color = 'yellow'; 
        b.shape = 'circle'; 
        b.collider = 'none'; 
        let bulletAngle = (360 / totalBullets) * i; 
        b.vel.x = sin(bulletAngle) * 4; 
        b.vel.y = cos(bulletAngle) * 4; 
        alienBullets.push(b); 
      } 
    } 
  } 

  if (currentLevel === 2 && watcherActive && watcherHealth > 0) { 
    changeMusic(trackBoss2); // Plays boss2.mp3
    if (watcherBoss.y >= 180 && watcherBoss.vel.y !== 0) { watcherBoss.vel.y = 0; watcherBoss.y = 180; watcherBoss.vel.x = 4; } 
    if (watcherBoss.x < 100) watcherBoss.vel.x = 4; 
    if (watcherBoss.x > width - 100) watcherBoss.vel.x = -4; 
    if (frameCount % 90 === 0 && watcherBoss.vel.y === 0) { 
      let angleToPlayer = atan2(player.y - watcherBoss.y, player.x - watcherBoss.x); 
      for (let i = 0; i < 3; i++) { 
        setTimeout(() => { 
          if (watcherActive && watcherHealth > 0 && lives > 0) { 
            let b = new Sprite(watcherBoss.x, watcherBoss.y + 30, 14, 14); 
            b.color = 'red'; 
            b.shape = 'circle'; 
            b.collider = 'none'; 
            b.vel.x = cos(angleToPlayer) * 8; 
            b.vel.y = sin(angleToPlayer) * 8; 
            alienBullets.push(b); 
          } 
        }, i * 150); 
      } 
    } 
  } 

  if (currentLevel === 3 && doomStarActive && doomStarHealth > 0) { 
    changeMusic(trackBoss3); // Plays boss3.mp3
    if (doomStarBoss.y >= 245 && doomStarBoss.vel.y !== 0) { doomStarBoss.vel.y = 0; doomStarBoss.y = 245; doomStarBoss.vel.x = 2; } 
    if (doomStarBoss.x < width / 2 - 150) { doomStarBoss.vel.x = 2; } 
    if (doomStarBoss.x > width / 2 + 150) { doomStarBoss.vel.x = -2; } 
    if (frameCount % 12 === 0 && doomStarBoss.vel.y === 0) { 
      let totalArms = 4; 
      for (let i = 0; i < totalArms; i++) { 
        let b = new Sprite(doomStarBoss.x, doomStarBoss.y, 12, 12); 
        b.color = 'orange'; 
        b.shape = 'circle'; 
        b.collider = 'none'; 
        let finalAngle = doomStarAngle + (360 / totalArms) * i; 
        b.vel.x = sin(finalAngle) * 5; 
        b.vel.y = cos(finalAngle) * 5; 
        alienBullets.push(b); 
      } 
      doomStarAngle += 3; 
    } 
  } 

  if (currentLevel === 4 && demonActive && demonHealth > 0) { 
    changeMusic(trackBoss4); // Plays Midnight-Killstreak(boss 4).mp3
    if (demonBoss.y >= 160 && demonBoss.vel.y !== 0) { demonBoss.vel.y = 0; demonBoss.y = 160; demonBoss.vel.x = 2.0; } 
    if (demonBoss.x < 150) demonBoss.vel.x = 2.0; 
    if (demonBoss.x > width - 150) demonBoss.vel.x = -2.0; 
    if (frameCount % 80 === 0 && demonBoss.vel.y === 0) { 
      for (let angle = 45; angle <= 135; angle += 22.5) { 
        let b = new Sprite(demonBoss.x, demonBoss.y + 80, 16, 16); 
        b.color = 'red'; 
        b.shape = 'circle'; 
        b.collider = 'none'; 
        b.vel.x = cos(angle) * 6; 
        b.vel.y = sin(angle) * 6; 
        alienBullets.push(b); 
      } 
    } 
  }

  // === FIXED LEVEL 5 BOSS BEHAVIOR: COSMIC FLARE ===
  if (currentLevel === 5 && flareActive && flareHealth > 0) {
    changeMusic(trackBoss5);
    if (flareBoss.y >= 180 && flareBoss.vel.y !== 0) { 
      flareBoss.vel.y = 0; flareBoss.y = 180; flareBoss.vel.x = 3.5; 
    }
    if (flareBoss.x < 120) flareBoss.vel.x = 3.5;
    if (flareBoss.x > width - 120) flareBoss.vel.x = -3.5;

    // Trigger opening salvo window
    if (frameCount % 90 === 0 && flareBoss.vel.y === 0 && !flareFiredThisCycle) {
      flareFiredThisCycle = true; // Turn safety lock on
      
      for (let i = -4; i <= 4; i++) {
        let b = new Sprite(flareBoss.x + (i * 35), flareBoss.y + 40, 15, 15);
        b.color = '#ff3300'; b.shape = 'circle'; b.collider = 'none';
        b.vel.y = 0.5; 
        
        setTimeout(() => {
          if (flareActive && flareHealth > 0 && lives > 0 && b) {
            b.color = '#ffff00';
            b.vel.y = 8; 
          }
        }, 600);
        alienBullets.push(b);
      }
    }
    
    // Release safety lock once frame window rolls over
    if (frameCount % 90 !== 0) {
      flareFiredThisCycle = false;
    }
  }

  // === LEVEL 6 FINAL BOSS BEHAVIOR: THE NEBULA DRAGON (Collapsing Ring Matrix) ===
  if (currentLevel === 6 && dragonActive && dragonHealth > 0) {
    changeMusic(trackBoss6);
    if (dragonBoss.y >= 160 && dragonBoss.vel.y !== 0) { 
      dragonBoss.vel.y = 0; 
      dragonBoss.y = 160; 
      dragonBoss.vel.x = 2.5; 
    }
    if (dragonBoss.x < 150) dragonBoss.vel.x = 2.5;
    if (dragonBoss.x > width - 150) dragonBoss.vel.x = -2.5;

    if (frameCount % 60 === 0 && dragonBoss.vel.y === 0) {
      let bDown = new Sprite(dragonBoss.x, dragonBoss.y + 40, 12, 12);
      bDown.color = 'red'; 
      bDown.shape = 'circle'; 
      bDown.collider = 'none';
      bDown.vel.y = 6; // Fires straight down at the player's general lane
      alienBullets.push(bDown);
    }

    // ATTACK: Spawns 8 bullets around a wide outer circle that pass through the center point!
    if (frameCount % 100 === 0 && dragonBoss.vel.y === 0) {
      let totalBullets = 8;
      let targetX = width / 2;
      let targetY = height / 2 + 50;
      let spawnRadius = 350; // Distance of the outer spawn ring

      for (let i = 0; i < totalBullets; i++) {
        let angle = (360 / totalBullets) * i;
        let startX = targetX + cos(angle) * spawnRadius;
        let startY = targetY + sin(angle) * spawnRadius;

        let b = new Sprite(startX, startY, 14, 14);
        b.color = '#00ffcc'; 
        b.shape = 'circle'; 
        b.collider = 'none';

        // Direct their speeds straight toward the center coordinate.
        let angleToCenter = atan2(targetY - startY, targetX - startX);
        b.vel.x = cos(angleToCenter) * 4.5;
        b.vel.y = sin(angleToCenter) * 4.5;

        alienBullets.push(b);
      }
    }
  }

  // LASER INTERACTION LOOP 
  for (let i = playerLasers.length - 1; i >= 0; i--) { 
    let currentLaser = playerLasers[i]; 
    for (let j = aliens.length - 1; j >= 0; j--) { 
      let currentAlien = aliens[j]; 
      if (currentLaser.overlaps(currentAlien)) { 
        currentLaser.remove(); 
        currentAlien.remove(); 
        playerLasers.splice(i, 1); 
        aliens.splice(j, 1); 
        enemiesDestroyed = enemiesDestroyed + 1; 
        killsSinceLastShield = killsSinceLastShield + 1; 
        break; 
      } 
    } 
    if (currentLevel === 1 && bossActive && bossHealth > 0 && currentLaser && currentLaser.overlaps(boss)) { 
      currentLaser.remove(); 
      playerLasers.splice(i, 1); 
      bossHealth = bossHealth - 1; 
      if (bossHealth <= 0) { 
        boss.remove(); 
      } 
    } 
    if (currentLaser) { 
      for (let k = elitePlanes.length - 1; k >= 0; k--) { 
        let ep = elitePlanes[k]; 
        if (currentLaser.overlaps(ep)) { 
          currentLaser.remove(); 
          playerLasers.splice(i, 1); 
          ep.remove(); 
          elitePlanes.splice(k, 1); 
          enemiesDestroyed = enemiesDestroyed + 1; 
          killsSinceLastShield = killsSinceLastShield + 1; 
          break; 
        } 
      } 
    } 
    if (currentLevel === 2 && watcherActive && watcherHealth > 0 && currentLaser && currentLaser.overlaps(watcherBoss)) { 
      currentLaser.remove(); 
      playerLasers.splice(i, 1); 
      watcherHealth = watcherHealth - 1; 
      if (watcherHealth <= 0) { 
        watcherBoss.remove(); 
      } 
    } 
    if (currentLevel === 3 && doomStarActive && doomStarHealth > 0 && currentLaser && currentLaser.overlaps(doomStarBoss)) { 
      currentLaser.remove(); 
      playerLasers.splice(i, 1); 
      doomStarHealth = doomStarHealth - 1; 
      if (doomStarHealth <= 0) { 
        doomStarBoss.remove(); 
      } 
    } 
    if (currentLevel === 4 && demonActive && demonHealth > 0 && currentLaser && currentLaser.overlaps(demonBoss)) { 
      currentLaser.remove(); 
      playerLasers.splice(i, 1); 
      demonHealth = demonHealth - 1; 
      if (demonHealth <= 0) { 
        demonBoss.remove(); 
      } 
    } 
    if (currentLaser && currentLaser.y < -20) { 
      currentLaser.remove(); 
      playerLasers.splice(i, 1); 
    } 
    if (currentLevel === 5 && flareActive && flareHealth > 0 && currentLaser && currentLaser.overlaps(flareBoss)) {
      currentLaser.remove(); 
      playerLasers.splice(i, 1); 
      flareHealth = flareHealth - 1;
      if (flareHealth <= 0) { 
        flareBoss.remove(); 
      }
    }
    if (currentLevel === 6 && dragonActive && dragonHealth > 0 && currentLaser && currentLaser.overlaps(dragonBoss)) {
      currentLaser.remove(); 
      playerLasers.splice(i, 1); 
      dragonHealth = dragonHealth - 1;
      if (dragonHealth <= 0) { 
        dragonBoss.remove(); 
      }
    }
  } 

  // === DESYNCHRONIZED ALIEN SHOOTING === 
  for (let alien of aliens) { 
    if (alien.y >= alien.stopY) { 
      alien.vel.y = 0; 
      alien.y = alien.stopY; 
    } 
    if (alien.vel.y === 0 && random(0, 100) < 0.6) { 
      let bullet = new Sprite(alien.x, alien.y + 20, 10, 10); 
      bullet.color = 'red'; 
      bullet.shape = 'circle'; 
      bullet.vel.y = 6; 
      bullet.collider = 'none'; 
      alienBullets.push(bullet); 
    } 
  } 

  // ALIEN BULLET LOOP 
  for (let i = alienBullets.length - 1; i >= 0; i--) { 
    let b = alienBullets[i]; 
    if (shieldActive && b.overlaps(shieldSprite)) { 
      b.remove(); 
      alienBullets.splice(i, 1); 
      currentActiveShieldHealth = currentActiveShieldHealth - 1; 
      if (currentActiveShieldHealth === 1) { 
        shieldSprite.color = 'rgba(255, 50, 50, 0.25)'; 
        shieldSprite.stroke = '#ff3232'; 
      } 
      if (currentActiveShieldHealth <= 0) { 
        shieldActive = false; 
        shieldSprite.remove(); 
      } 
    } else if (b.overlaps(player)) { 
      b.remove(); 
      alienBullets.splice(i, 1); 
      if (lives > 0) { 
        lives = lives - 1; 
      } 
    } else if (b.y > height + 20) { 
      b.remove(); 
      alienBullets.splice(i, 1); 
    } 
  } 

  // === UI DRAWING SECTION === 
  textAlign(LEFT); 
  fill('white'); 
  textSize(24); 
  text("Lives: " + lives, 20, 40); 
  if (shieldActive) { 
    if (currentActiveShieldHealth > 1) fill('#00ff64'); 
    else fill('#ff3232'); 
    text("Shield Active HP: " + currentActiveShieldHealth, 20, 100); 
  } else { 
    fill('gray'); 
    text("Shield Stock: " + shieldHealthInventory + " (Press Space)", 20, 100); 
    text("Next Charge: " + killsSinceLastShield + "/5", 20, 135); 
  } 

  if (currentLevel === 1 && bossActive && bossHealth > 0) { 
    textAlign(CENTER); 
    fill('white'); 
    text("THE OCTOPUS OVERLORD", width / 2, 35); 
    fill('gray'); 
    rectMode(CENTER); 
    rect(width / 2, 55, 300, 15); 
    fill('red'); 
    rectMode(CORNER); 
    rect(width / 2 - 150, 47.5, bossHealth * 10, 15); 
  } 
  if (currentLevel === 2 && watcherActive && watcherHealth > 0) { 
    textAlign(CENTER); 
    fill('white'); 
    text("THE WATCHER", width / 2, 35); 
    fill('gray'); 
    rectMode(CENTER); 
    rect(width / 2, 55, 300, 15); 
    fill('purple'); 
    rectMode(CORNER); 
    rect(width / 2 - 150, 47.5, watcherHealth * 7.5, 15); 
  } 
  if (currentLevel === 3 && doomStarActive && doomStarHealth > 0) { 
    textAlign(CENTER); 
    fill('white'); 
    text("THE DOOM STAR", width / 2, 35); 
    fill('gray'); 
    rectMode(CENTER); 
    rect(width / 2, 55, 300, 15); 
    fill('orange'); 
    rectMode(CORNER); 
    rect(width / 2 - 150, 47.5, doomStarHealth * 10, 15); 
  } 
  if (currentLevel === 4 && demonActive && demonHealth > 0) { 
    textAlign(CENTER); 
    fill('white'); 
    text("THE VOID ARCHDEMON", width / 2, 35); 
    fill('gray'); 
    rectMode(CENTER); 
    rect(width / 2, 55, 300, 15); 
    fill('#ff0033'); 
    rectMode(CORNER); 
    rect(width / 2 - 150, 47.5, demonHealth * 3.75, 15); 
  } 

  if (currentLevel === 5 && flareActive && flareHealth > 0) {
    textAlign(CENTER); fill('white'); text("THE COSMIC FLARE", width / 2, 35); 
    fill('gray'); rectMode(CENTER); rect(width / 2, 55, 300, 15); 
    fill('orange'); rectMode(CORNER); rect(width / 2 - 150, 47.5, flareHealth * 5, 15); 
  }

  if (currentLevel === 6 && dragonActive && dragonHealth > 0) {
    textAlign(CENTER); fill('white'); text("THE NEBULA DRAGON", width / 2, 35); 
    fill('gray'); rectMode(CENTER); rect(width / 2, 55, 300, 15); 
    fill('#00ffcc'); rectMode(CORNER); rect(width / 2 - 150, 47.5, dragonHealth * 3, 15); 
  }

  // === VICTORY SCREEN CONDITIONS === 
  let levelCleared = false; 
  if (currentLevel === 1 && bossActive && bossHealth <= 0) levelCleared = true; 
  if (currentLevel === 2 && watcherActive && watcherHealth <= 0) levelCleared = true; 
  if (currentLevel === 3 && doomStarActive && doomStarHealth <= 0) levelCleared = true; 
  if (currentLevel === 4 && demonActive && demonHealth <= 0) levelCleared = true; 
  if (currentLevel === 5 && flareActive && flareHealth <= 0) levelCleared = true;
  if (currentLevel === 6 && dragonActive && dragonHealth <= 0) levelCleared = true;

  if (levelCleared) { 
    cursor(); 
    if (victoryScreenTime === 0) { victoryScreenTime = millis(); } 

    fill('gold'); textSize(50); textAlign(CENTER); 
    text("VICTORY!", width / 2, height / 2 - 40); 
    for (let b of alienBullets) b.remove(); alienBullets = []; 
    
    // Draw Next Button
    fill('rgba(0, 255, 100, 0.2)'); stroke('#00ff64'); strokeWeight(2); rectMode(CENTER); 
    rect(width / 2, height / 2 + 50, 220, 50, 5); noStroke(); fill('white'); textSize(20); 
    
    // Check if there are more levels left, or if it's the end of the campaign
    if (currentLevel < 6) { 
      text("NEXT LEVEL", width / 2, height / 2 + 57); 
    } else { 
      text("MAIN MENU", width / 2, height / 2 + 57); 
    } 
    
    // Button click logic with 1.5-second lock safety
    if (mouse.pressed() && millis() - victoryScreenTime > 1500) { 
      if (mouseX > width / 2 - 110 && mouseX < width / 2 + 110 && mouseY > height / 2 + 25 && mouseY < height / 2 + 75) { 
        victoryScreenTime = 0; 
        if (currentLevel < 6) { 
          currentLevel = currentLevel + 1; 
          restartGameSession(); 
        } else { 
          gameState = 'start'; player.visible = false; 
          if (shieldSprite) { shieldSprite.remove(); } 
          shieldActive = false; shieldHealthInventory = 0; currentActiveShieldHealth = 0; 
          if (currentlyPlayingTrack) currentlyPlayingTrack.stop(); currentlyPlayingTrack = null;
        } 
      } 
    } 
  } else {
     victoryScreenTime = 0; 
    } 

  // GAME OVER SCREEN 
  if (lives <= 0) { 
    cursor(); 
    fill('red'); 
    textSize(50); 
    textAlign(CENTER); 
    text("GAME OVER", width / 2, height / 2 - 40); 
    player.remove(); 
    if (shieldActive) shieldSprite.remove(); 
    for (let ep of elitePlanes) ep.remove(); 
    elitePlanes = []; 
    if (watcherActive && watcherBoss) watcherBoss.remove(); 
    if (doomStarActive && doomStarBoss) doomStarBoss.remove(); 
    if (demonActive && demonBoss) demonBoss.remove(); 
    if (flareActive && flareBoss) flareBoss.remove();
    if (dragonActive && dragonBoss) dragonBoss.remove();


    fill('rgba(255, 50, 50, 0.2)'); 
    stroke('#ff3232'); 
    strokeWeight(2); 
    rectMode(CENTER); 
    rect(width / 2, height / 2 + 50, 200, 50, 5); 
    noStroke(); 
    fill('white'); 
    textSize(20); 
    text("TRY AGAIN", width / 2, height / 2 + 57); 

    if (mouse.pressed()) { 
      if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 + 25 && mouseY < height / 2 + 75) { 
        restartGameSession(); 
      } 
    } 
  } 
} 

function restartGameSession() { 
  noCursor(); 
  gameState = 'play'; 
  levelStartTime = millis(); 
  if (shieldSprite) { 
    shieldSprite.remove(); 
  } 
  shieldActive = false; 
  shieldHealthInventory = 0; 
  currentActiveShieldHealth = 0; 
  killsSinceLastShield = 0; 
  if (player) { 
    player.remove(); 
  } 
  player = new Sprite(windowWidth / 2, windowHeight / 2, 50, 50); 
  player.img = playerImg; 
  player.scale = 1.5; 
  player.rotationLock = true; 
  player.visible = true; 
  lives = 5; 
  enemiesDestroyed = 0; 
  bossActive = false; 
  bossHealth = 30; 
  elitePlanesSpawned = false; 
  watcherActive = false; 
  watcherHealth = 40; 
  doomStarActive = false; 
  doomStarHealth = 30; 
  demonActive = false; 
  demonHealth = 80; 
  flareActive = false; 
  flareHealth = 60;
  dragonActive = false; 
  dragonHealth = 100;
  for (let a of aliens) a.remove(); 
  aliens = []; 
  for (let b of alienBullets) b.remove(); 
  alienBullets = []; 
  for (let l of playerLasers) l.remove(); 
  playerLasers = []; 
  for (let ep of elitePlanes) ep.remove(); 
  elitePlanes = []; 
  if (boss) { boss.remove(); } 
  if (watcherBoss) { watcherBoss.remove(); } 
  if (doomStarBoss) { doomStarBoss.remove(); } 
  if (demonBoss) { demonBoss.remove(); } 
  // Reset Level 5 and 6 flags
  if (flareBoss) { flareBoss.remove(); }
  if (dragonBoss) { dragonBoss.remove(); }

  doomStarAngle = 0; 
}