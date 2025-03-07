import Phaser from 'phaser';
import { createPrimaryButton } from '../utilita/bottonepri.js';

export class Camminami extends Phaser.Scene {
    constructor() {
        super({ key: 'Camminami' });
        this.score = 0;
        this.startTime = 0;
        this.isPlaying = false;
        this.isPaused = false;
    }

    preload() {
        
    }   

    create() {
        this.cameras.main.setBackgroundColor('#FFFBF5');
    }

    showInstructions() {
        // Mostra istruzioni iniziali
    }

    startGame() {
        this.isPlaying = true;
        this.startTime = this.time.now;
    }

    update() {
        if (!this.isPlaying || this.isPaused) return;
        // Logica di aggiornamento del gioco
    }

    endGame() {
        this.isPlaying = false;
        const endTime = this.time.now - this.startTime;
        this.scene.start('FineCamminami', { 
            score: this.score,
            time: endTime 
        });
    }
}