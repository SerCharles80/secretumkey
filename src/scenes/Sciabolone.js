import Phaser from 'phaser';
import { createPrimaryButton } from '../utilita/bottonepri.js';

export class Sciabolone extends Phaser.Scene {
    constructor() {
        super({ key: 'Sciabolone' });
        this.score = 0;
        // Queste proprietà verranno usate per gestire i round
        this.currentRound = 1;
        this.totalTime = 0;
        this.requiredRounds = 3;
        this.eliminatedCount = 0;
        // La durata dell'effetto fade per il soldato
        this.fadeDuration = 200;

        // Aggiungi l'array dei titoli di incoraggiamento
        this.levelTitles = [
            "Elimina i soldati francesi!",
            "So che puoi farcela!",
            "Proprio cosi, continua!",
            "Sbucano ovunque... Speriamo siano gli ultimi!!!"
        ];
        this.levelTitleText = null;
    }

    preload() {
        // Carica le risorse del gioco
        this.load.image('roccaSciabolone', 'assets/sciabolone/sfondo-rocca-sciabolone-rid.png'); // immagine dello sfondo
        // Immagine del "soldato napoleonico" (o sciabola se necessario)
        this.load.image('soldato', 'assets/sciabolone/soldato-napoleonico.png');
        this.load.image('soldatoCut', 'assets/sciabolone/soldato-napoleonico-tagliato.png');
        this.load.image('sciabolaSinistra', 'assets/sciabolone/sciabola.png');
        this.load.image('sciabolaDestra', 'assets/sciabolone/sciabola2.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('#FFFBF5');

        // Aggiungi lo sfondo nella schermata iniziale
        this.bg = this.add.image(0, 0, 'roccaSciabolone').setOrigin(0).setDepth(-1);
        this.bg.displayWidth = this.cameras.main.width;
        this.bg.displayHeight = this.cameras.main.height;
        
        // Imposta il pannello istruzionale (rimane invariato)
        const panelPadding = 20;
        const basePanelHeight = 200;
        const panelHeight = basePanelHeight + panelPadding * 2;
        const panelWidth = this.cameras.main.width * 0.8;
        const panelX = (this.cameras.main.width - panelWidth) / 2;
        const panelY = (this.cameras.main.height - panelHeight) / 2.4;

        this.instructionPanel = this.add.graphics();
        this.instructionPanel.fillStyle(0xFFFFFF, 0.9);
        this.instructionPanel.lineStyle(2, 0x00AAFF);
        this.instructionPanel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);
        this.instructionPanel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);

        const textY = panelY + panelPadding + (basePanelHeight / 2);
        this.instructionText = this.add.text(
            this.cameras.main.centerX,
            textY,
            "L'esercito francese è rintanato nella fortezza. Il coraggioso Giuseppe Costantini, detto Sciabolone, è l'unico capace di sconfiggerli.\n Aiutalo ad eliminarli.",
            {
                fontFamily: 'Poppins',
                fontSize: '18px',
                color: '#000000',
                align: 'center',
                wordWrap: { width: panelWidth - (panelPadding * 2) }
            }
        ).setOrigin(0.5);
        
        this.startButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            panelY + panelHeight + 50,
            'Inizia',
            () => this.startGame()
        );

        // Libera la cache delle immagini quando la scena viene distrutta
        this.events.once(Phaser.Scenes.Events.DESTROY, () => {
            [
                'roccaSciabolone',
                'soldato',
                'soldatoCut',
                'sciabolaSinistra',
                'sciabolaDestra'
            ].forEach(key => this.textures.remove(key));
        });
    }

    startGame() {
        // Distruggi il pannello istruzioni e il pulsante iniziale
        this.instructionPanel.destroy();
        this.instructionText.destroy();
        this.startButton.destroy();

        // Fade in veloce della scena di gioco
        this.cameras.main.fadeIn(300);
        
        // Inizializza i dati per il gioco
        this.currentRound = 1;  // Livello corrente (da 1 a 5)
        this.totalTime = 0;
        this.score = 0;
        // Avvia il primo livello
        this.spawnSoldiers();
    }

    spawnSoldiers() {
        this.roundStartTime = this.time.now;
        
        // Rimuovi il titolo precedente se esiste
        if (this.levelTitleText) {
            this.levelTitleText.destroy();
        }

        // Aggiungi il nuovo titolo per il livello corrente
        this.levelTitleText = this.add.text(
            this.cameras.main.centerX,
            30,
            this.levelTitles[this.currentRound - 1],
            {
                fontFamily: 'Poppins',
                fontSize: '20px',
                color: '#FFFFFF', // Cambiato da '#000000' a '#FFFFFF' per il colore bianco
                align: 'center',
                wordWrap: { width: this.cameras.main.width * 0.8 }
            }
        ).setOrigin(0.5);

        this.eliminatedCount = 0;
        this.soldiers = [];
        const soldierCount = 2 * this.currentRound + 4;
        this.soldierCount = soldierCount;

        for (let i = 0; i < soldierCount; i++) {
            const soldierWidth = this.textures.getFrame('soldato').width * 0.5;
            const soldierHeight = this.textures.getFrame('soldato').height * 0.5;
            // Posizione senza sovrapposizione
            let x, y, posFound = false, attempts = 0;
            while (!posFound && attempts < 100) {
                attempts++;
                x = Phaser.Math.Between(soldierWidth / 2, this.cameras.main.width - soldierWidth / 2);
                const minY = Math.max(soldierHeight / 2, this.cameras.main.height * 0.25);
                const maxY = this.cameras.main.height - soldierHeight / 2;
                y = Phaser.Math.Between(minY, maxY);
                posFound = true;
                for (let j = 0; j < this.soldiers.length; j++) {
                    const existing = this.soldiers[j];
                    const distance = Phaser.Math.Distance.Between(x, y, existing.x, existing.y);
                    if (distance < soldierWidth * 0.8) {
                        posFound = false;
                        break;
                    }
                }
            }
            
            const randomScale = Phaser.Math.FloatBetween(0.4, 0.7);
            const soldier = this.add.image(x, y, 'soldato')
                .setOrigin(0.5)
                .setScale(randomScale)
                .setAlpha(0);
            soldier.setInteractive();
            soldier.on('pointerdown', (pointer) => {
                pointer.event.stopPropagation();
                if (this.isAnimating) return;
                this.eliminateSoldier(soldier);
            });
            this.soldiers.push(soldier);
            this.tweens.add({
                targets: soldier,
                alpha: 1,
                duration: this.fadeDuration,
                ease: 'Linear'
            });
        }
    }

    eliminateSoldier(soldier) {
        if (!soldier.visible) return;
        // Blocca ulteriori clic se già in animazione
        if (this.isAnimating) return;
        this.isAnimating = true;
    
        soldier.setTexture('soldatoCut');

        // Scegli l'immagine della sciabola casualmente
        const useLeft = Math.random() < 0.5;
        const offset = 50;
        let sciabola, endX;
        if (useLeft) {
            // SciabolaSinistra: scorre da sinistra verso destra con inclinazione -45°
            sciabola = this.add.image(soldier.x - soldier.displayWidth / 2 - offset, soldier.y, 'sciabolaSinistra')
                .setOrigin(0.5).setScale(0.5).setAlpha(1).setAngle(-45);
            endX = soldier.x + soldier.displayWidth / 2 + offset;
        } else {
            // SciabolaDestra: scorre da destra verso sinistra con inclinazione 45°
            sciabola = this.add.image(soldier.x + soldier.displayWidth / 2 + offset, soldier.y, 'sciabolaDestra')
                .setOrigin(0.5).setScale(0.5).setAlpha(1).setAngle(45);
            endX = soldier.x - soldier.displayWidth / 2 - offset;
        }

        this.tweens.add({
            targets: sciabola,
            x: endX,
            duration: 300,
            ease: 'Linear',
            onComplete: () => {
                sciabola.destroy();
                // Attendi 100ms prima di far svanire il soldato
                this.time.delayedCall(100, () => {
                    this.tweens.add({
                        targets: soldier,
                        alpha: 0,
                        duration: this.fadeDuration,
                        ease: 'Linear',
                        onComplete: () => {
                            this.score += 115;
                            soldier.destroy();
                            this.eliminatedCount++;
                            // Consenti nuovamente selezioni
                            this.isAnimating = false;
                            if (this.eliminatedCount >= this.soldierCount) {
                                this.endRound();
                            }
                        }
                    });
                });
            }
        });
    }

    endRound() {
        // Accumula il tempo del livello
        this.totalTime += this.time.now - this.roundStartTime;
        console.log(`Livello ${this.currentRound} completato. TotalTime: ${this.totalTime}ms`);
        // Se il livello corrente è minore di 5, passa al livello successivo, altrimenti termina il gioco
        if (this.currentRound < 4) {
            this.currentRound++;
            console.log(`Avvio il livello ${this.currentRound}`);
            this.time.delayedCall(500, () => {
                this.spawnSoldiers();
            });
        } else {
            console.log("Termino del gioco: avvio FineSciabolone");
            this.endGame();
        }
    }

    endGame() {
        // Calcola il tempo in secondi e sottrai al punteggio totale
        const elapsedSeconds = Math.floor(this.totalTime / 1000);
        const finalScore = Math.max(0, this.score - elapsedSeconds);
        // Trasmette punteggio e tempo alla scena FineSciabolone.js
        this.scene.start('FineSciabolone', { score: finalScore, time: this.totalTime });
    }

    update() {
        // Logica di aggiornamento se necessaria
    }
}