import Phaser from 'phaser';
import { createPrimaryButton } from '../../utilita/bottonepri.js';

export class FortezzaGostIntro extends Phaser.Scene {
    constructor() {
        super({ key: 'FortezzaGostIntro' }); 
    }

    preload() {
        //carico il file immagine di istruzioni
        this.load.image('fortezzaIntro', 'assets/fortezzagost/intro-fortezzaghost.png');
    }

    create() {
        // Applica l'effetto di fade in
        this.cameras.main.fadeIn(500, 255, 251, 245);

        // Aggiungi il titolo del gioco sopra l'immagine delle istruzioni
        const titleText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height * 0.1, // Posizionato al 10% dell'altezza
            'FortezzaGhost',
            {
                fontFamily: 'Poppins',
                fontSize: '34px',
                color: '#000000',
                wordWrap: { width: this.cameras.main.width * 0.8 }
            }
        ).setOrigin(0.5, 0.5);

        // Imposta lo sfondo utilizzando il colore globale (che verrà già impostato nel main.js, se desiderato)
        this.cameras.main.setBackgroundColor('#FFFBF5');

        // Aggiungi l'immagine delle istruzioni nella parte superiore della schermata.
        // L'immagine è posizionata al 25% dell'altezza della camera (modifica se necessario).
        const instructionsImage = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.height * 0.25,
            'fortezzaIntro'
        ).setOrigin(0.5, 0);

        // Ridimensiona l'immagine per adattarla alla larghezza della scena
        const scaleX = this.cameras.main.width / instructionsImage.width;
        const scaleY = (this.cameras.main.height * 0.5) / instructionsImage.height; // Adatta l'altezza al 50% della scena
        const scale = Math.min(scaleX, scaleY);
        instructionsImage.setScale(scale);

        // Crea il pulsante "Continua" nella parte inferiore della schermata.
        // Quando il pulsante viene premuto, la scena passa a quella del gioco Flagpuzzle.
        const continueButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + (instructionsImage.displayHeight / 2) +30,
            'Continua',
            () => {
                console.log("Pulsante Continua premuto!");
                this.scene.start('FortezzaGost'); // Avvia la scena del gioco FlagPuzzle
            }
        );
        // Libera la cache dell'immagine quando la scena viene distrutta
        this.events.once(Phaser.Scenes.Events.DESTROY, () => {
            this.textures.remove('fortezzaIntro');
        });
    }
}