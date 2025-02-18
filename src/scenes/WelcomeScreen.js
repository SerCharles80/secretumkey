import Phaser from 'phaser';

export class WelcomeScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'WelcomeScreen' });
    }

    preload() {
        // Carica le risorse qui
    }

    create() {
        // Imposta lo sfondo
        this.cameras.main.setBackgroundColor('#FFFBF5');

        // Aggiungi il testo di benvenuto
        const welcomeText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Si parte da qui, scopriamo dove si trova Acquaviva!', {
            fontFamily: 'Poppins',
            fontSize: '32px',
            color: '#343434'
        }).setOrigin(0.5);

        // Aggiungi il testo di continuazione
        const continueText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Leggi la domanda e seleziona la risposta esatta per guadagnare punti', {
            fontFamily: 'Poppins',
            fontSize: '24px',
            color: '#343434',
            wordWrap: { width: this.cameras.main.width - 40 }
        }).setOrigin(0.5);

        // Aggiungi il pulsante di avvio
        const startButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Avvia Secretum', {
            fontFamily: 'Poppins',
            fontSize: '32px',
            color: '#fff',
            backgroundColor: '#00AAFF',
            padding: {
                left: 20,
                right: 20,
                top: 10,
                bottom: 10
            },
            borderRadius: 15,
            border: '2px solid #343434',
        }).setOrigin(0.5).setInteractive();

        // Gestisci il clic sul pulsante di avvio
        startButton.on('pointerdown', () => {
            this.scene.start('LivelloUno');
        });
    }
}
