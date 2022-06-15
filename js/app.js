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
            20, // updates every 20ms
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
            ent.update();
            self.ctx.drawImage(ent.sprite, ent.x, ent.y);
        })
    }
}

class Player {
    ctx;
    spritePath = "assets/player.png";
    sprite;
    isAnimating = false;
    x = 0;
    y = 0;
    // move to these coordinates via interpolating
    dest = {"x": 0, "y": 0};
    // used to indicate if moving on x or y (for interpolation)
    axis = null; 

    // ctx should be the ctx from our instance of Screen
    constructor(x=0, y=0) {
        this.x = x;
        this.y = y;
        this.sprite = new Image();
        this.sprite.src = this.spritePath;
    }

    update(dt) {
        this.interpolateMove();
    }

    handleInput(keyCode, sw, sh) {
        // Ignore input while we're animating
        if (this.isAnimating) {return;}
        // If it's an arrow key, we're animating
        if (keyCode.indexOf("Arrow") > -1) {this.isAnimating = true;}

        // Handle moving in the 4 directions (TODO: less duplication?)
        if (keyCode == 'ArrowLeft' && this.x > 0) {
            this.axis = "x";
            this.dest["x"] = this.x - 64;
        }
        else if (keyCode == 'ArrowUp' && this.y > 0) {
            this.axis = "y";
            this.dest["y"] = this.y - 64;
        }
        else if (keyCode == 'ArrowRight' && this.x < (sw - 64)) {
            this.axis = "x";
            this.dest["x"] = this.x + 64;
        }
        else if (keyCode == 'ArrowDown' && this.y < (sh - 64)) {
            this.axis = "y";
            this.dest["y"] = this.y + 64;
        }
    }
    interpolateMove() {
        if (this.isAnimating) {
            if (this.axis == "x") {
                this.x = this.x - this.dest["x"] >= 0 ? this.x - 8 : this.x + 8;
            } else if (this.axis == "y") {
                this.y = this.y - this.dest["y"] >= 0 ? this.y - 8 : this.y + 8;
            }
        }
        if (this.x == this.dest["x"] && this.y == this.dest["y"])  {
            this.isAnimating = false;
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

