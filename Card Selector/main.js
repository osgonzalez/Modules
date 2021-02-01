var app = new Vue({
  el: '#app',
  data: {
    cards: [],
    types: {
      'death': 'fas fa-skull-crossbones',
      'money': 'fas fa-dollar-sign',
      'comments': 'fas fa-comments-dollar',
      'law': 'fas fa-gavel',
      'nada': 'fas fa-yin-yang'
    },
    numbers: {
      'death': 3,//2
      'money': 3,
      'comments': 1,//3
      'law': 2,
      'nada': 4
    },
    display: false,
    colors: ['red','gray','gold'],
    shuffleSpeed: 'shuffleSlow',
    shuffleTypes: ['Slow', 'Medium', 'Fast'],
    isDeckShuffled: false,
    shuffleCount: 0,
  },
  created() {
    this.displayInitialDeck();
  },
  methods: {
    displayInitialDeck() {
      let id = 1;
      this.cards = [];
      for( var type in this.types) {
        for( var i = 0; i < this.numbers[type]; i++) {
            for( var color in this.colors) {
              let card = {
                id: id,
                type: this.types[type],
                color: this.colors[color],
                display: true,
                position: 0
              }
              this.cards.push(card);
              id++;
          }
        }
      }

      this.isDeckShuffled = false;
      this.shuffleCount = 0;
    },
    shuffleDeck() {
      for(let i = 0; i < this.cards.length; i++){
        setTimeout(function() {
          app.cards[i].display = false;
        }, i*50);
      }

      setTimeout(function() {
        for(let i = app.cards.length - 1; i > 0; i--) {
          let randomIndex = Math.floor(Math.random() * i);

          let temp = app.cards[i];
          Vue.set(app.cards, i, app.cards[randomIndex]);
          Vue.set(app.cards, randomIndex, temp);


        }
      },this.cards.length*50 + 300);

      setTimeout(function() {
        for(let i = app.cards.length - 1; i > 0; i--) {
          let randomIndex = Math.floor(Math.random() * i);

          let temp = app.cards[i];
          Vue.set(app.cards, i, app.cards[randomIndex]);
          Vue.set(app.cards, randomIndex, temp);
        }
      },this.cards.length*50 + 2500);



      for(let i = 0; i < this.cards.length; i++){
        setTimeout(function() {
          app.cards[i].position = i+2;
        }, this.cards.length*50 + 5000  + i*50);
      }



      this.isDeckShuffled = true;
      this.shuffleCount = this.shuffleCount + 1;
    }
  },
});
