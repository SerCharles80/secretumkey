import { createPrimaryButton } from '../utilita/bottonepri.js';
import Phaser from 'phaser';

const SlidingPuzzle = {
    ALLOW_CLICK: 0,
    TWEENING: 1
};

export class FlagPuzzle extends Phaser.Scene
{
    constructor ()
    {
        super({key:'FlagPuzzle'});

        // Aggiungi questa riga per tenere traccia del round corrente
        this.currentRound = 1;

        // Questi sono tutti impostati nella funzione startPuzzle
        this.rows = 0;
        this.columns = 0;

        // La larghezza e l'altezza di ogni pezzo del puzzle.
        // Anche questi sono impostati automaticamente in startPuzzle.
        this.pieceWidth = 0;
        this.pieceHeight = 0;

        this.pieces = null;
        this.spacer = null;

        // La velocità con cui i pezzi scorrono e il tween che usano
        this.slideSpeed = 300;
        this.slideEase = 'power3';

        // Il numero di iterazioni che il camminatore del puzzle eseguirà quando
        // mescola il puzzle. 10 è un puzzle facile, ma
        // aumenta il numero per puzzle molto più difficili.
        this.iterations = 9;

        // La velocità con cui i pezzi vengono mescolati all'inizio. Questo permette
        // al giocatore di vedere il puzzle prima di provare a risolverlo. Tuttavia, se
        // non vuoi questo, imposta semplicemente la velocità a zero e apparirà
        // istantaneamente 'mescolato'.
        this.shuffleSpeed = 200;
        this.shuffleEase = 'power1';

        this.lastMove = null;

        // L'immagine nella Cache da utilizzare per il puzzle.
        // Impostato nella funzione startPuzzle.
        this.photo = '';

        this.slices = [];

        this.action = SlidingPuzzle.ALLOW_CLICK;
        this.startTime = 0;
    }

    preload ()
    {
        this.load.image('background', 'assets/flagpuzzle/agricoltura300.jpg');
        this.load.image('logo', 'assets/flagpuzzle/agricoltura300.jpg');
        this.load.image('box', 'assets/flagpuzzle/agricoltura300.jpg');
        this.load.image('box-inside', 'assets/flagpuzzle/agricoltura300.jpg');
        this.load.image('pic1', 'assets/flagpuzzle/agricoltura300.jpg');
        this.load.image('pic2', 'assets/flagpuzzle/arancione300.png');
        this.load.image('pic3', 'assets/flagpuzzle/verde-arancione.png');
    }

    create ()
    {
        this.reveal = null; // O this.add.image(...).setAlpha(0); se vuoi un placeholder invisibile
        window.solve = () => {
            this.nextRound();
        };

        // Aggiungi il titolo per la prima immagine
    this.titleText = this.add.text(
        this.cameras.main.centerX,
        80, // Posizione Y dall'alto
        'Bandiera Verde dell\'Agricoltura',
        {
            fontFamily: 'Poppins',
            fontSize: '24px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: this.cameras.main.width * 0.8 }
        }
    ).setOrigin(0.5);

        // Mostra l'immagine intera del puzzle
        this.fullImage = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 50,
            'pic1'
        ).setOrigin(0.5);

        // Crea il pulsante "Inizia" sotto l'immagine del puzzle
        this.startButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + this.fullImage.displayHeight / 2 + 50,
            'Inizia',
            () => {
                console.log("Pulsante Inizia premuto! Avvio del puzzle...");
                this.fullImage.destroy(); // Rimuovi l'immagine intera
                this.startPuzzle('pic1', 3, 3); // Avvia il puzzle con l'immagine 'pic1'
                this.startButton.destroy(); // Rimuovi il pulsante dopo l'avvio del puzzle
                this.startTime = this.time.now; // Inizia il timer
            }
        );

        // Aggiungi la deregistrazione di window.solve on shutdown:
        this.events.on('shutdown', () => {
            delete window.solve;
        });
    }

    /**
     * Questa funzione è responsabile della costruzione del puzzle.
     * Prende una chiave immagine e una larghezza e altezza del puzzle (in pezzi, non pixel).
     * Leggi i commenti all'interno di questa funzione per scoprire cosa succede.
     */
    startPuzzle (key, rows, columns)
    {
        this.photo = key;

        // La dimensione del puzzle, in pezzi (non pixel)
        this.rows = rows;
        this.columns = columns;

        // La dimensione dell'immagine sorgente
        const texture = this.textures.getFrame(key);

        const photoWidth = texture.width;
        const photoHeight = texture.height;

        // Crea i pezzi scorrevoli

        // Ogni pezzo avrà questa dimensione:
        const pieceWidth = photoWidth / rows;
        const pieceHeight = photoHeight / columns;

        this.pieceWidth = pieceWidth;
        this.pieceHeight = pieceHeight;
        

        // Un Container per mettere i pezzi
        if (this.pieces)
        {
            this.pieces.removeAll(true);
        }
        else
        {
            // La posizione imposta l'angolo in alto a sinistra del container da cui i pezzi si espandono verso il basso
            this.pieces = this.add.container(
                this.cameras.main.centerX - (pieceWidth * rows) / 2,
                this.cameras.main.centerY - (pieceHeight * columns) / 2
            );
        }

        // Un array per mettere le texture dei pezzi
        if (this.slices)
        {
            this.slices.forEach(slice => slice.destroy());

            this.slices = [];
        }

        let i = 0;

        // Cicla attraverso l'immagine e crea un nuovo Sprite per ogni pezzo del puzzle.
        for (let y = 0; y < this.columns; y++)
        {
            for (let x = 0; x < this.rows; x++)
            {
                // Genera una chiave univoca per ogni texture dinamica
                const sliceKey = `slice_${this.photo}_${i}`; // <---- Modifica qui
                // Rimuovi le vecchie texture

                const slice = this.textures.addDynamicTexture(`slice${i}`, pieceWidth, pieceHeight);

                const ox = 0 + (x / this.rows);
                const oy = 0 + (y / this.columns);

                slice.stamp(key, null, 0, 0, { originX: ox, originY: oy });

                this.slices.push(slice);

                const piece = this.add.image(x * pieceWidth, y * pieceHeight, `slice${i}`);

                piece.setOrigin(0, 0);

                // La riga e la colonna attuali del pezzo
                // Memorizza la riga e la colonna in cui il pezzo _dovrebbe_ essere, quando il puzzle è risolto
                piece.setData({
                    row: x,
                    column: y,
                    correctRow: x,
                    correctColumn: y
                });

                piece.setInteractive();

                piece.on('pointerdown', () => this.checkPiece(piece));

                this.pieces.add(piece);

                i++;
            }
        }

        // L'ultimo pezzo sarà il nostro 'spacer' per scorrere
        this.spacer = this.pieces.getAt(this.pieces.length - 1);
        this.spacer.alpha = 0;

        this.lastMove = null;

        this.shufflePieces();
    }

    /**
     * Questo mescola il nostro puzzle.
     *
     * Non possiamo semplicemente 'randomizzare' le tessere, altrimenti il puzzle sarà
     * irrisolvibile il 50% delle volte. Quindi invece lo camminiamo, facendo mosse casuali non ripetitive.
     */
    shufflePieces ()
    {
        // Inserisci tutte le mosse disponibili in questo array
        const moves = [];

        const spacerCol = this.spacer.data.get('column');
        const spacerRow = this.spacer.data.get('row');

        if (spacerCol > 0 && this.lastMove !== Phaser.DOWN)
        {
            moves.push(Phaser.UP);
        }

        if (spacerCol < this.columns - 1 && this.lastMove !== Phaser.UP)
        {
            moves.push(Phaser.DOWN);
        }

        if (spacerRow > 0 && this.lastMove !== Phaser.RIGHT)
        {
            moves.push(Phaser.LEFT);
        }

        if (spacerRow < this.rows - 1 && this.lastMove !== Phaser.LEFT)
        {
            moves.push(Phaser.RIGHT);
        }

        // Scegli una mossa a caso dall'array
        this.lastMove = Phaser.Utils.Array.GetRandom(moves);

        // Poi sposta il 'spacer' nella nuova posizione
        switch (this.lastMove)
        {
            case Phaser.UP:
                this.swapPiece(spacerRow, spacerCol - 1);
                break;

            case Phaser.DOWN:
                this.swapPiece(spacerRow, spacerCol + 1);
                break;

            case Phaser.LEFT:
                this.swapPiece(spacerRow - 1, spacerCol);
                break;

            case Phaser.RIGHT:
                this.swapPiece(spacerRow + 1, spacerCol);
                break;
        }
    }

    /**
     * Scambia il 'spacer' con il pezzo nella riga e colonna specificate.
     */
    swapPiece (row, column)
    {
        // La riga e la colonna sono la nuova destinazione del 'spacer'

        const piece = this.getPiece(row, column);

        const spacer = this.spacer;
        const x = spacer.x;
        const y = spacer.y;

        piece.data.values.row = spacer.data.values.row;
        piece.data.values.column = spacer.data.values.column;

        spacer.data.values.row = row;
        spacer.data.values.column = column;

        spacer.setPosition(piece.x, piece.y);

        if (this.shuffleSpeed === 0)
        {
            piece.setPosition(x, y);

            if (this.iterations > 0)
            {
                this.iterations--;

                this.shufflePieces();
            }
            else
            {
                this.startPlay();
            }
        }
        else
        {
            const tween = this.tweens.add({
                targets: piece,
                x,
                y,
                duration: this.shuffleSpeed,
                ease: this.shuffleEase
            });

            if (this.iterations > 0)
            {
                this.iterations--;

                tween.on('complete', this.shufflePieces, this);
            }
            else
            {
                tween.on('complete', this.startPlay, this);
            }
        }
    }

    /**
     * Ottiene il pezzo nella riga e colonna specificate.
     */
    getPiece (row, column)
    {
        for (let i = 0; i < this.pieces.length; i++)
        {
            const piece = this.pieces.getAt(i);

            if (piece.data.get('row') === row && piece.data.get('column') === column)
            {
                return piece;
            }
        }

        return null;
    }

    /**
     * Imposta lo stato del gioco per consentire all'utente di fare clic.
     */
    startPlay ()
    {
        this.action = SlidingPuzzle.ALLOW_CLICK;
    }

    /**
     * Chiamato quando l'utente fa clic su uno qualsiasi dei pezzi del puzzle.
     * Controlla prima se il pezzo è adiacente al 'spacer', altrimenti esce.
     * Se lo è, i due pezzi vengono scambiati chiamando `this.slidePiece`.
     */
    checkPiece (piece)
    {
        if (this.action !== SlidingPuzzle.ALLOW_CLICK)
        {
            return;
        }

        const spacer = this.spacer;

        // Calcola la distanza tra il pezzo cliccato e lo spazio vuoto
        const distance = Math.abs(piece.data.values.row - spacer.data.values.row) + Math.abs(piece.data.values.column - spacer.data.values.column);

        // Permetti lo spostamento anche se non è adiacente
        if (distance > 0)
        {
            const targetRow = spacer.data.values.row;
            const targetColumn = spacer.data.values.column;

            spacer.data.values.row = piece.data.values.row;
            spacer.data.values.column = piece.data.values.column;

            piece.data.values.row = targetRow;
            piece.data.values.column = targetColumn;

            this.slidePiece(piece, spacer.x, spacer.y);
            spacer.setPosition(piece.x, piece.y);
        }
    }

    /**
     * Fa scorrere il pezzo nella posizione precedentemente occupata dal 'spacer'.
     * Utilizza un tween (vedi slideSpeed e slideEase per i controlli).
     * Quando completo, chiama tweenOver.
     */
    slidePiece (piece, x, y)
    {
        this.action = SlidingPuzzle.TWEENING;

        this.tweens.add({
            targets: piece,
            x,
            y,
            duration: this.slideSpeed,
            ease: this.slideEase,
            onComplete: () => this.tweenOver()
        });
    }

    /**
     * Chiamato quando un pezzo finisce di scorrere nella sua posizione.
     * Controlla prima se il puzzle è risolto. In caso contrario, consente al giocatore di continuare.
     */
    tweenOver ()
    {
        let outOfSequence = false;
        this.iterations = 6; // Resetta le iterazioni
        this.lastMove = null;  // Resetta l'ultima mossa

        this.pieces.each(piece => {
            if (
                piece.data.values.correctRow !== piece.data.values.row ||
                piece.data.values.correctColumn !== piece.data.values.column
            ) {
                outOfSequence = true;
            }
        });
        
        if (outOfSequence) {
            this.action = SlidingPuzzle.ALLOW_CLICK;
        } else {
            // Utilizza solo transizioni visive (fade, tween) senza chiamate audio
            this.tweens.add({
                targets: this.spacer,
                alpha: 1,
                duration: this.slideSpeed * 2,
                ease: 'linear',
                onComplete: () => this.nextRound()
            });
            this.pieces.each(piece => {
                piece.setPostPipeline('ShinePostFX');
            });
        }
    }

    nextRound() {
        // Incrementa il round
        this.currentRound++;
    
        // Se abbiamo completato tutti i 3 round, termina il gioco
        if (this.currentRound >= 4) {
            this.calculateScore();
            return;
        }
    
        let size, iterations, nextPhoto;
    
        // Imposta le variabili in base al round corrente
        if (this.currentRound === 2) {
            nextPhoto = 'pic2';  // Assicurati che 'pic2' sia stato caricato in preload()
            size = 3;            // Dimensione della griglia: 3x3 (modifica se desideri)
            iterations = 6;      // Numero di mosse per lo shuffle
        }
        else if (this.currentRound === 3) {
            nextPhoto = 'pic3';  // Assicurati che 'pic3' sia stato caricato in preload()
            size = 3;            // Dimensione della griglia: 3x3 (o altra se preferisci)
            iterations = 6;
        }

        let title;
        if (this.currentRound === 2) {
            nextPhoto = 'pic2';
            size = 3;
            iterations = 6;
            title = 'Bandiera Arancione per il Borgo Storico';
        }
        else if (this.currentRound === 3) {
            nextPhoto = 'pic3';
            size = 3;
            iterations = 6;
            title = 'I riconoscimenti di Acquaviva Picena';
        }
    
        // Aggiorna il testo del titolo
        if (this.titleText) {
            this.titleText.setText(title);
        } else {
            this.titleText = this.add.text(
                this.cameras.main.centerX,
                80,
                title,
                {
                    fontFamily: 'Poppins',
                    fontSize: '24px',
                    color: '#000000',
                    align: 'center',
                    wordWrap: { width: this.cameras.main.width * 0.8 }
                }
            ).setOrigin(0.5);
        }
    
        // Mostra l'immagine completa per permettere al giocatore di memorizzarla
        // Aggiunge l'immagine al centro dello schermo
        let fullImage = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            nextPhoto
        ).setOrigin(0.5);
    
        // Aggiungi il testo del countdown sopra l'immagine
        let countdownText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            '3',
            { fontSize: '64px', fill: '#fff' }
        ).setOrigin(0.5);
    
        let countdown = 3;
        this.time.addEvent({
            delay: 1000,
            repeat: 2, // Il callback verrà chiamato 3 volte (3, 2, 1)
            callback: () => {
                countdown--;
                if (countdown > 0) {
                    countdownText.setText(countdown.toString());
                } else {
                    // Alla fine del countdown, rimuove il testo e l'immagine,
                    // aggiorna le variabili e avvia il nuovo puzzle
                    countdownText.destroy();
                    fullImage.destroy();
    
                    this.photo = nextPhoto;
                    this.iterations = iterations;
    
                    this.startPuzzle(nextPhoto, size, size);
                }
            },
            callbackScope: this
        });
    }

    calculateScore() {
        // Calcola il tempo trascorso in millisecondi
        const timeElapsed = this.time.now - this.startTime;
        // Calcola il punteggio base meno il tempo in secondi
        const baseScore = 10000;
        const finalScore = Math.max(0, Math.ceil(baseScore - (timeElapsed / 1000)));

        // Passa solo punteggio e tempo alla scena finale
        this.scene.start('FineFlagPuzzle', { 
            score: finalScore, 
            time: timeElapsed 
        });
    }
}