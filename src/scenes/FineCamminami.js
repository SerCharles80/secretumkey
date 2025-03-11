import Phaser from 'phaser';
import { createPrimaryButton } from '../utiluta/bottonepri.js';
import { GameState } from '../stato/GameState.js';

export class FineCamminami extends Phaser.Scene {
    constructor() {
        super({ key: 'FineCamminami' });
    }

    preload() {
        // Carica l'immagine di saluto finale senza suoni
        this.load.image('salutoCamminami', 'assets/camminami/esultanza-camminami.png');
    }

    create(data) {
        // Calcola il tempo trascorso e il punteggio finale
        const timeInSeconds = Math.floor(data.time / 1000);
        const finalScore = data.score - timeInSeconds;

        GameState.addScore(finalScore);

        this.cameras.main.setBackgroundColor('#FFFBF5');
        this.cameras.main.fadeIn(500, 255, 251, 245);

        // Mostra l'immagine di saluto centrata
        const salutoImage = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.height * 0.1,
            'salutoCamminami'
        ).setOrigin(0.5, 0);
        const scaleX = this.cameras.main.width / salutoImage.width;
        const scaleY = (this.cameras.main.height * 0.6) / salutoImage.height;
        salutoImage.setScale(Math.min(scaleX, scaleY));

        // Mostra il punteggio del livello
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

        // Mostra il tempo di gioco formattato
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

        // Pulsante per passare al livello successivo (o alla schermata intro)
        const continueButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            timeText.y + 60,
            'Prossimo Livello',
            () => this.scene.start('SponsaliaDecoIntro')
        );
    }

    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}
