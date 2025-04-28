import Phaser from 'phaser';
import { createPrimaryButton } from '../utilita/bottonepri.js';

export class FinaleSecretum extends Phaser.Scene {
    constructor() {
        super({ key: 'FinaleSecretum' });
        this.creditsShown = false; // Inizializza la variabile nel constructor
    }

    preload() {
        this.load.video('finalVideo', 'assets/video-finale.mp4', 'loadeddata', false, true);
        this.load.image('sfondoFinale', 'assets/sfondo-finale.png');
    }

    create() {
        this.creditsShown = false;
        this.cameras.main.fadeIn(500, 0, 0, 0);
        
        // Crea e configura il video
        const video = this.add.video(this.cameras.main.centerX, this.cameras.main.centerY, 'finalVideo');
        
        // Imposta il video a pieno schermo
        video.setDisplaySize(this.cameras.main.width * 0.36, this.cameras.main.height * 0.2);
        video.setOrigin(0.5);
        
        // Riproduci il video una volta sola
        video.play(false);

        // Gestisci entrambi gli eventi di completamento per assicurare la transizione
        video.on('complete', this.handleVideoComplete, this);
        video.on('ended', this.handleVideoComplete, this);
    }

    handleVideoComplete() {
        // Fade out al bianco
        this.cameras.main.fadeOut(1000, 255, 255, 255);
        
        // Assicurati che showCredits venga chiamato solo una volta
        if (!this.creditsShown) {
            this.creditsShown = true;
            this.time.delayedCall(1200, () => {
                // Fade in per i crediti
                this.cameras.main.fadeIn(1000);
                this.showCredits();
            });
        }
    }

    showCredits() {
        // Aggiungi lo sfondo prima del pannello
        const bg = this.add.image(0, 0, 'sfondoFinale')
            .setOrigin(0)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Crea il pannello dei crediti (70% dell'altezza dello schermo)
        const panelWidth = this.cameras.main.width * 0.9;
        const panelHeight = this.cameras.main.height * 0.7;
        const panelX = (this.cameras.main.width - panelWidth) / 2;
        const panelY = (this.cameras.main.height - panelHeight) / 2;

        // Disegna il pannello con bordi arrotondati
        const panel = this.add.graphics();
        panel.fillStyle(0xFFFFFF, 0.9);
        panel.lineStyle(2, 0x00AAFF);
        panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);
        panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);

        // Crea la maschera per il testo scorrevole
        const maskShape = this.make.graphics({});
        maskShape.fillRect(panelX, panelY, panelWidth, panelHeight);
        const mask = maskShape.createGeometryMask();

        // Testo dei crediti
        const creditsText = 
            "SECRETUM\n" +
            "Key of Acquaviva\n\n" +
            "Un progetto di:\n" +
            "Comune di Acquaviva Picena\n" +
            "Emanuele Luciani\n\n" +
            "Crediti:\n\n" +
            "Sviluppo Gioco\n" +
            "Team Secretum\n\n" +
            "Game Design\n" +
            "Carlo Carlini\n\n" +
            "Grafica e illustrazioni\n" +
            "Alessandro Ricci\n\n" +
            "Programmazione\n" +
            "Carlini Carlo\n\n" +
            "Testing\n" +
            "Team Secretum\n\n" +
            "Ringraziamenti Speciali\n" +
            "Comune di Acquaviva Picena\n" +
            "Pro Loco Acquaviva\n" +
            "Museo della Fortezza\n" +
            "Cittadini di Acquaviva\n\n" +
            "© 2025 Tutti i diritti riservati";

        // Aggiungi il testo scorrevole con padding laterale
        const credits = this.add.text(
            panelX + panelWidth / 2,
            panelY + panelHeight,
            creditsText,
            {
                fontFamily: 'Poppins',
                fontSize: '22px',
                color: '#000000',
                align: 'center',
                lineSpacing: 10,
                padding: { x: 10, y: 0 }  // Aggiunge 10px di padding laterale
            }
        ).setOrigin(0.5, 0);

        credits.setMask(mask);

        // Animazione scroll verso l'alto
        this.tweens.add({
            targets: credits,
            y: panelY - credits.height,
            duration: 20000,
            ease: 'Linear',
            onComplete: () => {
                // Aggiungi il messaggio finale al centro del pannello
                const messageWidth = this.cameras.main.width * 0.8; // 80% della larghezza dello schermo
                const finalMessage = this.add.text(
                    panelX + panelWidth / 2,
                    panelY + panelHeight / 2,
                    "Grazie per aver giocato a\nSecretum Key of Acquaviva",
                    {
                        fontFamily: 'Poppins',
                        fontSize: '26px',
                        color: '#000000',
                        align: 'center',
                        lineSpacing: 10,
                        padding: { x: 10, y: 0 },
                        wordWrap: { width: messageWidth } // Imposta la larghezza massima del testo
                    }
                ).setOrigin(0.5);
                finalMessage.setMask(mask);
            }
        });

        // Pulsante "Rivedi Finale"
        createPrimaryButton(
            this,
            this.cameras.main.centerX,
            panelY + panelHeight + 40,
            'Rivedi Finale',
            () => { this.scene.restart(); }
        );
    }
}
