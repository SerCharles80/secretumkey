import Phaser from 'phaser';
import { createPrimaryButton } from '../../utilita/bottonepri.js';
import { GameState } from '../../stato/GameState.js';

export class FineDecoPuzzle extends Phaser.Scene {
    constructor() {
        super({ key: 'FineDecoPuzzle' });
    }

    preload() {
        // Carica l'immagine di saluto, senza riferimenti a suoni
        this.load.image('salutoDeco', 'assets/decopuzzle/finale-deco-puzzle.png');
    }

    create(data) {
        const timeInSeconds = Math.floor(data.time / 1000);
        const finalScore = data.score - timeInSeconds;
        
        GameState.addScore(finalScore);
        
        this.cameras.main.setBackgroundColor('#FFFBF5');
        this.cameras.main.fadeIn(500, 255, 251, 245);

        const salutoImage = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.height * 0.1,
            'salutoDeco'
        ).setOrigin(0.5, 0);
        const scaleX = this.cameras.main.width / salutoImage.width;
        const scaleY = (this.cameras.main.height * 0.6) / salutoImage.height;
        salutoImage.setScale(Math.min(scaleX, scaleY));
                
        const scoreText = this.add.text(
            this.cameras.main.centerX,
            salutoImage.y + salutoImage.displayHeight + 20,
            `Punteggio livello: ${finalScore}`,
            {
                fontFamily: 'Poppins',
                fontSize: '28px',
                color: '#343434',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);

        const timeText = this.add.text(
            this.cameras.main.centerX, 
            scoreText.y + 40,
            `Tempo di gioco: ${this.formatTime(data.time)}`,
            {
                fontFamily: 'Poppins',
                fontSize: '24px',
                color: '#343434',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);

        const continueButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            timeText.y + 60,
            'Prossimo Livello',
            () => this.scene.start('DecoPuzzleIntro')
        );
    }

    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}