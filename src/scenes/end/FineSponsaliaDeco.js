import Phaser from 'phaser';
import { createPrimaryButton } from '../../utilita/bottonepri.js';
import { GameState } from '../../stato/GameState.js';  // Add this import

export class FineSponsaliaDeco extends Phaser.Scene {
    constructor() {
        super({ key: 'FineSponsaliaDeco' });
    }

    preload() {
        // Carica l'immagine di saluto
        this.load.image('saluto', 'assets/sponsalia/esultanza-post-livello-sposa.png');
    }

    create(data) {
        // Calcola il punteggio finale sottraendo il tempo in secondi
        const timeInSeconds = Math.floor(data.time / 1000);
        const finalScore = data.score - timeInSeconds;
        
        // Aggiorna il punteggio totale in GameState (che gestirà l'update del div HTML)
        GameState.addScore(finalScore);

        // Imposta lo sfondo e fade in
        this.cameras.main.setBackgroundColor('#FFFBF5');
        this.cameras.main.fadeIn(500, 255, 251, 245);

        // Mostra l'immagine di saluto
        const salutoImage = this.add.image(this.cameras.main.centerX, this.cameras.main.height * 0.1, 'saluto')
            .setOrigin(0.5, 0);
        const scaleX = this.cameras.main.width / salutoImage.width;
        const scaleY = (this.cameras.main.height * 0.6) / salutoImage.height;
        const scale = Math.min(scaleX, scaleY);
        salutoImage.setScale(scale);

        // Mostra solo il punteggio di questo livello
        const scoreText = this.add.text(
            this.cameras.main.centerX,
            salutoImage.y + salutoImage.displayHeight + 20,
            `Punteggio livello: ${finalScore}`, {
                fontFamily: 'Poppins',
                fontSize: '28px',
                color: '#343434',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);

        // Mostra il tempo impiegato
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
            () => this.scene.start('WelcomeScreen')
        );
    }

    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}