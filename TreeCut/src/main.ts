import kaboom from "kaboom";

type Randi = ((n: number) =>  number) | ((a: number, b: number) => number)

declare let randi: Randi

kaboom();

randSeed(Date.now());

loadSprite("wood", "/sprite/woodP.png", {
  sliceX: 1,
  sliceY: 8,
});
loadSprite("player", "/sprite/player.png", {
  sliceX: 2,
  sliceY: 1,
  anims: {
    stay: 0,
    cut: {
      from: 0,
      to: 1
    }
  }
});
loadSprite("background", "/sprite/background.png");
//版权警告
loadSound("bgm", "/bgm/kimonohana.mp3");


let SCALE_X = 0.45;
let MAX_TREE_HEIGHT = 8;
let WOOD_BLOCK_HEIGHT = 100;
let blockOffsetX = width() / 8;
let midX = center().x;
let blockUnderOffset = center().y + WOOD_BLOCK_HEIGHT;
let wood;
let gameScore;
let gameTime;
let lBlockList;
let rBlockList;
let woodList;
let blockPosList;
let player;
let playerInBlock;
let LX = 0;
//State: left 0 right 1 none 2
let gameState = 0;
//State: 0 stop 1 run 2 score

const bgm = play("bgm", {
  loop: true,
})
const bg = add([
  sprite("background"),
  pos(center()),
  origin("center"),
  scale(0.8),
  z(-1)
])


function InitGame() {
  destroyAll("end");
  woodList = new Array();
  blockPosList = new Array();
  gameScore = add((
    [
      "afterclear",
      text("Score:0"),
      pos(midX, 20),
      origin("center"),
      { value: 0 },
      z(1)
    ]
  ))
  gameTime = add((
    [
      "afterclear",
      text("2:00:00"),
      pos(midX, 80),
      origin("center"),
      {
        value: 120000,
        isStart: false
      },
      z(1)
    ]
  ))
  player = add(
    [
      "block",
      pos(midX - blockOffsetX, blockUnderOffset + WOOD_BLOCK_HEIGHT),
      sprite("player"),
      origin("center"),
      scale(SCALE_X),
      z(3)
    ]
  )
  playerInBlock = add(
    [
      "block",
      pos(midX, blockUnderOffset + WOOD_BLOCK_HEIGHT),
      sprite("wood", {
        frame: 4,
      }),
      origin("center"),
      scale(SCALE_X)
    ]
  )
  gameScore.textSize = width() / 10;
  gameTime.textSize = width() / 10;
  for (let i = 0; i < MAX_TREE_HEIGHT; ++i) {
    blockPosList.push(2);
    woodList.push(add([
      "block",
      sprite("wood", {
        frame: randi(4, 8),
      }),
      pos(midX, blockUnderOffset - WOOD_BLOCK_HEIGHT * i),
      origin("center"),
      scale(SCALE_X)
    ]))
  }
  gameState = 1;
}

function updateBlock() {
  playerInBlock.frame = woodList[0].frame;
  for (let i = 0; i < MAX_TREE_HEIGHT - 1; ++i) {
    blockPosList[i] = blockPosList[i + 1];
    woodList[i].frame = woodList[i + 1].frame;
  }
  let t = randi(0, 10) < 5 + LX ? 0 : 1;
  if (t == 0) {
    if (LX > 0) {
      LX = 0;
    } else {
      LX--;
    }
  } else {
    if (LX < 0) {
      LX = 0;
    } else {
      LX++;
    }
  }
  blockPosList[MAX_TREE_HEIGHT - 1] = t;
  woodList[MAX_TREE_HEIGHT - 1].frame = t * 2 + randi(0, 2);
  // for(let i=0;i<MAX_TREE_HEIGHT;++i){
  //     if(blockPosList[i]==0){
  //         lBlockList[i].hidden=false;
  //         rBlockList[i].hidden=true;
  //     }else if(blockPosList[i]==1){
  //         lBlockList[i].hidden=true;
  //         rBlockList[i].hidden=false;
  //     }else{
  //         lBlockList[i].hidden=true;
  //         rBlockList[i].hidden=true;
  //     }
  // }
  player.stop();
  //开始计时
  player.play("cut", {
    speed: 12,
    onEnd: () => {
      player.play("stay");
    }
  })
  gameTime.isStart = true;
}


function fixZeroStart(str, n) {
  return (Array(n).join('0') + str).slice(-n);
}


function dirInScreen(pos) {
  return pos.x > midX ? 1 : 0;
}

function blockLogic(f) {
  if (f == 0) {
    player.moveTo(midX - blockOffsetX, blockUnderOffset + WOOD_BLOCK_HEIGHT);
    player.flipX(false);
  } else {
    player.moveTo(midX + blockOffsetX, blockUnderOffset + WOOD_BLOCK_HEIGHT);
    player.flipX(true);
  }
  if (f == blockPosList[0]) return false;
  return true;
}

function gameOver() {
  destroyAll("block");
  gameState = 2;
  let scoreTable = add(
    [
      "end",
      text("Game Over\nYour Score:" + gameScore.value),
      pos(center()),
      origin("center"),
    ]
  )
  scoreTable.textSize = width() / 9;
  destroyAll("afterclear");
}

function OnClickMob(i, pos) {
  OnClick(pos);
}

function OnClick(pos) {
  switch (gameState) {
    case 0: break;
    case 1:
      if (blockLogic(dirInScreen(pos))) {
        gameScore.value += 1;
        updateBlock();
      } else {
        gameOver();
      }
      break;
    case 2:
      InitGame();
      break;
  }
}

function updateText() {
  if (gameState == 1) {
    if (gameTime.isStart == true) {
      gameTime.value -= Math.trunc(dt() * 1000);
    }
    if (gameTime.value < 0) {
      gameOver();
    }
    gameTime.text = Math.trunc(gameTime.value / 60000) + ":" + fixZeroStart(Math.trunc(gameTime.value / 1000) % 60, 2) + ":" + fixZeroStart(Math.trunc(gameTime.value / 10) % 100, 2);
    gameScore.text = "Score:" + gameScore.value;
  }
}


InitGame();
onMousePress(OnClick);
onTouchStart(OnClickMob);
onUpdate(updateText);
