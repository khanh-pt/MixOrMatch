if(document.readyState === 'loading') {
  console.log('document is loading...');
  document.addEventListener('DOMContentLoaded', ready)
} else {
  ready();
}

class AudioController {
  constructor(){
    this.bgSound = new Audio('Assets/Audio/creepy.mp3');
    this.flipSound = new Audio('Assets/Audio/flip.wav');
    this.gameOverSound = new Audio('Assets/Audio/gameOver.wav');
    this.matchSound = new Audio('Assets/Audio/match.wav');
    this.victorySound = new Audio('Assets/Audio/victory.wav');
  }
  playBgSound(){
    this.bgSound.play();
    this.bgSound.volume = 0.7;
    this.bgSound.loop = true;
  }
  pauseBgSound(){
    this.bgSound.pause();
    this.bgSound.currentTime = 0;
  }
  playFlipSound(){
    this.flipSound.play();
  }
  playMatchSound(){
    this.matchSound.play();
  }
  playVictorySound(){
    this.victorySound.play();
  }
  playGameOverSound(){
    this.gameOverSound.play();
  }
}

class MixOrMatch {
  constructor(totalTime, cards){
    this.totalTime = totalTime;
    this.cards = cards;
    this.timeRemaining = totalTime;
    this.$time = document.getElementById('time');
    this.$flip = document.getElementById('flip');
    this.audioController = new AudioController();
    console.log(this.$time);
  }
  
  startGame(){
    this.hideCards();
    this.cardToCheck = null;
    this.totalFlips = 0;
    this.timeRemaining = this.totalTime;
    this.matchedCards = [];
    this.busy = true;
    this.$time.innerText = this.totalTime;
    setTimeout(() => {
      // wait shuffle cards done
      this.busy = false;
      this.audioController.playBgSound();
      this.shuffleCards();
      this.counter = this.countDown();
    }, 1000);
    
  }
  hideCards(){
    this.cards.forEach(function(card){
      card.classList.remove('visible');
    })
  }
  shuffleCards(){
    const cardsLength = this.cards.length;
    for(let i = cardsLength - 1; i > 0; i-- ){
      let randomIndex = Math.floor(Math.random() * (i+1));
      this.cards[randomIndex].style.order = i;
      this.cards[i].style.order = randomIndex;
    }
  }
  countDown(){
    return setInterval(() => {
      this.timeRemaining--;
      this.$time.innerText = this.timeRemaining;
      if(this.timeRemaining === 0) {
        this.gameOver();
      }
    }, 1000);
  }
  canFlipCard(card){
    return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
  }
  flipCard(card){
    if(this.canFlipCard(card)){
      this.audioController.playFlipSound();
      this.totalFlips++;
      this.$flip.innerText = this.totalFlips;
      card.classList.add('visible');
      if(this.cardToCheck){
        this.checkCardsMatch(card, this.cardToCheck);
        this.cardToCheck = null;
      } else {
        this.cardToCheck = card;
      }
    }
  }
  checkCardsMatch(card1, card2){
    this.busy = true;
    const value1 = card1.getElementsByClassName('card-value')[0].src;
    const value2 = card2.getElementsByClassName('card-value')[0].src;
    if(value1 === value2){
      this.audioController.playMatchSound();
      this.matchedCards.push(card1, card2);
      card1.classList.add('match');
      card2.classList.add('match');
      console.log(this.matchedCards.length);
      console.log(this.cards.length);
      if(this.matchedCards.length === this.cards.length){
        console.log('???');
        this.victory();
      }
      this.busy = false;
    } else {
      setTimeout(() => {
        card1.classList.remove('visible');
        card2.classList.remove('visible');
        this.busy = false;
      }, 1000)
      
    }
  }
  victory(){
    this.audioController.playVictorySound();
    this.audioController.pauseBgSound();
    document.getElementById('victory').classList.add('visible');
    clearInterval(this.counter);
  }
  gameOver(){
    this.audioController.playGameOverSound();
    this.audioController.pauseBgSound();
    document.getElementById('game-over').classList.add('visible');
    clearInterval(this.counter);
  }
}

function ready(){
  // remove cards for PC
  var cardsPC = Array.from(document.getElementsByClassName('forPC'));
  cardsPC.forEach(function(card){
    card.remove();
  })
  var $overlaysText = Array.from(document.getElementsByClassName('overlay-text'));
  var $cards = Array.from(document.getElementsByClassName('card'));
  var game = new MixOrMatch(50, $cards);
  console.log(game);

  $overlaysText.forEach(function(overlay){
    overlay.addEventListener('click', function(){
      this.classList.remove('visible');
      game.startGame();
    })
  })

  $cards.forEach(function(card){
    card.addEventListener('click', function(){
      game.flipCard(card);
    })
  })
}