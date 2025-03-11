import Phaser from 'phaser';
import { createPrimaryButton } from '../utilita/bottonepri.js';

export class CamminamiIntro extends Phaser.Scene {
    constructor() {
        super({ key: 'CamminamiIntro' });
    }

    preload() {
        // ...existing preload code (carica asset necessari per l'intro)...
    }

    create() {
        // Imposta lo sfondo e applica il fade in senza riferimenti audio
        this.cameras.main.setBackgroundColor('#FFFBF5');
        this.cameras.main.fadeIn(500, 255, 251, 245);

        // Mostra il titolo e le istruzioni base per l'intro
        const titleText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height * 0.15,
            'Camminami - Introduzione',
            {
                fontFamily: 'Poppins',
                fontSize: '32px',
                color: '#000000',
                align: 'center'
            }
        ).setOrigin(0.5);

        // ...existing code per immagini o ulteriori istruzioni...

        // Crea il pulsante di avvio senza suoni
        const startButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            'Inizia il Livello',
            () => {
                this.scene.start('Camminami');
            }
        );
    }
}
