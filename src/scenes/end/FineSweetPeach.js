import Phaser from 'phaser';
import { createPrimaryButton } from '../../utilita/bottonepri.js';

export class FineSweetPeach extends Phaser.Scene {
    constructor() {
        super({ key: 'FineSweetPeach' });
    }

    preload() {
        // Carica l'immagine di saluto
        this.load.image('saluto', 'assets/sweetpeach/schermata-finale-sweetpeach.png');
    }

    create(data) {
        // Imposta lo sfondo
        this.cameras.main.setBackgroundColor('#FFFBF5');

        // Applica l'effetto di fade in
        this.cameras.main.fadeIn(500, 255, 251, 245);

        // Aggiungi l'immagine di saluto e adatta allo schermo
        const salutoImage = this.add.image(this.cameras.main.centerX, this.cameras.main.height * 0.1, 'saluto').setOrigin(0.5, 0);
        const scaleX = this.cameras.main.width / salutoImage.width;
        const scaleY = (this.cameras.main.height * 0.6) / salutoImage.height; // Adatta l'altezza al 30% della scena
        const scale = Math.min(scaleX, scaleY);
        salutoImage.setScale(scale);

        // Mostra il punteggio ottenuto
        const scoreText = this.add.text(this.cameras.main.centerX, salutoImage.y + salutoImage.displayHeight + 20, `Punteggio: ${data.score}`, {
            fontFamily: 'Poppins',
            fontSize: '28px',
            color: '#343434',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Mostra il tempo impiegato
        const timeText = this.add.text(this.cameras.main.centerX, scoreText.y + 40, `Tempo: ${this.formatTime(data.time)}`, {
            fontFamily: 'Poppins',
            fontSize: '28px',
            color: '#343434',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Aggiungi il pulsante per proseguire al prossimo livello
        const continueButton = createPrimaryButton(this, this.cameras.main.centerX, timeText.y + 60, 'Prossimo Livello', () => {
            console.log("Pulsante Prossimo Livello premuto!");
            this.scene.start('prossimolivello'); // Sostituisci 'NextLevel' con la scena del prossimo livello
        });
    }

    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}