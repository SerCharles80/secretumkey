import Phaser from 'phaser';
import { createPrimaryButton } from '../utilita/bottonepri.js';

export class DecoPuzzleIntro extends Phaser.Scene {
    constructor() {
        super({ key: 'DecoPuzzleIntro' });
    }

    preload() {
        // ...existing preload code (carica immagini e asset necessari)...
    }

    create() {
        // Imposta lo sfondo e applica il fade in senza riferimenti a suoni
        this.cameras.main.setBackgroundColor('#FFFBF5');
        this.cameras.main.fadeIn(500, 255, 251, 245);

        // Mostra titolo e istruzioni
        const titleText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height * 0.15,
            'Deco Puzzle Intro',
            {
                fontFamily: 'Poppins',
                fontSize: '32px',
                color: '#000000',
                align: 'center'
            }
        ).setOrigin(0.5);

        // ...existing code per eventuali immagini o descrizioni...

        // Pulsante per avviare il livello DecoPuzzle
        const startButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            'Inizia il Puzzle',
            () => {
                this.scene.start('DecoPuzzle');
            }
        );
    }
}
