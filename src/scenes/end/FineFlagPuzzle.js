import Phaser from 'phaser';
import { createPrimaryButton } from '../../utilita/bottonepri.js';
import { GameState } from '../../stato/GameState.js';

export class FineFlagPuzzle extends Phaser.Scene {
    constructor() {
        super({ key: 'FineFlagPuzzle' });
    }

    preload() {
        this.load.image('salutoFlag', 'assets/flagpuzzle/esultanza-post-puzzle.png');
    }

    create(data) {
        // Aggiorna il punteggio totale in GameState (gestirà l'update del div HTML)
        GameState.addScore(data.score);

        // Imposta lo sfondo
        this.cameras.main.setBackgroundColor('#FFFBF5');
        this.cameras.main.fadeIn(500, 255, 251, 245);

        // Immagine di saluto
        const salutoImage = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.height * 0.1,
            'salutoFlag'
        ).setOrigin(0.5, 0);

        // Scala l'immagine
        const scaleX = this.cameras.main.width / salutoImage.width;
        const scaleY = (this.cameras.main.height * 0.6) / salutoImage.height;
        const scale = Math.min(scaleX, scaleY);
        salutoImage.setScale(scale);

        // Mostra il punteggio del livello
        const scoreText = this.add.text(
            this.cameras.main.centerX,
            salutoImage.y + salutoImage.displayHeight + 20,
            `Punteggio livello: ${data.score}`, {
                fontFamily: 'Poppins',
                fontSize: '28px',
                color: '#343434',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);

        // Mostra il tempo di gioco
        const timeText = this.add.text(
            this.cameras.main.centerX,
            scoreText.y + 40,
            `Tempo di gioco: ${this.formatTime(data.time)}`, {
                fontFamily: 'Poppins',
                fontSize: '24px',
                color: '#343434',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);

        // Pulsante per proseguire
        const continueButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            timeText.y + 60,
            'Prossimo Livello',
            () => this.scene.start('NextLevel')
        );
    }

    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}