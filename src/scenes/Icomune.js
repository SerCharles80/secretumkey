import Phaser from 'phaser';
import { createPrimaryButton } from '../utilita/bottonepri.js';

export class Icomune extends Phaser.Scene {
    constructor() {
        super({ key: 'Icomune' });
        // Variabili di stato per il livello
        this.score = 0;
        this.startTime = 0;
        this.isPaused = false;
        this.currentQuestionIndex = 0;
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
                correct: 3 
            },
            { 
                question: "Quale famiglia nobile ha deciso la costruzione del palazzo?", 
                answers: [
                    {type: "image", value: "Famiglia Acquaviva"},
                    {type: "image", value: "Famiglia Brunforti"}, 
                    {type: "image", value: "Famiglia Neroni"},
                    {type: "image", value: "Famiglia Savoia"}, 
                    {type: "image", value: "Famiglia Cancelli"},
                    {type: "image", value: "Famiglia Campanelli"}
                ], 
                correct: 4 
            },
            { 
                question: "Quale coppia di famiglie ha abitato il palazzo?", 
                answers: [
                    {type: "image", value: "Cancelli Acquaviva"},
                    {type: "image", value: "Cancelli Cancelli"}, 
                    {type: "image", value: "Cancelli Neroni"},
                    {type: "image", value: "Cancelli Sforza"}, 
                    {type: "image", value: "Brunforte Cancelli"},
                    {type: "image", value: "Cancelli Asburgo"}
                ], 
                correct: 2 
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
            },
            { 
                question: "Chi traina il suo carro?", 
                answers: [
                    {type: "image", value: "Bovini"},
                    {type: "image", value: "Cavalli"}, 
                    {type: "image", value: "Cavallucci Marini"},
                    {type: "image", value: "Elefanti"}, 
                    {type: "image", value: "Pavoni"}
                ], 
                correct: 4 
            },
            { 
                question: "Chi è la divinità greco-romana, figlia di Zeus/Giove, raffigurata nell'affresco al centro del soffitto di una delle sale?", 
                answers: [
            
                    {type: "image", value: "Atena"},
                    {type: "image", value: "Afrodite"}, 
                    {type: "image", value: "Dafne"},
                    {type: "image", value: "Demetra"}, 
                    {type: "image", value: "Teti"}
                ], 
                correct: 1 
            },
            { 
                question: "Chi traina il suo carro?", 
                answers: [
                    {type: "image", value: "Oche"},
                    {type: "image", value: "Cavalli"}, 
                    {type: "image", value: "Cavallucci Marini"},
                    {type: "image", value: "Elefanti"}, 
                    {type: "image", value: "Pavoni"}
                ], 
                correct: 0 
            },
            { 
                question: "Una sala è dedicata alla Religione Cristiana a quale Testamento?", 
                answers: [
                    {type: "image", value: "Vecchio Testamento"},
                    {type: "image", value: "Nuovo Testamento"},                   
                ], 
                correct: 0 
            },
            { 
                question: "Una sala è affrescata con un genere artistico specifico. Quale?", 
                answers: [
                    {type: "image", value: "Commedia"},
                    {type: "image", value: "Musica"}, 
                    {type: "image", value: "Poesia"},
                    {type: "image", value: "Tecnologia"}, 
                    {type: "image", value: "Tragedia"}
                ], 
                correct: 1 
            },
            {
                question: "Palazzo Chiappini è accessibile per chi ha difficoltà motorie?", 
                answers: [
                    {type: "image", value: " "},
                    {type: "image", value: "  "}, 
                    {type: "image", value: "   "},
                    {type: "image", value: "    "}                  
                ], 
                correct: 1 
            }
        ];
        // Altre variabili (answerElements, balloons, ecc.)
        this.answerElements = [];
        this.balloons = [];
    }

    preload() {
        // ...existing preload code...
        // Rimuovi eventuali riferimenti ad audio
        // Carica asset relativi alle domande, risposte e grafica
         // Carico le dee per le risposte domanda11
         this.load.image(' ', 'assets/icomune/11/antipatici.png');
         this.load.image('  ', 'assets/icomune/11/ascensore.png');
         this.load.image('   ', 'assets/icomune/11/scale.png');
         this.load.image('    ', 'assets/icomune/11/scivolo.png');


        // Carico le dee per le risposte domanda10
        this.load.image('Commedia', 'assets/icomune/10/commedia.png');
        this.load.image('Musica', 'assets/icomune/10/musica.png');
        this.load.image('Poesia', 'assets/icomune/10/poesia.png');
        this.load.image('Tecnologia', 'assets/icomune/10/tecnologia.png');
        this.load.image('Tragedia', 'assets/icomune/10/tragedia.png');


        // Carico le dee per le risposte domanda 9
        this.load.image('Vecchio Testamento', 'assets/icomune/09/vecchio-testamento.png');
        this.load.image('Nuovo Testamento', 'assets/icomune/09/nuovo-testamento.png');

        // Carico le dee per le risposte domanda 8
        this.load.image('Oche', 'assets/icomune/08/oche.png');
        this.load.image('Cavalli', 'assets/icomune/08/cavalli.png');
        this.load.image('Cavallucci Marini', 'assets/icomune/08/cavallucci-marini.png');
        this.load.image('Elefanti', 'assets/icomune/08/elefanti.png');
        this.load.image('Pavoni', 'assets/icomune/08/pavoni.png');

        // Carico le dee per le risposte domanda 7
        this.load.image('Afrodite', 'assets/icomune/07/afrodite.png');
        this.load.image('Atena', 'assets/icomune/07/atena.png');
        this.load.image('Dafne', 'assets/icomune/07/dafne.png');
        this.load.image('Demetra', 'assets/icomune/07/demetra.png');
        this.load.image('Teti', 'assets/icomune/07/teti.png');

        // Carico le dee per le risposte domanda 6
        this.load.image('Bovini', 'assets/icomune/06/bovini.png');
        this.load.image('Cavalli', 'assets/icomune/06/cavalli.png');
        this.load.image('Cavallucci Marini', 'assets/icomune/06/cavallucci-marini.png');
        this.load.image('Elefanti', 'assets/icomune/06/elefanti.png');
        this.load.image('Pavoni', 'assets/icomune/06/pavoni.png');

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
        this.load.image('Cancelli Asburgo', 'assets/icomune/03/cancelli-spaccasassi.png');

        // Carico le famiglie per le risposte domanda 2
        this.load.image('Famiglia Acquaviva', 'assets/icomune/02/famiglia-acquaviva.png');
        this.load.image('Famiglia Brunforti', 'assets/icomune/02/famiglia-brunforti.png');
        this.load.image('Famiglia Neroni', 'assets/icomune/02/famiglia-neroni.png');
        this.load.image('Famiglia Savoia', 'assets/icomune/02/famiglia-infriccioli.png');
        this.load.image('Famiglia Cancelli', 'assets/icomune/02/famiglia-cancelli.png');
        this.load.image('Famiglia Campanelli', 'assets/icomune/02/famiglia-campanelli.png');

        // Carico i palazzi per le risposte domanda 1
        this.load.image('Palazzo Acquaviva', 'assets/icomune/01/palazzo-acquaviva.png');
        this.load.image('Palazzo Brunforte', 'assets/icomune/01/palazzo-brunforte.png');
        this.load.image('Palazzo Chigi', 'assets/icomune/01/palazzo-chigi.png');
        this.load.image('Palazzo Chiappini', 'assets/icomune/01/palazzo-chiappini.png');
        this.load.image('Palazzo Campanelli', 'assets/icomune/01/palazzo-campanelli.png');


        // Carica le risorse grafiche
        this.load.image('delusione', 'assets/icomune/delusione.png');
        this.load.image('risposta_esatta', 'assets/icomune/pesca-esulta.png');
        this.load.image('esulto', 'assets/icomune/esultanza-icomume.png');
    }

    create() {
        // Imposta lo sfondo senza riferimenti audio
        this.cameras.main.setBackgroundColor('#FFFBF5');

        // Mostra il pulsante per iniziare il gioco
        this.startButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Start',
            () => {
                if (this.startButton) {
                    this.tweens.add({
                        targets: this.startButton,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => {
                            this.startButton.destroy();
                            this.startButton = null;
                            this.startGame();
                        }
                    });
                }
            }
        );
        // Libera la cache delle immagini quando la scena viene distrutta
        this.events.once(Phaser.Scenes.Events.DESTROY, () => {
            [
                // Domanda 1
                'Palazzo Acquaviva','Palazzo Brunforte','Palazzo Chigi','Palazzo Chiappini','Palazzo Campanelli',
                // Domanda 2
                'Famiglia Acquaviva','Famiglia Brunforti','Famiglia Neroni','Famiglia Savoia','Famiglia Cancelli','Famiglia Campanelli',
                // Domanda 3
                'Cancelli Acquaviva','Cancelli Cancelli','Cancelli Neroni','Cancelli Sforza','Brunforte Cancelli','Cancelli Asburgo',
                // Domanda 4
                'Agamennone e Elena','Amore e Psiche','Artù e Ginevra','Ettore e Andromaca','Giulietta e Romeo','Tristano e Isotta',
                // Domanda 5
                'Dea Teti','Dea Hera','Dea Demetra','Dea Dafne','Dea Atena',
                // Domanda 6
                'Bovini','Cavalli','Cavallucci Marini','Elefanti','Pavoni',
                // Domanda 7
                'Atena','Afrodite','Dafne','Demetra','Teti',
                // Domanda 8
                'Oche','Cavalli','Cavallucci Marini','Elefanti','Pavoni',
                // Domanda 9
                'Vecchio Testamento','Nuovo Testamento',
                // Domanda 10
                'Commedia','Musica','Poesia','Tecnologia','Tragedia',
                // Domanda 11
                ' ','  ','   ','    ',
                // Risorse grafiche comuni
                'delusione','risposta_esatta','esulto'
            ].forEach(key => this.textures.remove(key));
        });
    }

    startGame() {
        this.isPaused = false;
        this.startTime = this.time.now;
        // Avvia la visualizzazione della prima domanda
        this.showQuestion();
    }

    showQuestion() {
        // Rimuovi la domanda precedente se esiste
        if (this.questionText) {
            this.questionText.destroy();
        }
        
        const maxWidth = this.cameras.main.width * 0.95;
        const question = this.questions[this.currentQuestionIndex];

        this.questionText = this.add.text(
            this.cameras.main.centerX,
            0, // Posizione temporanea
            question.question,
            {
                 fontFamily: 'Poppins',
                 fontSize: '18px',
                 color: '#000000',
                 align: 'center',
                 wordWrap: { width: maxWidth, useAdvancedWrap: true }
            }
        ).setOrigin(0.5);
        // Posiziona la domanda in cima, a 50px dal top (considerando anche l'altezza del testo)
        const textBounds = this.questionText.getBounds();
        this.questionText.y = 50 + (textBounds.height / 2);
    
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
    
    if (this.answerElements.length > 0) {
        let minY = Number.MAX_VALUE, maxY = 0;
        this.answerElements.forEach(container => {
            if (container.y < minY) { minY = container.y; }
            if (container.y > maxY) { maxY = container.y; }
        });
        const gridHeight = maxY - minY;
        const offsetY = (this.cameras.main.height - gridHeight) / 2 - minY;
        this.answerElements.forEach(container => {
            container.y += offsetY;
        });
    }
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
                    const correctImage = this.add.image(
                        this.cameras.main.centerX,
                        this.cameras.main.centerY,
                        'risposta_esatta'
                    ).setOrigin(0.5).setAlpha(0);
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
        this.tweens.add({
            targets: container,
            scale: { from: 1, to: 0.5 },
            duration: 500,
            onComplete: () => {
                container.destroy();
                const wrongImage = this.add.image(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY,
                    'delusione'
                ).setOrigin(0.5).setAlpha(0).setDisplaySize(250, 250);
                this.tweens.add({
                    targets: wrongImage,
                    alpha: 1,
                    duration: 200,
                    onComplete: () => {
                        this.time.delayedCall(1000, () => {
                            wrongImage.destroy();
                        });
                    }
                });
            }
        });
    }

    nextQuestion() {
        // Distrugge risorse della domanda precedente e passa alla prossima domanda oppure mostra il messaggio finale
        this.balloons.forEach(balloon => balloon.destroy());
        this.balloons = [];
        this.answerElements.forEach(element => element.destroy());
        this.answerElements = [];
        if (this.questionText) { this.questionText.destroy(); }

        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
            this.showQuestion();
        } else {
            this.showCompletionMessage();
        }
    }

    showCompletionMessage() {
        this.scene.start('FineIcomune', { 
            score: this.score, 
            time: this.time.now - this.startTime 
        });
    }

    formatTime(value) {
        return value.toString().padStart(2, '0');
    }

    // ...other methods eventualmente non modificati...
}


