// ----------------------------- Setup + classes ---------------------------- //

class Game {
    start = false;
    gameOver = false;
    screen;
    entities = [];
    constructor(screen) {
        this.screen = screen;
    }

    main() {
        setInterval(
            this.screen.update,
            25,
            this.entities,
            this.screen);
    }
}

class Screen {
    constructor() {
        this.doc = globalThis.document;
        this.win = globalThis.window;
        this.canvas = this.doc.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        // Width should be a multiple of 64 to match our tile size
        this.canvas.width = this.win.innerWidth - (this.win.innerWidth % 64);
        // Create a 16x9 aspect ratio that's also a multiple of 64
        let baseWidth = this.canvas.width * 0.56;
        this.canvas.height = baseWidth - (baseWidth % 64);

        this.doc.body.appendChild(this.canvas);
    }

    update(entities, self) {
        // clear the screen before drawing new frame
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

        entities.forEach(ent => {
            self.ctx.drawImage(ent.sprite, ent.x, ent.y);
        })
    }
}

class Player {
    ctx;
    x = 0;
    y = 0;
    spritePath = "assets/player.png";
    sprite;
    // ctx should be the ctx from our instance of Screen
    constructor(x=0, y=0) {
        this.x = x;
        this.y = y;
        this.sprite = new Image();
        this.sprite.src = this.spritePath;
    }

    update(dt) {
    }

    handleInput(keyCode, sw, sh) {
        if (keyCode == 'ArrowLeft' && this.x > 0) {
            this.x = this.x - 64;
        }
        else if (keyCode == 'ArrowUp' && this.y > 0) {
            this.y = this.y - 64;
        }
        else if (keyCode == 'ArrowRight' && this.x < (sw - 64)) {
            this.x = this.x + 64;
        }
        else if (keyCode == 'ArrowDown' && this.y < (sh - 64)) {
            this.y = this.y + 64;
        }
    }
}

// --------------------------------- Logic ---------------------------------- //

let screen = new Screen();
let game = new Game(screen);
let player = new Player();

game.entities.push(player);

// Start animation loop
game.main();

document.addEventListener('keydown', function(e) {
    player.handleInput(e.key, screen.canvas.width, screen.canvas.height);
});

