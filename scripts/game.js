var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
let platforms;
let player;
let meats;
let meteors;
let score = 0;
let scoreText;
let meatColors = ['0xff0000', '0xffa500', '0xffff00', '0x008000', '0x0000ff', '0x4b0082', '0xee82ee'];
let meatColorIndex = 0;

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('meat', 'assets/meat.png');
    this.load.image('meteor', 'assets/meteor.png');
    this.load.spritesheet('dino', 'assets/dino.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    this.add.image(600, 300, 'background');
    
    platforms = this.physics.add.staticGroup();

    platforms.create(190, 570, 'ground').setScale(1).refreshBody();

    platforms.create(610, 400, 'ground');
    platforms.create(140, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 350, 'dino');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    player.body.setGravityY(300);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dino', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dino', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dino', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    meats = this.physics.add.group({
        key: 'meat',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    
    meats.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(meats, platforms);
    this.physics.add.overlap(player, meats, collectMeat, null, this);

    scoreText = this.add.text(16, 16, 'Meat Collected: 0', { fontSize: '20px', fill: '#000' }).setOrigin(-2.4, 0);

    meteors = this.physics.add.group();
    this.physics.add.collider(meteors, platforms);
    this.physics.add.collider(player, meteors, hitMeteor, null, this);
}

function update() {
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-500);
    }
}

function collectMeat(player, meat) {
    meat.disableBody(true, true);

    score += 10;
    scoreText.setText('Meat Collected: ' + score);

    if (++meatColorIndex >= meatColors.length) {
        meatColorIndex = 0;
    }
    player.setTint(parseInt(meatColors[meatColorIndex], 16));

    if (score % 50 === 0) {
        player.setScale(player.scaleX + 0.1, player.scaleY + 0.1);
    }

    if (meats.countActive(true) === 0) {
        meats.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = Phaser.Math.Between(0, 800);
        var meat = meats.create(x, 0, 'meat');
        meat.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
    }

    if (score % 120 === 0) {
        var x = Phaser.Math.Between(0, 800);
        var meteor = meteors.create(x, 0, 'meteor');
        meteor.setBounce(1);
        meteor.setCollideWorldBounds(true);
        meteor.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

function hitMeteor(player, meteor) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    this.add.text(400, 300, 'Game Over', { fontSize: '48px', fill: '#ff0000' }).setOrigin(0.5);
}