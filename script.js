const containerMemory = document.querySelector(".containerMemory");//Hämtar ett element från HTML-dokumentet med klassen "containerMemory" med hjälp av querySelector
let flippedCards = []; //Tom array som ska fyllas med kort som användaren har vänt på
const matchedCards = []; //Tom array som ska spara matchade par


// KORT ARRAY
//Här skapar jag arrayer med bilderna som används i memoryspelet. 
// Jag väljer att hårdkoda dessa bilder direkt i koden eftersom antalet är relativt litet, 
// vilket gör det praktiskt för just detta projekt. Om det skulle handla om många fler filer 
// hade jag hanterat dem via en databas eller en dynamisk filhämtning.

// Skapar huvudarray "fronts" som innehåller alla framsidor av kortparen.
// Varje bild förekommer två gånger i arrayen eftersom varje kortpar består av två identiska bilder.
let fronts = [
  "memoryGamesImages/capybara.webp", "memoryGamesImages/capybara.webp",
  "memoryGamesImages/cat.webp", "memoryGamesImages/cat.webp",
  "memoryGamesImages/dog.webp", "memoryGamesImages/dog.webp",
  "memoryGamesImages/dog2.webp", "memoryGamesImages/dog2.webp",
  "memoryGamesImages/hedgehog.webp", "memoryGamesImages/hedgehog.webp",
  "memoryGamesImages/horse.webp", "memoryGamesImages/horse.webp",
  "memoryGamesImages/koala.webp", "memoryGamesImages/koala.webp",
  "memoryGamesImages/rabbit.webp", "memoryGamesImages/rabbit.webp",
  "memoryGamesImages/shiba.webp", "memoryGamesImages/shiba.webp"
];
//Array för nivå 1 (lätt)
let easyCardset = [
  "memoryGamesImages/capybara.webp", "memoryGamesImages/capybara.webp",
  "memoryGamesImages/cat.webp", "memoryGamesImages/cat.webp"
]

//Array för nivå 2 (medium)
let mediumCardset = [
  "memoryGamesImages/capybara.webp", "memoryGamesImages/capybara.webp",
  "memoryGamesImages/cat.webp", "memoryGamesImages/cat.webp",
  "memoryGamesImages/dog.webp", "memoryGamesImages/dog.webp",
]

//Array för nivå 3 (hård)
//För att försäkra funktionaliteten behövde jag ha 1 array för varje svårighetsnivå och en original array (fronts). När default arrayen
//"fronts" användes som array för "hård" svårighetsnivå fungerade spelet ibland, ibland inte
let hardCardset = ["memoryGamesImages/capybara.webp", "memoryGamesImages/capybara.webp",
  "memoryGamesImages/cat.webp", "memoryGamesImages/cat.webp",
  "memoryGamesImages/dog.webp", "memoryGamesImages/dog.webp",
  "memoryGamesImages/dog2.webp", "memoryGamesImages/dog2.webp",
  "memoryGamesImages/hedgehog.webp", "memoryGamesImages/hedgehog.webp",
  "memoryGamesImages/horse.webp", "memoryGamesImages/horse.webp",
  "memoryGamesImages/koala.webp", "memoryGamesImages/koala.webp",
  "memoryGamesImages/rabbit.webp", "memoryGamesImages/rabbit.webp",
  "memoryGamesImages/shiba.webp", "memoryGamesImages/shiba.webp"]

// Skapar likadan stor array som "fronts", använder .push metod för att sätta in bilder för baksidan av korten
let backs = [];
for (let i = 0; i < fronts.length; i++) {
  //Jag loopar genom arrayen "fronts" för att få veta hur lång den är och skapar sedan likadan lång array "backs"
  //alla array items är här likadana (samma bild) som jag lägger in i arrayen mha metoden .push
  backs.push("memoryGamesImages/pinguinBack.webp");
}



////MEMORY KORTEN SKAPAS
// Här skapar jag korten dynamiskt och lägger de i en html div. Varje kort är en div som får en klass pch ett attribut "data-name" 
function createCards() {
  containerMemory.innerHTML = ""; // div som innehåller korten toms 
  for (let i = 0; i < fronts.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-name", fronts[i]); // för att kunna nå array items baserad på deras namn skapar jag en custom attribut "data-name" som är lik array item namn som jag sedan jämför

    const front = document.createElement("div");
    front.classList.add("front");
    front.style.backgroundImage = "url(" + fronts[i] + ")";//url hänvisar till vägen till bilder som läggs intill css och kommer att bli bakgrund bild till diven, bilden tas ur arrayen fronts

    const backDiv = document.createElement("div");
    backDiv.classList.add("back");
    backDiv.style.backgroundImage = "url(" + backs[i] + ")";//url hänvisar till vägen till bilder som läggs intill css och kommer att bli bakgrund bild till diven, bilden tas ur arrayen backs


    card.appendChild(front);//lägger nyskapad element in i html
    card.appendChild(backDiv);//lägger nyskapad element in i html
    containerMemory.appendChild(card);//lägger nyskapad element in i html

    // FLIP FUNKTION
    card.addEventListener("click", function () {
      // sålänge det är mindre än 2 kort i arrayen so
      if (flippedCards.length < 2 && !card.classList.contains("flipped")) {
        card.classList.add("flipped");
        flippedCards.push(card);
      }
      // kolla om det är 2 kort i arrayen
      if (flippedCards.length === 2) {
        //Om det är 2 kort i arrayen kör funktion checkMatch som kollar om korten har likadan namn
        checkMatch();
      }
      if (countDownTimer <= 0) {
        document.querySelector(".containerMemory").classList.add("disable-clicks");//Efter tiden har gått ut läggs till class som gör korten omöjlight att clicka på. Det aktiveras med att klicka på ett kort! 
        console.log("Time's up! No more moves allowed.");
      }
    });


  }
}

// BLANDA KORTEN
// funktion som blandar korten görs mha Fisher-Yates algorithm som jag har i princip lånat men förståd hur den fungerar
function shuffle() {
  let i = fronts.length, j, temp;
  while (--i > 0) {
    j = Math.floor(Math.random() * (i + 1));
    temp = fronts[j];
    fronts[j] = fronts[i];
    fronts[i] = temp;
  }
  createCards(); // kör funktion som skapar korten igen
}

//HITTA PAR
function checkMatch() {
  //Funktionen innehåller en konstant som är array av 2 kort som är likadan med arrayen "flippedCards"
  const [firstCard, secondCard] = flippedCards;
  //Kollar om custom attribut "data-namn" har likadan värde hos första och andra kortet
  if (firstCard.getAttribute("data-name") === secondCard.getAttribute("data-name")) {
    //Om värden är likadana ska första och andra korten läggas in i arrayen matchedCards
    matchedCards.push(firstCard, secondCard); // Lägger korten med likadan filnamn (data-name) arrayen matchedCards
    flippedCards = []; // Tommer arrayen för vända korten

    // Så snart som arrayen matchedCards blir lika lång som arrayen med alla spelkort betyder det att användaren har vunnit
    if (matchedCards.length === fronts.length) {
      setTimeout(function () {
        modal.style.display = "block"; //styl hos modalen ändras till att den blir nu synbar
        winnerMessage();// funktion som hanterar en array med flertal grattis meddelande startas
        clearInterval(x);//Stoppar nedräkning! 
      }, 1000);//Fördröjer visning av meddelandet med 1 sekund för bättre användarupplevelse


    }
  }

  else {
    //Ifall korten inter är likadana då läggs de tillbaka med ryggen upp mha ändring av css class
    setTimeout(() => {
      //metoden .forEach gör att det hanteras alla elementen i arrayen 
      flippedCards.forEach(card => card.classList.remove("flipped"));
      flippedCards = []; // Tommer arrayen för flipped cards
    }, 1000);
  }

}


//Modal winner och modal looser samt arrayer med peppande meningar är skapade på samma sätt
// MODAL WIN MESSAEGE 
//hämtar modalen från html dokumentet mha ID
const modal = document.getElementById("myModal");
//Jag ger möjlighet att stänga modalen och stanna och titta på avslutade spel så att användarna kan titta på bilderna i längden om de vill, man måste inte påbörja ny spel direkt
function closeModal() {
  modal.style.display = "none";
}
// Add event listener to close button
document.querySelector(".modalCloseWinner").addEventListener("click", closeModal);
// Add event listeners to game buttons
document.querySelectorAll(".btn").forEach(button => {
  button.addEventListener("click", function () {
    closeModal(); // Close the modal

  });
});
//Array med olika peppande meningar, det slumpas genom array innhållet 
function winnerMessage() {
  const winnerMessage = ["Du är bäst!", "Du är så smart!", "Jag tror inte att det finns någon som är lika smart som du!", "Jag kan inte fatta att ditt minne är så fantastiskt!", "Imponerande!"];
  const modalContent = document.querySelector(".winnerMessage");
  const randNumber = Math.floor(Math.random() * winnerMessage.length);
  modalContent.innerHTML = winnerMessage[randNumber];
}

//MODAL LOOSER MESSAGE
//hämtar modalen från html dokumentet mha ID
const modalLooser = document.getElementById("myModalLooser");
// Funktion som ändrar css av modalen
function closeModalLooser() {
  modalLooser.style.display = "none";
}
// click funktion
//Jag ger möjlighet att stänga modalen och stanna och titta på avslutade spel så att användarna kan titta på bilderna i längden om de vill, man måste inte påbörja ny spel direkt
document.querySelector(".modal-close-looser").addEventListener("click", closeModalLooser);
// querySelectorAll skapar en node av knappar som sedan kan hanteras som en array, jag kan då använda .forEach metoden som gör att event listener och funktion kopplade till den påverkar alla valda knappar
document.querySelectorAll(".btn").forEach(button => {
  button.addEventListener("click", function () {
    closeModalLooser(); // Close the modal

  });
});
//Array med olika peppande meningar, det slumpas genom array innhållet 
function looserMessage() {
  const looserMessage = ["Försök igen, du fixar det!", "Övning ger färdighet, kom igen!", "Fokusera lite till, du är nära!", "Nästan där! Inte ge upp nu!"];
  const modalContentLooser = document.querySelector(".looserMessage");
  const randNumber = Math.floor(Math.random() * looserMessage.length);
  modalContentLooser.innerHTML = looserMessage[randNumber];
}




// TIME COUNTDOWN
// Skapar toma globala variabel som jag sedan hanterar i funktionen men behöver ställa in dom dynamiskt utanför funktionen, därför är de globala såhär
let countDownTimer;
let x;

// Ger innehåll till html element med id #countDown. Det är det som användaren ser innan spelet påbörjas
document.getElementById("countDown").innerHTML = "Du måste vara snabb!";

function startCountdown() {
  clearInterval(x)//Tommer intervall så att det inte krockar med något, funktionen funkar rätt inte utan detta
  x = setInterval(function () {

    // variabel minskas med 1 
    countDownTimer--;
    document.getElementById("countDown").innerHTML = "Tid kvar " + countDownTimer + "s";//ny innehåll för element med id #countDown
    // Kollar om numret är lika stor eller mindre än 0
    if (countDownTimer <= 0) {//ifall variabel x blir lika med 0 har användaren förlorat
      document.getElementById("countDown").innerHTML = "Tiden är ute, försök igen!"; // 0 sekunder kvar 
      clearInterval(x);
      if (matchedCards.length !== fronts.length) {
        setTimeout(function () {
          modalLooser.style.display = "block";
          looserMessage();
          clearInterval(x);
        }, 1000); // meddelandet visar efter 1 sekund för bättre användarupplevelse
      }
    }
  }, 1000);//nedräkning med 1 sekund
}



// GAME START
//Beroende på vilken knapp använderan klickar funktion ska köras. 
function startGame(gameType) {
  // Detta gäller för alla spel
  matchedCards.length = 0; // Tommer array
  flippedCards.length = 0; // Tommer array

  // olika fall (case) kör olika kod. Jag når olika knappar genom att jag gav de custom attribute (data-game) som jag få fram mha querySelector
  switch (gameType) {
    case "easy":
      fronts = [...easyCardset];//Original array ändrass till array front1
      containerMemory.classList.add("containerMemoryEasy");//För att få önskade utseende lägger jag till varje spel speciell css class som hanterar storlek av diven som korten ligger i.
      containerMemory.classList.remove("containerMemoryMedium", "containerMemoryHard");//för säkerhetskull tar jag bort de andra klasser som jag inte vill använda för denna spelet
      countDownTimer = 20;//ställer värde för globala variabel countDownTimer 
      break;

    case "medium":
      fronts = [...mediumCardset];
      containerMemory.classList.add("containerMemoryMedium");
      containerMemory.classList.remove("containerMemoryEasy", "containerMemoryHard");
      countDownTimer = 45;
      break;


    case "hard":
      fronts = [...hardCardset];
      containerMemory.classList.add("containerMemoryHard");
      containerMemory.classList.remove("containerMemoryEasy", "containerMemoryMedium");
      countDownTimer = 140;
      break;

    default://
      fronts = [...fronts2];
      containerMemory.classList.add("containerMemoryMedium");
      containerMemory.classList.remove("containerMemoryEasy", "containerMemoryHard");
      countDownTimer = 30;
      break;
  }
  shuffle();// kör funktion som blandar korten vid varje ny spel
  startCountdown();//kör funktion som räknar ner tiden vid varje ny spel
  document.querySelector(".containerMemory").classList.remove("disable-clicks");//Vid ny spel tas bort css class som gjorde det omöjligt att klicka på korten så att de fungerar igen

}


//Här jobbar jag med alla element som har class btn, alla får en lyssnare som lyssnar efter click
// funktionen först tar bort ett css class från alla
document.querySelectorAll(".btn").forEach(button => {
  button.addEventListener("click", function () {
    // Tar bort class "activeButton" från alla knappar
    document.querySelectorAll(".activeButton").forEach(activeButton => {
      activeButton.classList.remove("activeButton");
    });

    // Lägger till "activeButton" class till knapped som klickades på
    this.classList.add("activeButton");

    // nyskapad constant gameType tar custom attribute från knappar som startar spelet
    const gameType = this.getAttribute("data-game");
    startGame(gameType);//funktionen startGame har constant gameType som parameter
  });
});


//Dynamisk uppdaterar år som sidan skapades i med hjälp av javascripts innbygd metod
document.getElementById("year").innerHTML = new Date().getFullYear();



