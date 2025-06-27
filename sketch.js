function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}let farmer;
let oranges = [];
let orangeTrees = [];
let score = 0;
let money = 0;
let gameEnded = false;
let marketVisible = false;
let moveSpeed = 10;
let hasTool = false;
let treeCost = 100;
let toolCost = 150;
let basketCapacity = 999;

let stores = [
  { name: "Loja A", price: 2.5, x: 100, y: 200, w: 100, h: 40 },
  { name: "Loja B", price: 3.0, x: 250, y: 200, w: 100, h: 40 },
  { name: "Loja C", price: 3.5, x: 400, y: 200, w: 100, h: 40 }
];

function setup() {
  createCanvas(600, 400);
  farmer = new Farmer(300, 300);
  orangeTrees.push(new OrangeTree(width / 2, height * 0.7 - 60));
  textAlign(CENTER, CENTER);
}

function draw() {
  background(135, 206, 235);
  drawFarmBackground();

  if (gameEnded) {
    showMarket();
    return;
  }

  // Árvores e laranjas
  for (let tree of orangeTrees) {
    tree.display();
  }

  if (frameCount % 60 === 0 && score < basketCapacity) {
    for (let tree of orangeTrees) {
      oranges.push(new Orange(random(tree.x - 30, tree.x + 30), tree.y));
    }
  }

  for (let i = oranges.length - 1; i >= 0; i--) {
    oranges[i].fall();
    oranges[i].display();
    if (oranges[i].isCollectedBy(farmer)) {
      oranges[i].collected = true;
      score++;
    }
  }

  oranges = oranges.filter(o => !o.collected);
  farmer.display();

  fill(0);
  textSize(16);
  text("Laranjas: " + score, width / 2, 30);
  text("Dinheiro: R$ " + money.toFixed(2), width / 2, 50);

  if (score >= 25 && !gameEnded) {
    gameEnded = true;
    marketVisible = true;
  }

  if (keyIsDown(LEFT_ARROW)) farmer.move(-moveSpeed, 0);
  if (keyIsDown(RIGHT_ARROW)) farmer.move(moveSpeed, 0);
  if (keyIsDown(UP_ARROW)) farmer.move(0, -moveSpeed);
  if (keyIsDown(DOWN_ARROW)) farmer.move(0, moveSpeed);
}

function drawFarmBackground() {
  fill(85, 153, 42);
  noStroke();
  rect(0, height * 0.7, width, height * 0.3);

  stroke(139, 69, 19);
  strokeWeight(4);
  for (let x = 0; x < width; x += 40) {
    line(x, height * 0.7, x, height * 0.55);
  }
  for (let y = height * 0.55; y <= height * 0.7; y += 10) {
    line(0, y, width, y);
  }
}

function mousePressed() {
  if (marketVisible) {
    // Vender
    for (let store of stores) {
      if (
        mouseX > store.x && mouseX < store.x + store.w &&
        mouseY > store.y && mouseY < store.y + store.h
      ) {
        money += score * store.price;
        score = 0;
        marketVisible = false;
        gameEnded = false;
        oranges = [];
        return;
      }
    }

    // Comprar árvore
    if (mouseX > 50 && mouseX < 250 && mouseY > 330 && mouseY < 370) {
      if (money >= treeCost) {
        money -= treeCost;
        orangeTrees.push(new OrangeTree(random(100, 500), height * 0.7 - 60));
        alert("Novo pé de laranja plantado!");
      } else {
        alert("Dinheiro insuficiente.");
      }
    }

    // Comprar ferramenta
    if (mouseX > 350 && mouseX < 550 && mouseY > 330 && mouseY < 370) {
      if (!hasTool && money >= toolCost) {
        money -= toolCost;
        hasTool = true;
        moveSpeed = 20;
        alert("Ferramenta comprada! Agora você colhe mais rápido.");
      } else if (hasTool) {
        alert("Você já tem essa ferramenta.");
      } else {
        alert("Dinheiro insuficiente.");
      }
    }
  }
}

function showMarket() {
  background(200, 230, 255);
  fill(0);
  textSize(22);
  text("Mercado de Laranjas", width / 2, 40);
  textSize(16);
  text("Você coletou 25 laranjas!", width / 2, 70);
  text("Seu dinheiro: R$ " + money.toFixed(2), width / 2, 100);
  text("Escolha uma loja para vender:", width / 2, 130);

  for (let store of stores) {
    fill(100, 200, 100);
    rect(store.x, store.y, store.w, store.h, 10);
    fill(0);
    text(store.name + "\nR$" + store.price.toFixed(2), store.x + store.w / 2, store.y + store.h / 2);
  }

  // Comprar árvore
  fill(255, 200, 100);
  rect(50, 330, 200, 40, 10);
  fill(0);
  text("Comprar pé de laranja (R$" + treeCost + ")", 150, 350);

  // Comprar ferramenta
  fill(180, 220, 250);
  rect(350, 330, 200, 40, 10);
  fill(0);
  text(hasTool ? "Ferramenta já comprada" : "Ferramenta (R$" + toolCost + ")", 450, 350);
}

// CLASSES

class Farmer {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30; // tamanho do emoji
  }

  move(x, y) {
    this.x += x;
    this.y += y;
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height - this.size);
  }

  display() {
    textSize(this.size);
    textAlign(CENTER, CENTER);
    text("🧑‍🌾", this.x, this.y);
  }
}

class OrangeTree {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 80;
  }

  display() {
    fill(34, 139, 34);
    ellipse(this.x, this.y, this.size, this.size);
    fill(139, 69, 19);
    rect(this.x - 10, this.y + this.size / 2 - 10, 20, 50);
  }
}

class Orange {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.collected = false;
  }

  fall() {
    this.y += 2;
  }

  display() {
    fill(255, 165, 0);
    ellipse(this.x, this.y, this.size, this.size);
  }

  isCollectedBy(farmer) {
    let d = dist(this.x, this.y, farmer.x, farmer.y);
    return d < (this.size / 2 + farmer.size / 2);
  }
}
