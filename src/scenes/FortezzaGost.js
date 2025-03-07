import Phaser from 'phaser';
import { createPrimaryButton } from '../utilita/bottonepri.js';

export class FortezzaGost extends Phaser.Scene {
    constructor() {
        super({ key: 'FortezzaGost' });
        this.score = 0;
        this.catchCount = 0;
        this.requiredCatches = 10;
        this.ghostDuration = 500; // ms: durata di apparizione del fantasma
        this.isPlaying = false;
        this.startTime = 0;
    }

    preload() {
        // Carica le risorse del gioco
        this.load.image('rocca', 'assets/fortezzagost/rocca-cartoon-rid.png'); // immagine dello sfondo
        this.load.image('ghost', 'assets/fortezzagost/comandante.png'); // immagine del fantasma
    }

    create() {
        this.cameras.main.setBackgroundColor('#FFFBF5');

        // Aggiungi lo sfondo nella schermata iniziale
        this.bg = this.add.image(0, 0, 'rocca').setOrigin(0).setDepth(-1);
        this.bg.displayWidth = this.cameras.main.width;
        this.bg.displayHeight = this.cameras.main.height;
        
        // Imposta nuove dimensioni con padding di 20px sopra e sotto
        const panelPadding = 20;
        const basePanelHeight = 150;
        const panelHeight = basePanelHeight + panelPadding * 2;  // 150 + 40 = 190
        const panelWidth = this.cameras.main.width * 0.8;
        const panelX = (this.cameras.main.width - panelWidth) / 2;
        const panelY = (this.cameras.main.height - panelHeight) / 2.4;

        this.instructionPanel = this.add.graphics();
        this.instructionPanel.fillStyle(0xFFFFFF, 0.9);
        this.instructionPanel.lineStyle(2, 0x00AAFF);
        this.instructionPanel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);
        this.instructionPanel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);

        // Posiziona il testo al centro del pannello interno al padding
        const textY = panelY + panelPadding + (basePanelHeight / 2);
        this.instructionText = this.add.text(
            this.cameras.main.centerX,
            textY,
            "Dopo il fattaccio, il fantasma del capitano delle armi si aggira ancora nella fortezza, si dice che per farlo tornare nella tomba bisogna toccarlo 10 volte..",
            {
                fontFamily: 'Poppins',
                fontSize: '20px',
                color: '#000000',
                align: 'center',
                wordWrap: { width: panelWidth * 0.8 }
            }
        ).setOrigin(0.5);
        
        // Pulsante di avvio posizionato a 50px sotto il pannello aggiornato
        this.startButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            panelY + panelHeight + 50,
            'Inizia',
            () => this.startGame()
        );
    }

    startGame() {
        // Rimuove istruzioni e pulsante
        this.instructionPanel.destroy();
        this.instructionText.destroy();
        this.startButton.destroy();

        // Fade in veloce della scena di gioco
        this.cameras.main.fadeIn(300);

        // Inizia il timer (nascosto) e la logica di gioco
        this.startTime = this.time.now;
        this.isPlaying = true;
        this.catchCount = 0;
        this.score = 0;

        // Imposta lo sfondo: immagine della rocca adattata alla finestra
        this.bg = this.add.image(0, 0, 'rocca').setOrigin(0).setDepth(-1);
        this.bg.displayWidth = this.cameras.main.width;
        this.bg.displayHeight = this.cameras.main.height;

        // Aggiunge l'overlay scuro semi-trasparente sopra lo sfondo
        this.bgOverlay = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5)
                                  .setOrigin(0)
                                  .setDepth(0);

        // Crea il fantasma (inizialmente invisibile) e riduci la sua dimensione della metà
        this.ghost = this.add.image(0, 0, 'ghost').setOrigin(0.5).setVisible(false).setScale(0.5);
        this.ghost.setInteractive();
        this.ghost.on('pointerdown', (pointer, targets) => {
            // Ferma la propagazione per evitare il listener globale
            pointer.event.stopPropagation();
            this.ghostClicked();
        });

        // Crea la texture per l'aura se non esiste già
        if (!this.textures.exists('auraTexture')) {
            const rt = this.textures.createCanvas('auraTexture', 100, 100);
            const ctx = rt.getContext();
            const grd = ctx.createRadialGradient(50, 50, 0, 50, 50, 50);
            grd.addColorStop(0, 'rgba(255,255,255,1)'); // Centro denso
            grd.addColorStop(1, 'rgba(255,255,255,0)'); // Bordo trasparente
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, 100, 100);
            rt.refresh();
        }

        // Crea l'aura usando la texture dinamica e impostala dietro al fantasma
        this.aura = this.add.image(0, 0, 'auraTexture').setOrigin(0.5).setVisible(false).setScale(2);
        this.aura.setDepth(this.ghost.depth - 1);

        // Aggiunge il listener globale per decrementare 30 punti se si preme su un'area diversa dal fantasma
        this.input.on('pointerdown', (pointer, currentlyOver) => {
            // Se il fantasma non è stato toccato (ovvero non è fra gli oggetti sotto il cursore)
            if (!currentlyOver || !currentlyOver.includes(this.ghost)) {
                this.score = Math.max(0, this.score - 30);
            }
        });

        // Avvia evento per far spawnare il fantasma ogni 2000ms (2 secondi)
        this.ghostEvent = this.time.addEvent({
            delay: 2000,
            callback: this.spawnGhost,
            callbackScope: this,
            loop: true
        });
    }

    spawnGhost() {
        if (this.catchCount >= this.requiredCatches) return;
        // Calcola le dimensioni visualizzate del fantasma in base allo scale attuale
        const ghostWidth = this.ghost.width * this.ghost.scaleX;
        const ghostHeight = this.ghost.height * this.ghost.scaleY;
        // Genera posizioni in modo che l'intera immagine sia visibile
        const x = Phaser.Math.Between(ghostWidth / 2, this.cameras.main.width - ghostWidth / 2);
        const y = Phaser.Math.Between(ghostHeight / 2, this.cameras.main.height - ghostHeight / 2);
        this.ghost.setPosition(x, y);
        // Posiziona l'aura esattamente dietro il fantasma
        this.aura.setPosition(x, y);
        this.ghost.setAlpha(0);
        this.aura.setAlpha(0);
        this.ghost.setVisible(true);
        this.aura.setVisible(true);
        // Tween combinato per far apparire sia il fantasma che l'aura
        this.tweens.add({
            targets: [this.ghost, this.aura],
            alpha: 1,
            duration: 200,
            ease: 'Linear',
            onComplete: () => {
                this.time.delayedCall(this.ghostDuration, () => {
                    this.tweens.add({
                        targets: [this.ghost, this.aura],
                        alpha: 0,
                        duration: 200,
                        ease: 'Linear',
                        onComplete: () => {
                            this.ghost.setVisible(false);
                            this.aura.setVisible(false);
                        }
                    });
                });
            }
        });
    }

    ghostClicked() {
        if (!this.ghost.visible) return;
        this.score += 500;
        this.catchCount++;
        this.ghost.setVisible(false);
        if (this.catchCount >= this.requiredCatches) {
            this.endGame();
        }
    }

    endGame() {
        this.isPlaying = false;
        this.ghostEvent.remove(false);
        const elapsed = this.time.now - this.startTime;
        const elapsedSeconds = Math.floor(elapsed / 1000);
        const finalScore = Math.max(0, this.score - elapsedSeconds);
        // Trasmette i dati alla scena FineFortezzaGost.js
        this.scene.start('FineFortezzaGost', { score: finalScore, time: elapsed });
    }

    update() {
        if (!this.isPlaying) return;
        // Logica di aggiornamento se necessaria
    }
}