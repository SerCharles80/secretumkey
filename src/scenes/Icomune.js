import { createPrimaryButton } from '../utilita/bottonepri.js';
import { GameState } from '../stato/GameState.js';
import Phaser from 'phaser';

export class Icomune extends Phaser.Scene {
    constructor() {
        super({ key: 'Icomune' });
        // Inizializza le variabili di stato
        this.score = 0;
        this.startTime = 0;
        //this.timerText = null;
        //this.scoreText = null;
        this.isPaused = false;
        this.elapsed = 0;
        this.isStopped = false;
        this.answerElements = [];
        this.balloons = [];
        // Definisci le domande e le risposte
        this.questions = [
            { 
                question: "La sede del comune è all’interno di un palazzo storico. Qual è il nome attuale del palazzo?", 
                answers: [
                    {type: "image", value: "Palazzo Acquaviva"},
                    {type: "image", value: "Palazzo Brunforte"}, 
                    {type: "image", value: "Palazzo Chigi"},
                    {type: "image", value: "Palazzo Chiappini"}, 
                    {type: "image", value: "Palazzo Campanelli"}
                ], 
                correct: 4 
            },
            { 
                question: "Quale famiglia nobile ha deciso la costruzione del palazzo?", 
                answers: [
                    {type: "image", value: "Famiglia Acquaviva"},
                    {type: "image", value: "Famiglia Brunforti"}, 
                    {type: "image", value: "Famiglia Neroni"},
                    {type: "image", value: "Famiglia Infriccioli"}, 
                    {type: "image", value: "Famiglia Cancelli"},
                    {type: "image", value: "Famiglia Campanelli"}
                ], 
                correct: 1 
            },
            { 
                question: "Quale coppia di famiglie ha abitato il palazzo?", 
                answers: [
                    {type: "image", value: "Cancelli Acquaviva"},
                    {type: "image", value: "Cancelli Cancelli"}, 
                    {type: "image", value: "Cancelli Neroni"},
                    {type: "image", value: "Cancelli Sforza"}, 
                    {type: "image", value: "Brunforte Cancelli"},
                    {type: "image", value: "Cancelli Spaccasassi"}
                ], 
                correct: 1 
            },
            { 
                question: "Una delle stanze è affrescata con un ciclo pittorico dedicato a quale amore?", 
                answers: [
                    {type: "image", value: "Agamennone e Elena"},
                    {type: "image", value: "Amore e Psiche"}, 
                    {type: "image", value: "Artù e Ginevra"},
                    {type: "image", value: "Ettore e Andromaca"}, 
                    {type: "image", value: "Giulietta e Romeo"},
                    {type: "image", value: "Tristano e Isotta"}
                ], 
                correct: 1 
            },
            { 
                question: "Quale dea, moglie di Zeus/Giove, è rappresentata in un affresco che dà il nome alla sala?", 
                answers: [
                    {type: "image", value: "Dea Teti"},
                    {type: "image", value: "Dea Hera"}, 
                    {type: "image", value: "Dea Demetra"},
                    {type: "image", value: "Dea Dafne"}, 
                    {type: "image", value: "Dea Atena"}
                ], 
                correct: 1 
            }

        ];
        this.currentQuestionIndex = 0;
        this.balloons = [];
        this.questionText = null;
    }

    preload() {

        // Carico le dee per le risposte domanda 5
        this.load.image('Dea Teti', 'assets/icomune/05/teti.png');
        this.load.image('Dea Hera', 'assets/icomune/05/hera.png');
        this.load.image('Dea Demetra', 'assets/icomune/05/demetra.png');
        this.load.image('Dea Dafne', 'assets/icomune/05/dafne.png');
        this.load.image('Dea Atena', 'assets/icomune/05/atena.png');

        // Carico le famiglie per le risposte domanda 4
        this.load.image('Agamennone e Elena', 'assets/icomune/04/agamennone-elena.png');
        this.load.image('Amore e Psiche', 'assets/icomune/04/amore-psiche.png');
        this.load.image('Artù e Ginevra', 'assets/icomune/04/artu-ginevra.png');
        this.load.image('Ettore e Andromaca', 'assets/icomune/04/ettore-andromaca.png');
        this.load.image('Giulietta e Romeo', 'assets/icomune/04/giulietta-romeo.png');
        this.load.image('Tristano e Isotta', 'assets/icomune/04/tristano-isotta.png');

        // Carico le famiglie per le risposte domanda 3
        this.load.image('Cancelli Acquaviva', 'assets/icomune/03/cancelli-acquaviva.png');
        this.load.image('Cancelli Cancelli', 'assets/icomune/03/cancelli-cancelli.png');
        this.load.image('Cancelli Neroni', 'assets/icomune/03/cancelli-neroni.png');
        this.load.image('Cancelli Sforza', 'assets/icomune/03/cancelli-sforza.png');
        this.load.image('Brunforte Cancelli', 'assets/icomune/03/brunforte-cancelli.png');
        this.load.image('Cancelli Spaccasassi', 'assets/icomune/03/cancelli-spaccasassi.png');

        // Carico le famiglie per le risposte domanda 2
        this.load.image('Famiglia Acquaviva', 'assets/icomune/02/famiglia-acquaviva.png');
        this.load.image('Famiglia Brunforti', 'assets/icomune/02/famiglia-brunforti.png');
        this.load.image('Famiglia Neroni', 'assets/icomune/02/famiglia-neroni.png');
        this.load.image('Famiglia Infriccioli', 'assets/icomune/02/famiglia-infriccioli.png');
        this.load.image('Famiglia Cancelli', 'assets/icomune/02/famiglia-cancelli.png');
        this.load.image('Famiglia Campanelli', 'assets/icomune/02/famiglia-campanelli.png');

        // Carico i palazzi per le risposte domanda 1
        this.load.image('Palazzo Acquaviva', 'assets/icomune/01/palazzo-acquaviva.png');
        this.load.image('Palazzo Brunforte', 'assets/icomune/01/palazzo-brunforte.png');
        this.load.image('Palazzo Chigi', 'assets/icomune/01/palazzo-chigi.png');
        this.load.image('Palazzo Chiappini', 'assets/icomune/01/palazzo-chiappini.png');
        this.load.image('Palazzo Campanelli', 'assets/icomune/01/palazzo-campanelli.png');


        // Carica le risorse grafiche
        this.load.image('balloon', 'assets/wherisacquaviva/palloncino_giallo.png');
        this.load.image('delusione', 'assets/icomune/delusione.png');
        this.load.image('risposta_esatta', 'assets/wherisacquaviva/pesca-esulta.png');
        this.load.image('risposta_sbagliata', 'assets/wherisacquaviva/pesca-sbaglia.png');
        this.load.image('esulto', 'assets/wherisacquaviva/esultanza-post-livello.png');
    }




    create() {
        // Imposta lo sfondo e il timer
        this.cameras.main.setBackgroundColor('#FFFBF5');

        // Crea il nuovo pulsante riutilizzabile
        this.startButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Start',
            () => {
                console.log("Pulsante Start premuto! Avvio gioco...");
                this.startGame(); // Quando premuto, avvia il gioco
        });


        // Aggiungi il testo del timer
        /*this.timerText = this.add.text(10, 10, 'Time: 00:00', {
            fontFamily: 'Poppins',
            fontSize: '24px',
            color: '#000000'
        });

        // Aggiungi il testo del punteggio
        this.scoreText = this.add.text(300, 10, 'Score: 0', {
            fontFamily: 'Poppins',
            fontSize: '24px',
            color: '#000000'
        });*/
    }

    //Funzione per startare il gioco con il pulsante
    startGame() {
        console.log("Start premuto, avvio del gioco...");
    
        // Controlliamo se il pulsante esiste prima di distruggerlo
        if (this.startButton) {
            this.tweens.add({
                targets: this.startButton,
                alpha: 0, // Riduce la trasparenza fino a scomparire
                duration: 300, // Durata 0,5 secondi
                onComplete: () => {
                    console.log("Fade out completato, distruzione pulsante...");
                    this.startButton.destroy(true);
                    this.startButton = null;
                    console.log("Pulsante Start distrutto!");
                }
            });
    
        } else {
            console.error("Errore: Il pulsante Start non esiste!");
        }
    
        // Avvia il gioco
        this.isPaused = false;
        this.startTime = this.time.now;
        console.log(`Timer avviato: ${this.startTime}`);
    
        // Mostra la prima domanda
        console.log("Chiamata a showQuestion()...");
        this.showQuestion();
    }

    update() {
        // Aggiorna il timer se il gioco non è in pausa o fermo
        /*if (this.isPaused || this.isStopped) {
            return;
        }

        const elapsed = this.time.now - this.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);

        this.timerText.setText(`Time: ${this.formatTime(minutes)}:${this.formatTime(seconds)}`);*/
    }

    showQuestion() {

            // Rimuovi la domanda precedente se esiste
            if (this.questionText) {
                this.questionText.destroy();
            }
            
            const maxWidth = this.cameras.main.width * 0.95;
            const question = this.questions[this.currentQuestionIndex];

            this.questionText = this.add.text(this.cameras.main.centerX, this.cameras.main.height - 50, question.question, {
                fontFamily: 'Poppins',
                fontSize: '20px',
                color: '#000000',
                align: 'center',
                wordWrap: { width: maxWidth, useAdvancedWrap: true }
            }).setOrigin(0.5);
        
            this.answerElements = []; // Reset dell'array prima di creare nuove risposte
            
            
            question.answers.forEach((answer, index) => {

            // Calcola la posizione in una griglia 2xN
            const itemsPerRow = 2;
            const spacing = 150; // Spazio tra le risposte
            const isLastItem = index === question.answers.length - 1;
            const isOddTotal = question.answers.length % 2 !== 0;
            
            let row = Math.floor(index / itemsPerRow);
            let col = index % itemsPerRow;
            
            // Calcola le coordinate x e y
            let x = this.cameras.main.centerX + (col - 0.5) * spacing;
            let y = 70 + (row * spacing);

            // Se è l'ultimo elemento di un totale dispari, centralo
            if (isLastItem && isOddTotal) {
                x = this.cameras.main.centerX;
            }

            // Crea un container per raggruppare immagine e testo
            const container = this.add.container(x, y);

            // Aggiungi l'immagine della risposta
            const answerImage = this.add.image(0, 0, answer.value)
                .setDisplaySize(100, 100) // Imposta larghezza e altezza a 100px
                .setInteractive();

            // Aggiungi il testo sotto l'immagine
            const answerText = this.add.text(0, 53, answer.value, {
                fontFamily: 'Poppins',
                fontSize: '15px',
                color: '#000000',
                align: 'center',
                wordWrap: { width: 100 } // Limita la larghezza del testo a 100px
            }).setOrigin(0.5, 0);

            // Aggiungi immagine e testo al container
            container.add([answerImage, answerText]);

            // Aggiungi il container all'array delle risposte
            this.answerElements.push(container);

            // Gestisci il click sull'immagine
            answerImage.on('pointerdown', () => {
                this.checkAnswer(index, container);
            });
        });           
        
    }

    checkAnswer(index, container) {
        const question = this.questions[this.currentQuestionIndex];
        if (index === question.correct) {
            this.score += 1000;
            this.showCorrectAnswer(container);
        } else {
            this.score -= 200;
            this.showWrongAnswer(container);
        }
    }

    showCorrectAnswer(container) {
        this.tweens.add({
            targets: container,
            scale: { from: 1, to: 1.5 },
            duration: 500,
            onComplete: () => {
                container.destroy();
                this.time.delayedCall(200, () => {
                    const correctImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'risposta_esatta')
                        .setOrigin(0.5)
                        .setAlpha(0);
                    this.tweens.add({
                        targets: correctImage,
                        alpha: 1,
                        duration: 200
                    });
                    this.time.delayedCall(1000, () => {
                        correctImage.destroy();
                        this.nextQuestion();
                    });
                });
            }
        });
    }

    showWrongAnswer(container) {
        // Prima fa diminuire il container con l'immagine selezionata
        this.tweens.add({
            targets: container,
            scale: { from: 1, to: 0.5 },
            duration: 500,
            onComplete: () => {
                container.destroy();
                // Poi mostra l'immagine di delusione
                const wrongImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'delusione')
                    .setOrigin(0.5)
                    .setAlpha(0)
                    .setDisplaySize(250, 250);
                
                this.tweens.add({
                    targets: wrongImage,
                    alpha: 1,
                    duration: 200,
                    onComplete: () => {
                        // Dopo un secondo rimuove l'immagine di delusione
                        this.time.delayedCall(1000, () => {
                            wrongImage.destroy();
                        });
                    }
                });
            }
        });
    }

    nextQuestion() {
        // Passa alla domanda successiva
           // Rimuove tutti i palloncini
        this.balloons.forEach(balloon => {
            if (balloon) balloon.destroy();
        });
        this.balloons = [];

        // Rimuove tutte le immagini e i testi delle risposte
        this.answerElements.forEach(element => {
            if (element) element.destroy();
        });
        this.answerElements = [];

        // Rimuove il testo della domanda precedente
        if (this.questionText) {
            this.questionText.destroy();
        }

        // Passa alla prossima domanda o mostra il messaggio di completamento
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
            this.showQuestion();
        } else {
            this.showCompletionMessage();
        }
    }
    showCompletionMessage() {
        // Just pass raw score and time to FineWerisAcquaviva
        this.scene.start('FineIcomune', { 
            score: this.score, 
            time: this.time.now - this.startTime 
        });
    }
    

    formatTime(value) {
        // Formatta il tempo in minuti e secondi
        return value.toString().padStart(2, '0');
    }
    
    // Remove updateGlobalScoreDisplay() method
 
    // Remove calculateFinalScore() method

}


