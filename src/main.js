import Phaser from 'phaser';
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
