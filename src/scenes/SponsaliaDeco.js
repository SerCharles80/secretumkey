import Phaser from 'phaser';
// import { createPrimaryButton } from '../../utilita/bottonepri.js';

export class SponsaliaDeco extends Phaser.Scene {
    constructor() {
        super({ key: 'SponsaliaDeco' });
        
        // Inizializza le variabili di stato
        this.score = 0;
        this.startTime = 0;
        this.isPaused = false;
    }

    preload() {
        
    }

    create() {
        // Imposta lo sfondo
        this.cameras.main.setBackgroundColor('#FFFBF5');
        
    }

    update() {
        // Logica di aggiornamento del gioco
    }
}