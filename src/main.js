import Phaser from 'phaser';
import { WelcomeScreen } from './scenes/intro/WelcomeScreen';
import { WherisAcquaviva } from './scenes/WherisAcquaviva';
import { FineWerisAcquaviva } from './scenes/end/FineWerisAcquaviva';
import { SweetPeachInstructions } from './scenes/intro/SweetPeachInstructions';
import { SweetPeach } from './scenes/SweetPeach';
import { FineSweetPeach } from './scenes/end/FineSweetPeach';
import { FlagPuzzleIntro } from './scenes/intro/FlagPuzzleIntro';
import FlagPuzzle from './scenes/FlagPuzzle.js';
import { FineFlagPuzzle } from './scenes/end/FineFlagPuzzle';

window.onload = function () {
    const gameContainer = document.getElementById('contenitore-gioco-phaser');

    if (!gameContainer) {
        console.error("Errore: Il container del gioco non è stato trovato.");
        return;
    }

    console.log("Avvio del gioco Phaser...");

    const config = {
        type: Phaser.AUTO,
        parent: 'contenitore-gioco-phaser',
        backgroundColor: '#FFFBF5', // Imposta il colore di sfondo globale qui
        scene: [
            WelcomeScreen, 
            WherisAcquaviva,
            FineWerisAcquaviva,
            SweetPeachInstructions,
            SweetPeach,
            FineSweetPeach,
            FlagPuzzleIntro,
            FlagPuzzle,
            FineFlagPuzzle
        ],
        audio: {
            noAudio: true  // Disabilita l'AudioContext
        },
        scale: {
            mode: Phaser.Scale.RESIZE, // Adatta il gioco al div
            autoCenter: Phaser.Scale.CENTER_BOTH // Centra il gioco
        }
    };

    const game = new Phaser.Game(config);

    // Debug: Controlla se il gioco è stato inizializzato
    game.events.on('ready', () => {
        console.log("Gioco avviato con successo!");
    });

    // Debug: Verifica se il gioco non parte
    game.events.on('shutdown', () => {
        console.error("Il gioco è stato chiuso inaspettatamente!");
    });
};
