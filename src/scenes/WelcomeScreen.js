import Phaser from 'phaser';
import { createPrimaryButton } from '../utilita/bottonepri.js';

export class WelcomeScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'WelcomeScreen' });
    }

    preload() {
        // Carica le risorse qui
        // Carica l'immagine di spiegazione del gioco
        this.load.image('spiegazione', 'assets/wherisacquaviva/spiegazione-gioco-1.png');
    }

    create() {
        // Imposta lo sfondo
        this.cameras.main.setBackgroundColor('#FFFBF5');

        // Aggiungi l'immagine di spiegazione del gioco
        const spiegazioneImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'spiegazione').setOrigin(0.5);

        // Ridimensiona l'immagine per adattarla al contenitore
        spiegazioneImage.setScale(Math.min(this.cameras.main.width / spiegazioneImage.width, this.cameras.main.height / spiegazioneImage.height) * 0.8);

        // Crea il nuovo pulsante riutilizzabile
        this.startButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 200,
            'Avvia Secretum',
            () => {
                console.log("Pulsante Avvia Secretum premuto, avvio il gioco...");
                this.scene.start('LivelloUno');
            }
        );

        // Gestisci il clic sul pulsante di avvio
        startButton.on('pointerdown', () => {
            this.scene.start('LivelloUno');
        });
    }
}
