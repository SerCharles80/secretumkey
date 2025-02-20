import Phaser from 'phaser';
import { createPrimaryButton } from '../../utilita/bottonepri.js';

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
        this.cameras.main.fadeIn(500, 255, 251, 245); // Fade-in in 500ms con colore nero (puoi cambiare i valori RGB)

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

        // Aggiungi il titolo del gioco sopra l'immagine di spiegazione
        const titleText = this.add.text(this.cameras.main.centerX, this.cameras.main.height * 0.13, 'WherisAcquaviva', {
            fontFamily: 'Poppins',
            fontSize: '36px',
            color: '#000000',
            wordWrap: { width: this.cameras.main.width * 0.8 }
        }).setOrigin(0.5);

        // Aggiungi l'immagine di spiegazione del gioco
        const spiegazioneImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'spiegazione').setOrigin(0.5);

        // Ridimensiona l'immagine per adattarla al contenitore
        spiegazioneImage.setScale(Math.min(this.cameras.main.width / spiegazioneImage.width, this.cameras.main.height / spiegazioneImage.height) * 0.8);

        // Crea il nuovo pulsante riutilizzabile
        this.startButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 230,
            'Avvia Secretum',
            () => {
                console.log("Pulsante Avvia Secretum premuto, avvio il gioco...");
                this.scene.start('WherisAcquaviva');
            }
        );

        // Gestisci il clic sul pulsante di avvio
        this.startButton.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 255, 251, 245);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('WherisAcquaviva'); // Cambia scena dopo il fade-out
            });
        });
    }
}
