import Phaser from 'phaser';
import { createPrimaryButton } from '../utilita/bottonepri.js';

export class Camminami extends Phaser.Scene {
    constructor() {
        super({ key: 'Camminami' });
        this.score = 400; // Punteggio iniziale
        this.baseTime = 15000; // 15 secondi in millisecondi
        this.currentSpeed = this.baseTime / 6; // Tempo per ogni segmento
        this.isPaused = false;
        this.totalTime = 0;
        this.segmentStartTime = 0;
        this.currentSegment = 0;  // Inizializza currentSegment a 0
        
        // Definizione dei checkpoint e delle relative domande
        this.checkpoints = [
            {
                x: 0.1, y: 0.2,
                question: "Chi era s. Agostino?",
                answers: ["Filosofo", "Vescovo", "Teologo", "Santo", "Tutte le precedenti"],
                correct: 4,
                icon: 'checkpoint1-img' // Immagine associata al checkpoint
            },
            {
                x: 0.3, y: 0.4,
                question: "E’ stato lui a fondare l’ordine degli agostiniani?",
                answers: ["No", "Si", "Non ho capito"],
                correct: 0,
                image: 'checkpoint2-img' // Immagine associata al checkpoint
            },
            {
                x: 0.5, y: 0.3,
                question: "Dove nascono gli Agostiniani Scalzi?",
                answers: ["Milano", "Trento", "Ancona", "Venezia", "Napoli"],
                correct: 4,
                image: 'checkpoint3-img' // Immagine associata al checkpoint
            },
            {
                x: 0.7, y: 0.6,
                question: "Quando nascono gli agostiniani Scalzi?",
                answers: ["493", "993", "1593", "1693", "1993"],
                correct: 2,
                image: 'checkpoint4-img' // Immagine associata al checkpoint
            },
            {
                x: 0.9, y: 0.2,
                question: "Quando arrivano ad Acquaviva Picena?",
                answers: ["1512", "1612", "1712","112"],
                correct: 1,
                image: 'checkpoint5-img' // Immagine associata al checkpoint
            },
            {
                x: 0.5, y: 0.8,
                question: "Come si chiama la chiesa da loro fondata?",
                answers: ["S.Rocco", "S.Lorenzo", "S.Niccolò", "S.Agostino"],
                correct: 1,
                image: 'checkpoint6-img' // Immagine associata al checkpoint
            }
        ];

        this.path = null;
        this.walker = null;
        this.graphics = null;
    }

    preload() {
        this.load.image('frate', 'assets/camminami/frate-cammina.png');
        this.load.image('flag-start', 'assets/camminami/bandiera-partenza.png');
        this.load.image('flag-end', 'assets/camminami/bandiera-finish.png');
        this.load.image('checkpoint', 'assets/camminami/checkpoint.png');
        
        // Carica le immagini dei checkpoint
        this.load.image('checkpoint1-img', 'assets/camminami/checkpoint-1.png');
        this.load.image('checkpoint2-img', 'assets/camminami/checkpoint-2.png');
        this.load.image('checkpoint3-img', 'assets/camminami/checkpoint-3.png');
        this.load.image('checkpoint4-img', 'assets/camminami/checkpoint-4.png');
        this.load.image('checkpoint5-img', 'assets/camminami/checkpoint-5.png');
        this.load.image('checkpoint6-img', 'assets/camminami/checkpoint-6.png');
        // ...carica altre immagini dei checkpoint
        this.load.image('bg', 'assets/camminami/sfondo-cammino_v2-rid.png'); // Carica l'immagine di sfondo
    }

    create() {
        // Adatta l'immagine di sfondo alle dimensioni della finestra
        const bg = this.add.image(0, 0, 'bg').setOrigin(0).setDepth(-1);
        bg.displayWidth = this.cameras.main.width;
        bg.displayHeight = this.cameras.main.height;
        // Mostra il pannello introduttivo
        this.showIntroPanel();
    }

    showIntroPanel() {
        const panelWidth = this.cameras.main.width * 0.8;
        const panelHeight = 150;
        // Centriamo verticalmente il pannello istruzioni
        const panelX = (this.cameras.main.width - panelWidth) / 2;
        const panelY = (this.cameras.main.height - panelHeight) / 2.3; // Modificato da 50 a centrare verticalmente

        // Crea il pannello con sfondo semi-trasparente
        const panel = this.add.graphics();
        panel.fillStyle(0xFFFFFF, 0.9);
        panel.lineStyle(2, 0x00AAFF);
        panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);
        panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);

        // Aggiungi il testo delle istruzioni al centro del pannello
        const text = this.add.text(
            this.cameras.main.centerX,
            panelY + panelHeight / 2,
            "Aiuta Padre Agostino, selezionando le risposte esatte il suo cammino sarà degli agostiniani scalzi più veloce!",
            {
                fontFamily: 'Poppins',
                fontSize: '20px',
                color: '#000000',
                align: 'center',
                wordWrap: { width: panelWidth * 0.8 }
            }
        ).setOrigin(0.5);

        // Posiziona il pulsante 50px sotto il pannello
        this.startButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            panelY + panelHeight + 50,
            'Inizia',
            () => {
                panel.destroy();
                text.destroy();
                this.startButton.destroy();
                this.startGame();
            }
        );
    }

    startGame() {
        this.isPlaying = true;
        this.startTime = this.time.now;

        // Crea il percorso e il camminatore
        this.createPath();
        this.createWalker();
        
        // Imposta il frate come visibile
        this.walker.setVisible(true);
        
        // Applica un fade in veloce all'intera scena (300 ms)
        this.cameras.main.fadeIn(300);
        
        // Crea il pulsante "Via" per iniziare il cammino
        this.viaButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.height - 50,
            'Via',
            () => {
                this.viaButton.destroy();
                this.moveToNextCheckpoint();
            }
        );
    }

    createPath() {
        this.graphics = this.add.graphics();
        const totalWidth = this.cameras.main.width;
        const totalHeight = this.cameras.main.height;
        const usableWidth = totalWidth * 0.85;
        const offsetX = (totalWidth - usableWidth) / 2;
        const usableHeight = totalHeight * 0.9;
        const offsetY = (totalHeight - usableHeight) / 2;
        
        const splinePoints = [
            new Phaser.Math.Vector2(offsetX, offsetY + (usableHeight * 0.5)),                // Start
            new Phaser.Math.Vector2(offsetX + usableWidth * 0.15, offsetY + (usableHeight * 0.65)), // CP1
            new Phaser.Math.Vector2(offsetX + usableWidth * 0.3, offsetY + (usableHeight * 0.5)),   // CP2
            new Phaser.Math.Vector2(offsetX + usableWidth * 0.45, offsetY + (usableHeight * 0.7)),  // CP3
            new Phaser.Math.Vector2(offsetX + usableWidth * 0.6, offsetY + (usableHeight * 0.4)),   // CP4
            new Phaser.Math.Vector2(offsetX + usableWidth * 0.75, offsetY + (usableHeight * 0.6)),  // CP5
            new Phaser.Math.Vector2(offsetX + usableWidth * 0.9, offsetY + (usableHeight * 0.45)),  // CP6
            new Phaser.Math.Vector2(offsetX + usableWidth, offsetY + (usableHeight * 0.5))          // End
        ];
        
        this.checkpointPositions = splinePoints;
        this.path = new Phaser.Curves.Spline(splinePoints.map(p => [p.x, p.y]).flat());
        //colore linea di percorso
        this.graphics.lineStyle(4, 0xffffff);
        this.path.draw(this.graphics, 128);

        // Bandierine di partenza e arrivo
        this.add.image(splinePoints[0].x, splinePoints[0].y, 'flag-start').setScale(0.75).setDepth(1); // scale aumentato da 0.5 a 0.75
        this.add.image(splinePoints[splinePoints.length - 1].x, splinePoints[splinePoints.length - 1].y, 'flag-end').setScale(0.7).setDepth(1);

        // Crea i checkpoint per i punti 1-6 senza mostrare immagini aggiuntive
        this.checkpointContainers = [];
        for (let i = 1; i < splinePoints.length - 1; i++) {
            const point = splinePoints[i];
            const container = this.add.container(point.x, point.y);
            container.setDepth(1);
            const checkpoint = this.add.image(0, 0, 'checkpoint').setScale(0.5);
            container.add(checkpoint);
            // Non aggiungere l'immagine associata al checkpoint
            this.checkpointContainers.push(container);
        }
        return this.path;
    }

    createWalker() {
        const startPoint = this.path.getStartPoint();
        this.walker = this.add.image(startPoint.x, startPoint.y, 'frate')
            .setScale(1) // Dimensione originale
            .setDepth(2); // Assicurati che il frate sia sopra gli altri elementi
    }

    moveToNextCheckpoint() {
        // Se abbiamo raggiunto l'ultimo punto, completa il gioco
        if (this.currentSegment >= this.checkpointPositions.length - 1) {
            this.completeGame();
            return;
        }
        const targetPoint = this.checkpointPositions[this.currentSegment + 1];
        if (!targetPoint) {
            console.error("targetPoint is undefined!");
            return;
        }
        const targetX = targetPoint.x;
        const targetY = targetPoint.y;
        this.tweens.add({
            targets: this.walker,
            x: targetX,
            y: targetY,
            duration: this.currentSpeed,
            ease: 'Linear',
            onComplete: () => {
                this.walker.setRotation(0); // Mantiene il frate dritto
                // Se il frate ha raggiunto l'ultimo checkpoint domanda (indice = checkpoints.length - 2),
                // poi il successivo è il punto d'arrivo: completa il gioco.
                if (this.currentSegment === this.checkpoints.length - 0) {
                    this.currentSegment++;
                    this.completeGame();
                } else {
                    this.showQuestion();
                }
            }
        });
    }

    showQuestion() {
        // Ferma il movimento
        this.isPlaying = false;
        
        if (this.currentSegment >= this.checkpoints.length) {
            this.completeGame();
            return;
        }
        
        const question = this.checkpoints[this.currentSegment];
        
        const overlay = this.add.rectangle(
            0, 0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000, 0.7
        ).setOrigin(0).setDepth(10);
        
        const panelWidth = this.cameras.main.width * 0.9;
        const panelHeight = this.cameras.main.height * 0.8;
        const panelX = (this.cameras.main.width - panelWidth) / 2;
        const panelY = (this.cameras.main.height - panelHeight) / 2;
        
        const panel = this.add.graphics().setDepth(11);
        panel.fillStyle(0xFFFFFF, 1);
        panel.lineStyle(2, 0x00AAFF);
        panel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);
        panel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);
        
        const questionText = this.add.text(
            this.cameras.main.centerX,
            panelY + 50,
            question.question,
            {
                fontFamily: 'Poppins',
                fontSize: '24px',
                color: '#000000',
                align: 'center',
                wordWrap: { width: panelWidth * 0.8 }
            }
        ).setOrigin(0.5).setDepth(11);
        
        // Imposta inizialmente alpha a 0 per fare il fade in
        overlay.alpha = 0;
        panel.alpha = 0;
        questionText.alpha = 0;
        
        // Aggiungi il tween per far comparire con un fade in veloce (300 ms)
        this.tweens.add({
            targets: [overlay, panel, questionText],
            alpha: 1,
            duration: 300,
            ease: 'Linear'
        });
        
        const uiElements = [overlay, panel, questionText];
        
        const buttons = [];
        question.answers.forEach((answer, index) => {
            const button = createPrimaryButton(
                this,
                this.cameras.main.centerX,
                questionText.y + 100 + (index * 70),
                answer,
                () => {
                    // Disabilita tutti i bottoni immediatamente
                    buttons.forEach(btn => {
                        btn.disableInteractive();
                        btn.setAlpha(0.7);
                    });
                    
                    if (index === question.correct) {
                        // Risposta corretta: colora il bottone di verde
                        button.setStyle({ backgroundColor: '#00b65b' });
                        button.setAlpha(1); // Mantieni il bottone corretto completamente visibile
                        
                        // Attendi mezzo secondo prima di procedere
                        this.time.delayedCall(500, () => {
                            uiElements.forEach(element => element.destroy());
                            this.handleAnswer(true);
                        });
                    } else {
                        // Risposta sbagliata: colora il bottone di rosso
                        button.setStyle({ backgroundColor: '#fc1c1c' });
                        const correctButton = buttons[question.correct];
                        
                        // Fai lampeggiare il bottone della risposta corretta di verde
                        this.tweens.add({
                            targets: correctButton,
                            alpha: { from: 0.7, to: 1 },
                            yoyo: true,
                            repeat: 2,
                            duration: 200,
                            onComplete: () => {
                                correctButton.setStyle({ backgroundColor: '#00b65b' });
                                correctButton.setAlpha(1);
                                // Attendi mezzo secondo prima di procedere
                                this.time.delayedCall(500, () => {
                                    uiElements.forEach(element => element.destroy());
                                    this.handleAnswer(false);
                                });
                            }
                        });
                    }
                }
            ).setDepth(11);
            
            buttons.push(button);
            uiElements.push(button);
        });
    }

    handleAnswer(correct) {
        if (correct) {
            this.score += 150;
            this.currentSpeed *= 0.75;
            this.colorPath(0x00FF00);
        } else {
            this.score -= 50;
            this.currentSpeed *= 1.25;
            this.colorPath(0xFF0000);
        }

        this.currentSegment++;
        // Sostituisci startWalking() con moveToNextCheckpoint()
        this.moveToNextCheckpoint();
    }

    colorPath(color) {
        // Colora il segmento corrente del percorso
        const startIndex = this.currentSegment;
        const endIndex = this.currentSegment + 1;
        
        if (startIndex >= 0 && endIndex < this.checkpoints.length) {
            const start = this.checkpoints[startIndex];
            const end = this.checkpoints[endIndex];
            
            this.graphics.lineStyle(6, color);
            this.graphics.beginPath();
            this.graphics.moveTo(start.x, start.y);
            this.graphics.lineTo(end.x, end.y);
            this.graphics.strokePath();
        }
    }

    completeGame() {
        const totalTime = this.time.now - this.startTime;
        this.scene.start('FineCamminami', {
            score: this.score,
            time: totalTime
        });
    }
}

