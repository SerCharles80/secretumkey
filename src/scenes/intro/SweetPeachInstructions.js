import Phaser from 'phaser';
import { createPrimaryButton } from '../../utilita/bottonepri.js';

export class SweetPeachInstructions extends Phaser.Scene {
    constructor() {
        super({ key: 'SweetPeachInstructions' });
    }

    preload() {
        // Carica l'immagine delle istruzioni per SweetPeach.
        // Assicurati che il file esista nel percorso indicato.
        this.load.image('sweetInstructions', 'assets/sweetpeach/spiegazione-sweetpeach_new.png');
    }

    create() {
        // Applica il fade in
        this.cameras.main.fadeIn(500, 255, 251, 245);
        
        // Titolo
        const titleText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height * 0.1,
            'PESCHETTA\n"Sweet Peach"',
            {
                fontFamily: 'Arial',
                fontSize: '36px',
                color: '#000000',
                align: 'center',
            wordWrap: { width: this.cameras.main.width * 0.85, useAdvancedWrap: true }
            }
        ).setOrigin(0.5);
        
        this.cameras.main.setBackgroundColor('#FFFBF5');
        
        // Istruzioni: immagine posizionata al 25% dell'altezza
        const instructionsImage = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.height * 0.25,
            'sweetInstructions'
        ).setOrigin(0.5, 0);
        
        // Calcola scale in base al 50% dell'altezza disponibile
        const scaleX = this.cameras.main.width / instructionsImage.width;
        const scaleY = (this.cameras.main.height * 0.5) / instructionsImage.height;
        instructionsImage.setScale(Math.min(scaleX, scaleY));
        
        // Bottone Continua
        const continueButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + (instructionsImage.displayHeight / 2) + 30,
            'Continua',
            () => {
                console.log("Pulsante Continua premuto!");
                this.scene.start('SweetPeach');
            }
        );
        
        //Libero la cache dall'immagine delle istruzioni quando la scena viene distrutta
        this.events.once(Phaser.Scenes.Events.DESTROY, () => {
            this.textures.remove('sweetInstructions');
        });
    }
}
