import Phaser from 'phaser';
import { createPrimaryButton } from '../../utilita/bottonepri.js';

export class WelcomeScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'WelcomeScreen' });
    }

    preload() {
        // Carica l'immagine di spiegazione del gioco
        this.load.image('spiegazioneWheris', 'assets/wherisacquaviva/spiegazione-gioco-1.png');
    }

    create() {
        // Imposta lo sfondo
        this.cameras.main.setBackgroundColor('#FFFBF5');
        this.cameras.main.fadeIn(500, 255, 251, 245);

        // Rimosso il controllo Audio

        // Aggiungi il titolo del gioco sopra l'immagine di spiegazione
        const titleText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height * 0.13,
            'WherisAcquaviva',
            {
                fontFamily: 'Poppins',
                fontSize: '32px',
                color: '#000000',
                wordWrap: { width: this.cameras.main.width * 0.8 }
            }
        ).setOrigin(0.5);

        // Aggiungi l'immagine di spiegazione del gioco
        const spiegazioneImage = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'spiegazioneWheris'
        ).setOrigin(0.5);
        spiegazioneImage.setScale(Math.min(
            this.cameras.main.width / spiegazioneImage.width,
            this.cameras.main.height / spiegazioneImage.height
        ));

        // Crea il pulsante di avvio
        this.startButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + (spiegazioneImage.displayHeight / 2) + 30,
            'Partenza!!',
            () => {
                this.cameras.main.fadeOut(500, 255, 251, 245);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('WherisAcquaviva');
                });
            }
        );
        // Rimuovi la texture solo quando la scena viene distrutta
        this.events.once(Phaser.Scenes.Events.DESTROY, () => {
            this.textures.remove('spiegazioneWheris');
        });

    }
}
