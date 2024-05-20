class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {

        this.load.image('mainmenu', 'assets/menu/menuBG.jpg');
        this.load.image('vignette', 'assets/vignette.jpg');
        this.load.image('playButton', 'assets/menuBTNS/playBTN.png');
        this.load.image('creditsButton', 'assets/menuBTNS/creditsBTN.png');
        this.load.image('quitButton', 'assets/menuBTNS/quitBTN.png');
    }

    create() {

        const mainmenu1 = this.add.image(400, 300, 'mainmenu').setDisplaySize(800, 600);
        const vignette = this.add.image(400, 300, 'vignette').setDisplaySize(800, 600);
        vignette.setAlpha(0.3); 

        const playButton = this.add.image(400, 200, 'playButton').setInteractive();
        playButton.setScale(0.5); 
        playButton.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height - 100);

        playButton.on('pointerdown', () => {
        this.scene.start('GameScene');
        });

        const creditsButton = this.add.image(50, 100, 'creditsButton').setInteractive(); 
        creditsButton.setScale(0.5);
        creditsButton.setPosition(creditsButton.width / 3, creditsButton.height / 3); 
        creditsButton.on('pointerdown', () => {
            this.scene.start('CreditsScene');
        });
        
        const quitButton = this.add.image(this.sys.game.config.width - 100, 100, 'quitButton').setInteractive();
        quitButton.setScale(0.5);
        quitButton.setPosition(this.sys.game.config.width - quitButton.width / 3, quitButton.height / 3);
        quitButton.on('pointerdown', () => {
            alert('You exited the game.');
        });

    }
}

export default MainMenuScene;