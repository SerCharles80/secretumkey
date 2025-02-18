/*import Phaser from 'phaser';
import { WelcomeScreen } from './scenes/WelcomeScreen';
import { LivelloUno } from './scenes/Wherisacquaviva';

const gameContainer = document.getElementById('contenitore-gioco-phaser');

// Configurazione del gioco Phaser
const config = {
    type: Phaser.AUTO,
    width: gameContainer.clientWidth,
    height: gameContainer.clientHeight,
    parent: 'contenitore-gioco-phaser',
    scene: [
        WelcomeScreen,
        LivelloUno
    ]
};

// Crea una nuova istanza del gioco Phaser
export default new Phaser.Game(config);
*/

import Phaser from 'phaser';
import { WelcomeScreen } from './scenes/WelcomeScreen';
import { LivelloUno } from './scenes/Wherisacquaviva';

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
        scene: [WelcomeScreen, LivelloUno],
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
