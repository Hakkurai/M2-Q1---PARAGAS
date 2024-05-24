class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.meatColors = ['0xff0000', '0xffa500', '0xffff00', '0x008000', '0x0000ff', '0x4b0082', '0xee82ee'];
        this.meatColorIndex = 0;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('meat', 'assets/meat.png');
        this.load.image('meteor', 'assets/meteor.png');
        this.load.spritesheet('dino', 'assets/dino.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.add.image(600, 300, 'background');

        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(190, 570, 'ground').setScale(1).refreshBody();
        this.platforms.create(610, 400, 'ground');
        this.platforms.create(140, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.player = this.physics.add.sprite(100, 350, 'dino');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);
        this.player.body.setGravityY(300);

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

        this.meats = this.physics.add.group({
            key: 'meat',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        this.meats.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.meats, this.platforms);
        this.physics.add.overlap(this.player, this.meats, this.collectMeat, null, this);

        this.scoreText = this.add.text(16, 16, 'Meat Collected: 0', { fontSize: '20px', fill: '#000' }).setOrigin(-2.4, 0);

        this.meteors = this.physics.add.group();
        this.physics.add.collider(this.meteors, this.platforms);
        this.physics.add.collider(this.player, this.meteors, this.hitMeteor, null, this);

        this.cursors = this.input.keyboard.createCursorKeys(); // Move this to create()
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-500);
        }
    }

    collectMeat(player, meat) {
        meat.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('Meat Collected: ' + this.score);

        if (++this.meatColorIndex >= this.meatColors.length) {
            this.meatColorIndex = 0;
        }
        this.player.setTint(parseInt(this.meatColors[this.meatColorIndex], 16));

        if (this.score % 50 === 0) {
            this.player.setScale(this.player.scaleX + 0.1, this.player.scaleY + 0.1);
        }

        if (this.meats.countActive(true) === 0) {
            this.meats.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            let x = Phaser.Math.Between(0, 800);
            let newMeat = this.meats.create(x, 0, 'meat');
            newMeat.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
        }

        if (this.score % 120 === 0) {
            let x = Phaser.Math.Between(0, 800);
            let meteor = this.meteors.create(x, 0, 'meteor');
            meteor.setBounce(1);
            meteor.setCollideWorldBounds(true);
            meteor.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    hitMeteor(player, meteor) {
        this.physics.pause();

        this.player.setTint(0xff0000);

        this.player.anims.play('turn');

        this.add.text(400, 300, 'Game Over', { fontSize: '48px', fill: '#ff0000' }).setOrigin(0.5);
    }
}

export default GameScene;
