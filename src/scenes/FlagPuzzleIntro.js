import Phaser from 'phaser';
import { createPrimaryButton } from '../utilita/bottonepri.js';

export class FlagPuzzleIntro extends Phaser.Scene {
    constructor() {
        super({ key: 'FlagPuzzleIntro' });
    }

    preload() {
        // ...existing preload code...
        // Assicurati di caricare eventuali asset necessari
    }

    create() {
        // Imposta lo sfondo e applica il fade in senza riferimenti a suoni
        this.cameras.main.setBackgroundColor('#FFFBF5');
        this.cameras.main.fadeIn(500, 255, 251, 245);

        // ...existing code per mostrare il titolo o le istruzioni...
        const titleText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height * 0.15,
            'Flag Puzzle Intro',
            {
                fontFamily: 'Poppins',
                fontSize: '32px',
                color: '#000000',
                align: 'center'
            }
        ).setOrigin(0.5);

        // Aggiungi eventuali elementi introduttivi o immagini
        // ...existing code...

        // Crea il pulsante di start senza riferimenti audio
        const startButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            'Inizia il Puzzle',
            () => {
                // Avvia la scena FlagPuzzle senza suoni
                this.scene.start('FlagPuzzle');
            }
        );

        // ...existing code (eventuali commenti utili non rimossi)...
    }
}
