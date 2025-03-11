import Phaser from 'phaser';
import { createPrimaryButton } from '../utilita/bottonepri.js';

export class IcomuneIntro extends Phaser.Scene {
    constructor() {
        super({ key: 'IcomuneIntro' });
    }

    preload() {
        // ...existing preload code (carica immagini e asset necessari)...
    }

    create() {
        // Imposta sfondo e applica fade in senza riferimenti audio
        this.cameras.main.setBackgroundColor('#FFFBF5');
        this.cameras.main.fadeIn(500, 255, 251, 245);

        // Mostra titolo e eventuali istruzioni introduttive
        const titleText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height * 0.15,
            'Icomune - Introduzione',
            {
                fontFamily: 'Poppins',
                fontSize: '32px',
                color: '#000000',
                align: 'center'
            }
        ).setOrigin(0.5);

        // ...existing code per eventuali immagini o descrizioni...

        // Bottone per avviare il livello Icomune (senza suoni)
        const startButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            'Inizia il Livello',
            () => {
                this.scene.start('Icomune');
            }
        );

        // ...existing code (commenti utili non rimossi)...
    }
}
