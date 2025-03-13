import Phaser from 'phaser';
import { createPrimaryButton } from '../utilita/bottonepri.js';
import { createCard } from "./createCard.js";

export class BonusVinoMemory extends Phaser.Scene {
    // All cards names
    cardNames = ["card-0", "card-1", "card-2", "card-3", "card-4", "card-5"];
    // Cards Game Objects
    cards = [];

    // History of card opened
    cardOpened = undefined;

    // Can play the game
    canMove = false;

    // Game variables
    lives = 0;
    score = 0;
    startTime = 0;
    // Grid configuration
    gridConfiguration = {
        x: 113,
        y: 102,
        paddingX: 10,
        paddingY: 10
    }

    constructor() {
        super({ key: 'BonusVinoMemory' });
    }

    init() {
        this.cameras.main.fadeIn(500);
        this.lives = 10;
        this.score = 0;
    }

    preload() {
        this.load.setBaseURL('');
        this.load.setPath("assets/bonusvinomemory/");
        this.load.image("sfondovinomemory", "sfondo-bonus-vino-ridi.png");
        this.load.image("card-back", "retro-tessera.png");
        this.load.image("card-0", "acquaviva.png");
        this.load.image("card-1", "montepulciano.png");
        this.load.image("card-2", "sangiovese.png");
        this.load.image("card-3", "sbt.png");
        this.load.image("card-4", "offida.png");
        this.load.image("card-5", "street.png");
    }

    create() {
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;

        // Aggiungi l'immagine di sfondo a pieno schermo, adattata alla dimensione della camera
        const bgImage = this.add.image(0, 0, "sfondovinomemory").setOrigin(0);
        bgImage.setDisplaySize(gameWidth, gameHeight);

        // Eventuali altre impostazioni (ad es. per mantenere l'immagine dietro a tutto)
        bgImage.setDepth(-1);

        // ...all'inizio del metodo create(), subito dopo aver creato il bgImage...
        const overlay = this.add.graphics();
        overlay.fillStyle(0xffffff, 0.3); // Colore nero con opacità 50%
        overlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        overlay.setDepth(bgImage.depth + 1); // Assicurati che l'overlay sia sopra lo sfondo

        this.gridConfiguration = {
            x: gameWidth * 0.15,
            y: gameHeight * 0.2,
            paddingX: gameWidth * 0.02,
            paddingY: gameHeight * 0.02
        };

        const panelWidth = gameWidth * 0.85;
        const panelHeight = 280; // Altezza aumentata per contenere meglio il testo
        const panelX = (gameWidth - panelWidth) / 2;
        const panelY = this.cameras.main.centerY - panelHeight / 1.5; // Centra verticalmente il pannello

        // Prosegui con la creazione dell'intro panel sopra questo sfondo
        const introPanelBg = this.add.graphics();
        introPanelBg.fillStyle(0xFFFFFF, 0.8);
        introPanelBg.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);
        introPanelBg.lineStyle(2, 0x00AAFF, 1);
        introPanelBg.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);

        // Aggiungi il testo centrato all'interno del riquadro
        const introText = this.add.text(
            this.cameras.main.centerX,
            panelY + panelHeight / 2,
            "La strada del vino attraversa un comprensorio geografico ristretto, parte da Offida passa per Acquaviva Picena e arriva a San Benedetto.\nIn questa zona possiamo assaggiare un ottimo Rosso Piceno Superiore.\nTrova le coppie di immagini e aggiungi punti extra al tuo profilo.",
            {
                fontFamily: 'Poppins',
                fontSize: '18px',
                color: '#000000',
                align: 'center',
                wordWrap: { width: panelWidth - 20 }
            }
        ).setOrigin(0.5);

        // Crea il pulsante "Inizia" a 50px sotto il riquadro
        const startBtn = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            panelY + panelHeight + 50,
            'Inizia',
            () => {
                introPanelBg.destroy();
                introText.destroy();
                startBtn.destroy();
                // Avvia il gioco (es. esegue lo start del livello)
                this.startGame();
                this.startTime = this.time.now; // Imposta il timer all'avvio
            }
        );

        // Aggiungi il testo del timer (visibile a schermo)
        this.timeText = this.add.text(10, 10, '', {
            fontFamily: 'Poppins',
            fontSize: '24px',
            color: '#343434',
            fontWeight: 'bold'
        });
    }

    restartGame() {
        this.cardOpened = undefined;
        this.cameras.main.fadeOut(200 * this.cards.length);
        this.cards.reverse().map((card, index) => {
            this.add.tween({
                targets: card.gameObject,
                duration: 500,
                y: 1000,
                delay: index * 100,
                onComplete: () => {
                    card.gameObject.destroy();
                }
            })
        });

        this.time.addEvent({
            delay: 200 * this.cards.length,
            callback: () => {
                this.cards = [];
                this.canMove = false;
                this.scene.restart();
            }
        })
    }

    createGridCards() {
        const gridCardNames = Phaser.Utils.Array.Shuffle([...this.cardNames, ...this.cardNames]);
        const totalCards = gridCardNames.length;
        const columns = 3;
        const rows = Math.ceil(totalCards / columns);
        const gameWidth = this.cameras.main.width;
        const gameHeight = this.cameras.main.height;
        
        // Definisci la spaziatura orizzontale e verticale per ogni carta
        const cardOffsetX = 80; // larghezza approssimativa per spostamento orizzontale
        const cardOffsetY = 80; // larghezza approssimativa per spostamento verticale
        const spacingX = this.gridConfiguration.paddingX;
        const spacingY = this.gridConfiguration.paddingY;
        
        // Calcola le dimensioni complessive della griglia
        const gridWidth = columns * cardOffsetX + (columns - 1) * spacingX;
        const gridHeight = rows * cardOffsetY + (rows - 1) * spacingY;
        
        // Calcola gli offset per centrare la griglia nello schermo
        const offsetX = (gameWidth - gridWidth) / 1.3;
        const offsetY = (gameHeight - gridHeight) / 1.7;
        
        return gridCardNames.map((name, index) => {
            const col = index % columns;
            const row = Math.floor(index / columns);
            const initialX = offsetX + col * (cardOffsetX + spacingX);
            const targetY = offsetY + row * (cardOffsetY + spacingY);
            
            const newCard = createCard({
                scene: this,
                x: initialX,
                y: -1000, // parte da fuori schermo e poi tween in posizione
                frontTexture: name,
                cardName: name
            });
            newCard.gameObject.setScale(0.85);
            newCard.gameObject.initialX = newCard.gameObject.x;
            newCard.gameObject.initialY = newCard.gameObject.y;
            
            this.add.tween({
                targets: newCard.gameObject,
                duration: 800,
                delay: index * 100,
                x: initialX,
                y: targetY
            });
            
            return newCard;
        });
    }

    startGame() {
        // WinnerText and GameOverText
        // Create a grid of cards
        this.cards = this.createGridCards();

        // Start canMove
        this.time.addEvent({
            delay: 200 * this.cards.length,
            callback: () => {
                this.canMove = true;
            }
        });

        // Avvia il timer di aggiornamento del display
        this.time.addEvent({
            delay: 100, // Aggiorna ogni 100ms
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // Game Logic
        this.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer) => {
            if (this.canMove) {
                const card = this.cards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));
                if (card) {
                    this.input.setDefaultCursor("pointer");
                } else {
                    this.input.setDefaultCursor("default");
                }
            }
        });

        this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => {
            if (this.canMove && this.cards.length) {
                const card = this.cards.find(card => card.gameObject.hasFaceAt(pointer.x, pointer.y));
                if (card) {
                    this.canMove = false;

                    // Detect if there is a card opened
                    if (this.cardOpened !== undefined) {
                        // If the card is the same that the opened not do anythings
                        if (this.cardOpened.gameObject.x === card.gameObject.x && this.cardOpened.gameObject.y === card.gameObject.y) {
                            this.canMove = true;
                            return false;
                        }

                        card.flip(() => {
                            if (this.cardOpened.cardName === card.cardName) {
                                // ------- Match: le tessere scompaiono -------
                                this.score += 300;
                                this.cardOpened.destroy();
                                card.destroy();
                                this.cards = this.cards.filter(cardLocal => cardLocal.cardName !== card.cardName);
                                this.cardOpened = undefined;
                                this.canMove = true;
                                if (this.cards.length === 0) {
                                    const elapsedSeconds = Math.floor((this.time.now - this.startTime) / 1000);
                                    const finalScore = this.score - elapsedSeconds;
                                    this.scene.start('FineBonusVinoMemory', { 
                                        score: finalScore, 
                                        time: this.time.now - this.startTime 
                                    });
                                }
                            } else {
                                // ---- No match: le tessere devono rimanere in scena, flip back al retro  ----
                                this.score -= 10;
                                // Esegui un tween per evidenziare il reset (opzionale)
                                this.tweens.add({
                                    targets: card.gameObject,
                                    alpha: { from: 1, to: 0 },
                                    duration: 300,
                                    onComplete: () => {
                                        // Ripristina la texture al retro per entrambe
                                        card.gameObject.setTexture("card-back");
                                        this.cardOpened.gameObject.setTexture("card-back");
                                        // Ripristina l'alpha, se modificato
                                        card.gameObject.alpha = 1;
                                        this.cardOpened.gameObject.alpha = 1;
                                        // Resetta lo stato
                                        this.cardOpened = undefined;
                                        this.canMove = true;
                                    }
                                });
                            }
                        });
                    } else if (this.cardOpened === undefined && this.cards.length > 0) {
                        // If there is not a card opened save the card selected
                        card.flip(() => {
                            this.canMove = true;
                        });
                        this.cardOpened = card;
                    }
                }
            }
        });
    }

    updateTimer() {
        // Calcola il tempo trascorso e aggiorna il display del timer
        const elapsedSeconds = Math.floor((this.time.now - this.startTime) / 1000);
        this.timeText.setText(`Tempo: ${elapsedSeconds}s`);
    }

    endGame() {
        this.isPlaying = false;
        const endTime = this.time.now - this.startTime;
        this.scene.start('FineBonusVinoMemory', {
            score: this.score,
            time: endTime
        });
    }
}


