import Phaser from 'phaser';
import { createPrimaryButton } from '../utilita/bottonepri.js';

export class PietaSegreta extends Phaser.Scene {
    constructor() {
        super({ key: 'PietaSegreta' });
        this.startTime = 0;
        this.timeLimit = 100000; // 100 secondi in millisecondi
        this.baseScore = 1000;
        this.currentScore = this.baseScore;
        this.isPlaying = false;
        this.scoreText = null;
        this.timeText = null;
    }

    preload() {
        // Log di debug per verificare che il preload sia chiamato
        console.log('Preloading images...');
        
        // Carica le immagini con i percorsi corretti
        this.load.image('pieta', 'assets/pietasegreta/immaginepieta.png');
        this.load.image('gratta', 'assets/pietasegreta/grigio-gratta.png');
    }

    create() {
        // Log di debug
        console.log('Creating scene...');
        
        this.cameras.main.setBackgroundColor('#FFFBF5');

        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const screenWidth = this.cameras.main.width;
        
        
        // Crea l'immagine nascosta (premio)
        this.hiddenImage = this.add.image(centerX, centerY - 50, 'pieta').setOrigin(0.5);
        const targetWidth = screenWidth * 0.85;
        const scale = targetWidth / this.hiddenImage.width;
        this.hiddenImage.setScale(scale);

        // Aggiungi il testo istruzionale
        this.instructionText = this.add.text(
            centerX,
            this.hiddenImage.y - (this.hiddenImage.displayHeight / 2) - 40,
            "Gratta via la vernice grigia e scopri cosa c'è sotto",
            {
                fontFamily: 'Poppins',
                fontSize: '20px',
                color: '#343434',
                align: 'center',
                wordWrap: { width: screenWidth * 0.8 }
            }
        ).setOrigin(0.5);

        

        // Crea lo strato di copertura tramite renderTexture
        const x = this.hiddenImage.x - this.hiddenImage.displayWidth / 2;
        const y = this.hiddenImage.y - this.hiddenImage.displayHeight / 2;

        // Crea lo strato di copertura tramite renderTexture
        this.cover = this.add.renderTexture(x, y, this.hiddenImage.displayWidth, this.hiddenImage.displayHeight);
        
        // Riempi la renderTexture con un colore grigio semitrasparente
        this.cover.fill(0x808080, 1); // Colore grigio (0x808080) con opacità 0.7

        // Disegna l'immagine "gratta" completa sulla cover
        // this.cover.draw('gratta', 0, 0, this.hiddenImage.displayWidth, this.hiddenImage.displayHeight);
        
        // Imposta la cover sopra l'immagine nascosta
        this.cover.setOrigin(0);
        this.cover.setDepth(1);

        // Crea il pennello per cancellare (usato per erase)
        this.brush = this.add.circle(0, 0, 25, 0xffffff);
        this.brush.setVisible(false);

        // Aggiorna la posizione del punteggio usando la posizione dell'immagine
        this.scoreText = this.add.text(
            centerX, 
            this.hiddenImage.getBottomCenter().y + 70, 
            `Punteggio: ${this.currentScore}`,
            {
                fontFamily: 'Poppins',
                fontSize: '26px',
                color: '#343434',
                fontWeight: 'bold'
            }
        ).setOrigin(0.5);

        // Crea il pulsante Start
        this.startButton = createPrimaryButton(
            this,
            centerX,
            this.scoreText.y + 60,
            'Inizia',
            () => this.startGame()
        );

        // Prepara il timer text (inizialmente nascosto)
        this.timeText = this.add.text(10, 10, '', {
            fontFamily: 'Poppins',
            fontSize: '22px',
            color: '#343434',
            fontWeight: 'bold'
        }).setVisible(false);
    }


    startGame() {

        // Nascondi il testo istruzionale
        this.instructionText.setVisible(false);

        this.isPlaying = true;
        this.startTime = this.time.now;
        this.startButton.destroy();
        this.timeText.setVisible(true);
    
        // Inizializza l'area cancellata (stima) e l'area totale della cover
        this.erasedArea = 0;
        this.coverArea = this.cover.width * this.cover.height;
        
        // Nei listener di input usa la renderTexture per cancellare gradualmente la copertura
        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown && this.isPlaying) {
                const localX = pointer.x - (this.hiddenImage.x - this.hiddenImage.displayWidth / 2);
                const localY = pointer.y - (this.hiddenImage.y - this.hiddenImage.displayHeight / 2);
                this.cover.erase(this.brush, localX, localY);
                
                // Stima l'area cancellata in base al pennello
                const brushArea = Math.PI * Math.pow(this.brush.radius, 2);
                this.erasedArea += brushArea;
                
                //Se l'area cancellata supera l'80% dell'area della cover, completa il gioco
                if (this.erasedArea / this.coverArea >= 90) {
                    this.handleGameComplete();
                }
            }
        });
    
        this.input.on('pointerdown', (pointer) => {
            if (this.isPlaying) {
                const localX = pointer.x - (this.hiddenImage.x - this.hiddenImage.displayWidth / 2);
                const localY = pointer.y - (this.hiddenImage.y - this.hiddenImage.displayHeight / 2);
                this.cover.erase(this.brush, localX, localY);
                
                const brushArea = Math.PI * Math.pow(this.brush.radius, 2);
                this.erasedArea += brushArea;
                
                if (this.erasedArea / this.coverArea >= 12) {
                    this.handleGameComplete();
                }
            }
        });
    
        // Timer di aggiornamento punteggio
        this.time.addEvent({
            delay: 100, // Aggiorna ogni 100ms
            callback: this.updateScore,
            callbackScope: this,
            loop: true
        });
    }


    updateScore() {
        if (!this.isPlaying) return; // Impedisce l'aggiornamento se il gioco è fermo

        const elapsedSeconds = (this.time.now - this.startTime) / 1000;
        this.currentScore = Math.max(0, this.baseScore - Math.floor(elapsedSeconds * 10));
        this.scoreText.setText(`Punteggio: ${this.currentScore}`);
        this.timeText.setText(`Tempo: ${Math.max(0, 100 - Math.floor(elapsedSeconds))}s`);

        // Verifica se il tempo è scaduto
        if (elapsedSeconds >= 100) {
            this.gameOver(0);
        }
    }


    handleGameComplete() {
        // Ferma il gioco e registra i dati finali
        this.isPlaying = false;
        this.input.removeAllListeners();
        this.time.removeAllEvents();

        const finalTime = this.time.now - this.startTime;
        const finalScore = this.currentScore;

        // Mostra il pulsante "Continua" per passare alla scena finale
        const continueButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            this.scoreText.y + 60,
            'Continua',
            () => {
                this.cameras.main.fade(1000, 255, 251, 245);
                this.time.delayedCall(1000, () => {
                    this.scene.start('FinePietaSegreta', {
                        score: finalScore,
                        time: finalTime
                    });
                });
            }
        );
    }

    

    estimateScratchedArea() {
        // Implementazione base - puoi migliorarla per maggiore precisione
        return this.grattaMask.getGlobalBounds().area;
    }
}