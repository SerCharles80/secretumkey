import Phaser from 'phaser';
import { createPrimaryButton } from '../utilita/bottonepri.js';

export class WelcomeScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'WelcomeScreen' });
    }

    preload() {
        // Carica l'immagine di spiegazione del gioco
        this.load.image('spiegazione', 'assets/wherisacquaviva/spiegazione-gioco-1.png');
    }

    create() {
        // Imposta lo sfondo
        this.cameras.main.setBackgroundColor('#FFFBF5');


        this.input.once('pointerdown', () => {
            // Controlla se this.sound e this.sound.context esistono
            if (this.sound && this.sound.context) {
                if (this.sound.context.state === 'suspended') {
                    this.sound.context.resume().then(() => {
                        console.log('AudioContext ripreso!');
                    }).catch((err) => {
                        console.error('Errore nel riprendere l\'AudioContext:', err);
                    });
                }
            } else {
                console.log('Audio non disponibile o non abilitato.');
            }
        });


        // Aggiungi l'immagine di spiegazione del gioco
        const spiegazioneImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 80, 'spiegazione').setOrigin(0.5);

        // Ridimensiona l'immagine per adattarla al contenitore
        spiegazioneImage.setScale(Math.min(this.cameras.main.width / spiegazioneImage.width, this.cameras.main.height / spiegazioneImage.height) * 0.7);

        // Crea il nuovo pulsante riutilizzabile
        this.startButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 150,
            'Avvia Secretum',
            () => {
                console.log("Pulsante Avvia Secretum premuto, avvio il gioco...");
                this.scene.start('WherisAcquaviva');
            }
        );

        // Gestisci il clic sul pulsante di avvio
        this.startButton.on('pointerdown', () => {
            this.scene.start('WherisAcquaviva');
        });
    }
}
