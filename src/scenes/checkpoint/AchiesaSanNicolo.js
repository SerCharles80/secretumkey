import Phaser from 'phaser';
import { createPrimaryButton } from '../../utilita/bottonepri.js';
import { processQRCode } from './ZelencoLink.js';

export class AchiesaSanNicolo extends Phaser.Scene {
    constructor() {
        super({ key: 'AchiesaSanNicolo' });
        this.qrScanned = false;
    }

    preload() {
        this.load.image('mappaQR', 'assets/checkpoint/cartina-punti-gioco.png');
    }

    create() {
        // Aggiungi fade in
        this.cameras.main.fadeIn(300);
        this.cameras.main.setBackgroundColor('#FFFBF5');

        // Aggiungi la mappa dei QR code
        const mapWidth = this.cameras.main.width * 0.9; // 90% della larghezza dello schermo
        const map = this.add.image(
            this.cameras.main.centerX,
            50, // Posizione Y dall'alto
            'mappaQR'
        ).setOrigin(0.5, 0);

        // Scala l'immagine mantenendo le proporzioni
        const scale = mapWidth / map.width;
        map.setScale(scale);

        // Crea il pannello informativo
        const panelWidth = this.cameras.main.width * 0.8;
        const panelHeight = 200;
        const panelX = (this.cameras.main.width - panelWidth) / 2;
        // Sposta il pannello sotto la mappa
        const panelY = map.y + map.displayHeight + 20;

        // Background del pannello
        const panel = this.add.graphics();
        panel.fillStyle(0xFFFFFF, 0.9);
        panel.lineStyle(2, 0x00AAFF);
        panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);
        panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);

        // Aggiorna il posizionamento del testo per rimanere nel pannello
        const text = this.add.text(
            panelX + panelWidth / 2, // Centra orizzontalmente nel pannello
            panelY + panelHeight / 2, // Centra verticalmente nel pannello
            'Per proseguire, trova e scansiona\n uno dei QR di gioco nei punti di interesse',
            {
                fontFamily: 'Poppins',
                fontSize: '22px',
                color: '#000000',
                align: 'center',
                lineSpacing: 10,
                wordWrap: { width: panelWidth - 60 }, // Ridotto per dare più margine
                padding: { x: 20, y: 20 } // Aggiunge padding interno
            }
        ).setOrigin(0.5);
        this.instructionsOriginalText = text.text;

        // Modifica la funzione del pulsante scanner
        const scanButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            panelY + panelHeight + 40,
            'Avvia Scanner',
            () => {
                if (typeof window.startQRScanner === 'function') {
                    // Pause the game before hiding it
                    this.game.pause();
                    // Hide the canvas to prevent rendering issues
                    const canvas = this.game.canvas;
                    canvas.style.display = 'none';
                    
                    window.startQRScanner();
                    
                    // Add handler for when QR scanning is done
                    window.onQRScanComplete = () => {
                        canvas.style.display = 'block';
                        this.game.resume();
                        this.tweens.add({
                            targets: [map, panel, text, scanButton],
                            alpha: 1,
                            duration: 300
                        });
                    };
                } else {
                    console.error('Scanner QR non disponibile');
                }
            }
        );

        // Modifica del listener per la scansione del QR code
        window.handleQRCode = (qrData) => {
            console.log('QR Code scanned:', qrData); // Debug log
            const result = processQRCode(qrData);
            if (result === "ok") {
                this.qrScanned = true;
                if (window.onQRScanComplete) window.onQRScanComplete();
                this.time.delayedCall(100, () => { this.proceedToNextScene(); });
            } else if (result === "alreadyScanned") {
                if (window.onQRScanComplete) window.onQRScanComplete();
                text.setText("Eih, il codice è stato già usato! Trova un nuovo QR code in un altro punto d'interesse.");
                panel.clear();
                panel.fillStyle(0xFFFFFF, 0.9);
                panel.lineStyle(2, 0xFF0000); // Imposta bordo rosso
                panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);
                panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);
                this.time.delayedCall(5000, () => { this.scene.restart(); });
            } else if (result === "invalid") {
                if (window.onQRScanComplete) window.onQRScanComplete();
                text.setText("Ooops! questo codice non fa parte di Secretum.");
                panel.clear();
                panel.fillStyle(0xFFFFFF, 0.9);
                panel.lineStyle(2, 0xFF0000); // Imposta bordo rosso
                panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);
                panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);
                this.time.delayedCall(5000, () => { this.scene.restart(); });
            } else if (result === "codiceIniziale") {
                if (window.onQRScanComplete) window.onQRScanComplete();
                text.setText("Questo è il codice iniziale, trova un codice di sblocco del gioco per proseguire!");
                panel.clear();
                panel.fillStyle(0xFFFFFF, 0.9);
                panel.lineStyle(2, 0xFF0000); // Imposta bordo rosso
                panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);
                panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);
                this.time.delayedCall(5000, () => { this.scene.restart(); });
            }
        };

        // Cleanup del listener quando la scena viene chiusa
        this.events.on('shutdown', () => {
            delete window.handleQRCode;
            delete window.onQRScanComplete;
        });
    }

    proceedToNextScene() {
        // Effetto fade out
        this.cameras.main.fadeOut(500);
        
        // Attendi il completamento del fade prima di cambiare scena
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('WelcomeScreen'); // Cambia con la scena successiva
        });
    }
}
