import { createPrimaryButton } from '../utilita/bottonepri.js';
import { GameState } from '../stato/GameState.js';
import Phaser from 'phaser';

export class WherisAcquaviva extends Phaser.Scene {
    constructor() {
        super({ key: 'WherisAcquaviva' });
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
                question: "Siamo In Unione Europea, qual è la bandiera?", 
                answers: [
                    {type: "image", value: "austra"},
                    {type: "image", value: "cinci"}, 
                    {type: "image", value: "mauri"},
                    {type: "image", value: "russi"}, 
                    {type: "image", value: "europ"},
                    {type: "image", value: "merica"}
                ], 
                correct: 4 
            },
            { 
                question: "La nazione è l'Italia qual è la bandiera?", 
                answers: [
                    {type: "image", value: "irla"},
                    {type: "image", value: "itali"}, 
                    {type: "image", value: "avorio"},
                    {type: "image", value: "messi"}, 
                    {type: "image", value: "maroc"},
                    {type: "image", value: "franc"}
                ], 
                correct: 1 
            },
            { 
                question: "La regione si chiama Marche, qual è la bandiera?", 
                answers: [
                    {type: "image", value: "marc"},
                    {type: "image", value: "abru"}, 
                    {type: "image", value: "moli"},
                    {type: "image", value: "laz"}, 
                    {type: "image", value: "piem"},
                    {type: "image", value: "tosc"}
                ], 
                correct: 0 
            },
            { 
                question: "La provincia è quella di Ascoli piceno, qual'è lo stemma?", 
                answers: [
                    {type: "image", value: "mace"},
                    {type: "image", value: "anc"}, 
                    {type: "image", value: "scoli"},
                    {type: "image", value: "pesa"}, 
                    {type: "image", value: "peru"}
                ], 
                correct: 2 
            },
            { 
                question: "E lo stemma del Comune?", 
                answers: [
                    {type: "image", value: "ter"},
                    {type: "image", value: "acq"}, 
                    {type: "image", value: "sem"},
                    {type: "image", value: "fer"}, 
                    {type: "image", value: "ben"},
                    {type: "image", value: "ttam"},
                ], 
                correct: 1 
            },
            // {
            //     question: "Qual è la Diocesi di appartenenza", 
            //     answers: [
            //         {type: "text", value:"Fermo"}, 
            //         {type: "text", value:"Macerata"}, 
            //         {type: "text", value:"Teramo"}, 
            //         {type: "text", value:"Ascoli"},
            //         {type: "text", value:"Roma"},
            //         {type: "text", value:"Milano"}
            //     ], 
            //     correct: 1 
            // },
            {
                question: "Qual è il mumero unico per le emergenze?", 
                answers: [
                    {type: "text", value:"112"}, 
                    {type: "text", value:"911"}, 
                    {type: "text", value:"734"}, 
                    {type: "text", value:"589"},
                    {type: "text", value:"345"},
                    {type: "text", value:"007"}
                ], 
                correct: 0 
            },
            {
                question: "Il mare a est si chiama?", 
                answers: [
                    {type: "text", value:"Tirreno"}, 
                    {type: "text", value:"Ionio"}, 
                    {type: "text", value:"Laguna di Venezia"}, 
                    {type: "text", value:"Adriatico"},
                    {type: "text", value:"Laguna Dalmata"}
                ], 
                correct: 3 
            },
            {
                question: "Le montagne a ovest si chiamano?", 
                answers: [
                    {type: "text", value:"Maiella"}, 
                    {type: "text", value:"Gran\nSasso"}, 
                    {type: "text", value:"Conero"}, 
                    {type: "text", value:"Sibillini"},
                    {type: "text", value:"Nebbiosi"},
                    {type: "text", value:"Olimpo"}
                ], 
                correct: 3 
            },
            {
                question: "Come si chiama la vetta più alta dei Sibillini?", 
                answers: [
                    {type: "text", value:"Sibilla"}, 
                    {type: "text", value:"Picco\ndel Sole"}, 
                    {type: "text", value:"Vettore"}, 
                    {type: "text", value:"Gran\nSasso"},
                    {type: "text", value:"Monte\nBove"}
                ], 
                correct: 2 
            },
            {
                question: "La Riserva Naturale Regionale più vicina come si chiama? ", 
                answers: [
                    {type: "text", value:"Conero"}, 
                    {type: "text", value:"Fiastra"}, 
                    {type: "text", value:"Sibillini"}, 
                    {type: "text", value:"Sentina"},
                    {type: "text", value:"Colli\ndel Vino"},
                    {type: "text", value:"Via\ndell'Olio"}
                ], 
                correct: 3 
            },
            {
                question: "Acquaviva Picena confina con Ascoli Piceno?", 
                answers: [
                    {type: "text", value:"Si"}, 
                    {type: "text", value:"No"}, 
                    {type: "text", value:"Forse"},
                    {type: "text", value:"A giorni\nAlterni"}
                ], 
                correct: 1 
            }
        ];
        this.currentQuestionIndex = 0;
        this.balloons = [];
        this.questionText = null;
    }

    preload() {
        // Carico le bandiere domanda uno continente
        this.load.image('austra', 'assets/wherisacquaviva/bandiera-australia.png');
        this.load.image('cinci', 'assets/wherisacquaviva/bandiera-cina.png');
        this.load.image('mauri', 'assets/wherisacquaviva/bandiera-mauritania.png');
        this.load.image('russi', 'assets/wherisacquaviva/bandiera-russia.png');
        this.load.image('europ', 'assets/wherisacquaviva/bandiera-ue.png');
        this.load.image('merica', 'assets/wherisacquaviva/bandiera-usa.png');
        
        // Carico le bandiere domanda due nazione
        this.load.image('irla', 'assets/wherisacquaviva/bandiera-irlanda.png');
        this.load.image('itali', 'assets/wherisacquaviva/bandiera-italia.png');
        this.load.image('avorio', 'assets/wherisacquaviva/bandiera-avorio.png');
        this.load.image('messi', 'assets/wherisacquaviva/bandiera-messico.png');
        this.load.image('maroc', 'assets/wherisacquaviva/bandiera-marocco.png');
        this.load.image('franc', 'assets/wherisacquaviva/bandiera-francia.png');
        
        // Carico le bandiere domanda due regione
        this.load.image('marc', 'assets/wherisacquaviva/bandiera-marche.png');
        this.load.image('abru', 'assets/wherisacquaviva/bandiera-abruzzo.png');
        this.load.image('moli', 'assets/wherisacquaviva/bandiera-molise.png');
        this.load.image('laz', 'assets/wherisacquaviva/bandiera-lazio.png');
        this.load.image('piem', 'assets/wherisacquaviva/bandiera-piemonte.png');
        this.load.image('tosc', 'assets/wherisacquaviva/bandiera-toscana.png');

        // Carico lo stemma della provincia
        this.load.image('anc', 'assets/wherisacquaviva/stemma-ancona.png');
        this.load.image('scoli', 'assets/wherisacquaviva/stemma-ascoli.png');
        this.load.image('mace', 'assets/wherisacquaviva/stemma-macerata.png');
        this.load.image('pesa', 'assets/wherisacquaviva/stemma-pesaro-urbino.png');
        this.load.image('peru', 'assets/wherisacquaviva/stemma-perugia.png');

        // Carico lo stemma del comune
        this.load.image('acq', 'assets/wherisacquaviva/stemma-acquaviva.png');
        this.load.image('ter', 'assets/wherisacquaviva/stemma-teramo.png');
        this.load.image('sem', 'assets/wherisacquaviva/stemma-sem.png');
        this.load.image('fer', 'assets/wherisacquaviva/stemma-fermo.png');
        this.load.image('ben', 'assets/wherisacquaviva/stemma-sanbenedetto.png');
        this.load.image('ttam', 'assets/wherisacquaviva/stemma-grottammare.png');


        // Carica le risorse grafiche
        this.load.image('balloon', 'assets/wherisacquaviva/palloncino_giallo.png');
        this.load.image('balloon_popped', 'assets/wherisacquaviva/scoppio.png');
        this.load.image('risposta_esatta', 'assets/wherisacquaviva/pesca-esulta.png');
        this.load.image('risposta_sbagliata', 'assets/wherisacquaviva/pesca-sbaglia.png');
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
                
                const maxWidth = this.cameras.main.width * 0.85;
                const question = this.questions[this.currentQuestionIndex];
                this.questionText = this.add.text(
                    this.cameras.main.centerX,
                    50, // 50 pixel dal top
                    question.question,
                    {
                         fontFamily: 'Poppins',
                         fontSize: '22px',
                         color: '#000000',
                         align: 'center',
                         wordWrap: { width: maxWidth, useAdvancedWrap: true }
                    }
                ).setOrigin(0.5);
            
                this.answerElements = []; // Reset dell'array prima di creare nuove risposte
            
                question.answers.forEach((answer, index) => {
                    let x, y;
                    let overlap;
                    // Definisci l'area disponibile per il posizionamento (75% dell'altezza)
                    const regionWidth = this.cameras.main.width;
                    const regionHeight = this.cameras.main.height; // Usa l'altezza intera
                    const marginX = 50;
                    const marginY = this.questionText.y + this.questionText.displayHeight + 50; // inizia subito dopo la domanda
                    //gestione del numero massimo di tentativi de loop
                    let attempts = 0;
                    const maxAttempts = 100; // Aumenta il limite se necessario
                    do {
                        overlap = false;
                        //x = Phaser.Math.Between(50, this.cameras.main.width - 50);
                        //y = Phaser.Math.Between(100, this.cameras.main.height / 2 - 50);

                        // Genera una coordinata x all'interno dell'area con margine
                        x = Phaser.Math.Between(marginX, regionWidth - marginX);
                        // Genera una coordinata y all'interno dell'area 75% con margine
                        y = Phaser.Math.Between(marginY, regionHeight - marginY);

                        for (let balloon of this.balloons) {
                            if (Phaser.Math.Distance.Between(x, y, balloon.x, balloon.y) < 100) {
                                overlap = true;
                                break;
                            }
                        }
                        attempts++;
                        // Se superiamo il numero massimo di tentativi, usciamo dal loop
                        if (attempts > maxAttempts) {
                            // Se non troviamo una posizione valida dopo molti tentativi, forziamo una posizione di default
                            x = regionWidth / 2;
                            y = regionHeight / 2;
                            //console.warn('Impossibile posizionare un nuovo balloon senza sovrapposizione dopo molti tentativi.');
                            break;
                        }
                    } while (overlap);
            
                    const balloon = this.add.image(x, y, 'balloon').setInteractive().setScale(1);
                    let answerElement;
            
                    // Controlliamo se la risposta è un'immagine o un testo
                    if (answer.type === "image") {
                        answerElement = this.add.image(x, y, answer.value).setOrigin(0.5).setScale(0.5);
                    } else {
                        answerElement = this.add.text(x, y, answer.value.replace(/\\n/g, '\n'), {
                            fontFamily: 'Poppins',
                            fontSize: '16px',
                            color: '#000000',
                            align: 'center', // Assicura l'allineamento centrale
                            wordWrap: { width: 120, useAdvancedWrap: true }
                        }).setOrigin(0.5)
                        .setLineSpacing(2); // riduce il line spacing da 5 a 2
                    }
            
                    // Aggiungiamo entrambi gli elementi all'array
                    this.answerElements.push(answerElement);
                    this.balloons.push(balloon);
            
                    this.tweens.add({
                        targets: [balloon, answerElement],
                        y: '-=10',
                        duration: 2000,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
            
                    balloon.on('pointerdown', () => {
                        this.checkAnswer(index, balloon, answerElement);
                    });
                });            
        
    }

    checkAnswer(index, balloon, answerElement) {
        const question = this.questions[this.currentQuestionIndex];
        if (index === question.correct) {
            this.score += 1000;
            this.showCorrectAnswer(balloon, answerElement);
        } else {
            this.score -= 200;
            this.showWrongAnswer(balloon, answerElement);
        }
    }

    showCorrectAnswer(balloon, answerElement) {
        // Mostra l'immagine della risposta corretta al centro dello schermo con animazione
        this.tweens.add({
            targets: balloon,
            scale: { from: 1, to: 1.5 },
            duration: 500,
            onComplete: () => {
                balloon.setTexture('balloon_popped').setScale(1.5);
                
                // Distrugge il testo o l'immagine della risposta
                if (answerElement) answerElement.destroy();
    
                this.time.delayedCall(200, () => {
                    const correctImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'risposta_esatta').setOrigin(0.5).setAlpha(0);
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

    showWrongAnswer(balloon, answerElement) {
        // Mostra l'immagine della risposta sbagliata al centro dello schermo con animazione
        this.tweens.add({
            targets: balloon,
            scale: { from: 1, to: 1.5 },
            duration: 500,
            onComplete: () => {
                balloon.setTexture('balloon_popped').setScale(1.5);
                if (answerElement) answerElement.destroy(); // Distrugge testo o immagine
                this.time.delayedCall(200, () => {
                    const wrongImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'risposta_sbagliata').setOrigin(0.5).setAlpha(0);
                    this.tweens.add({
                        targets: wrongImage,
                        alpha: 1,
                        duration: 200
                    });
                    this.time.delayedCall(1000, () => {
                        wrongImage.destroy();
                    });
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
        this.scene.start('FineWerisAcquaviva', { 
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