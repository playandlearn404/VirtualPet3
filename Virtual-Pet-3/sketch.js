//Create variables here
var database, dog, normalDog, happyDog, foodS, foodStock, hour, time, foodObj;
var bedroom, bedroomImg, washroom, washroomImg, garden, gardenImg, lastfed, readState;
var gameState;
function preload()
{
  //load images here
  normalDog = loadImage("images/Dog.png");
  happyDog = loadImage("images/Happy.png");
  bedroomImg = loadImage("images/BedRoom.png");
  washroomImg = loadImage("images/WashRoom.png");
  gardenImg = loadImage("images/Garden.png");
}

function setup() {
  database = firebase.database();
  createCanvas(900, 900);

  dog = createSprite(730, 200, 50, 50);
  dog.addImage(normalDog);
  dog.scale= 0.3;

  foodObj = new Food(); 

  feed = createButton("Feed the Dog.")
  feed.position(700, 50);
  feed.mousePressed(feedDog);

  addFood = createButton("Add food stock.");
  addFood.position(800, 50);
  addFood.mousePressed(addFoods);

  foodS = database.ref('Food');
  foodS.on("value", function(data) {
    foodS = data.val();
  });

  readState = database.ref('gameState');
  readState.on("value", function(data) {
    readState = data.val(); 
  });

  lastfed = database.ref('lastFed');
  lastfed.on("value", function(data){
    lastfed = data.val();
  });
}


function draw() {  
  background("Lime");
  

  

  if(readState != "Hungry") {
    feed.hide();
    addFood.hide();
    dog.x = 900000;
  } else {
    feed.show();
    addFood.show();
    dog.addImage(normalDog);
    foodObj.display();
  }


  

  if(lastfed == hour() + 1) {
    update("Playing");
    background(gardenImg);
  }else if(lastfed == hour() + 2) {
    update("Sleeping");
    background(bedroomImg);
  }else if(lastfed > hour() + 2 && lastfed <= hour() + 4) {
    update("Playing");
    background(washroomImg);
  }else {
    dog.x = 730
    update("Hungry");
    foodObj.display();
  }
  drawSprites();
  
  

  //add styles here
  textSize(24);
  fill('black');
  stroke("white");
  if (hour() > 12){
    text("Last time fed: " + lastfed % 12 + "PM", 200, 50);
  }else if(hour() < 12){
    text("Last time fed: " + lastfed % 12 + "AM", 200, 50);
  }
}

function addFoods() {
  dog.addImage(normalDog);
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}



function feedDog() {
  dog.addImage(happyDog);
  var updatedFood = foodObj.getStock();
  var final_food_stock = foodS - 1;
  foodObj.updateStock(final_food_stock);
  console.log("fed");
  database.ref('/').update({
    lastFed: hour()
  })
}

function update(state) {
  database.ref('/').update({
      gameState:state
  });
}



// Update the background of the project based on day/night
async function getTime() {
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = await response.json();

  console.log(responseJSON);
  var datetime = responseJSON.datetime;
  hour = datetime.slice(11,13);
}

