import Phaser from 'phaser';
import { GameState } from '../stato/GameState.js';
import { createPrimaryButton } from '../utilita/bottonepri.js';

export class SweetPeach extends Phaser.Scene {
    constructor() {
        super({ key: 'SweetPeach' });
        this.score = 0;
        this.correctIngredientsCount = 0;
        this.isDialogOpen = false; // Variabile per tracciare se la finestra di dialogo è aperta
        this.startTime = 0; // Aggiunto per tracciare il tempo di gioco
    }

    preload() {
        // Carico le immagini
        this.load.image('credenza', 'assets/sweetpeach/credenza-vuota.png');
        this.load.image('cesto', 'assets/sweetpeach/cesto-vimini.png');
        this.load.image('correctFeedback', 'assets/sweetpeach/pesca-esulta.png');
        this.load.image('wrongFeedback', 'assets/sweetpeach/pesca-sbaglia.png');
        this.load.image('pavimento', 'assets/sweetpeach/pavimento-rid.png');

        // Carico gli ingredienti
        this.load.image('500g di farina', 'assets/sweetpeach/farina.png');
        this.load.image('200g di zucchero', 'assets/sweetpeach/zucchero.png');
        this.load.image('100g di burro', 'assets/sweetpeach/burro.png');
        this.load.image('100ml di latte', 'assets/sweetpeach/latte.png');
        this.load.image('80g di sale', 'assets/sweetpeach/sale.png');
        this.load.image('100ml d\'olio', 'assets/sweetpeach/olio.png');
        this.load.image('200ml di detersivo', 'assets/sweetpeach/detersivo.png');
        this.load.image('tre uova', 'assets/sweetpeach/uova.png');
        this.load.image('bustina di lievito', 'assets/sweetpeach/lievito.png');
    }

    create() {  
        // tracciamo il tempo di gioco
        this.startTime = this.time.now;

        // Aggiungi l'immagine "pavimento" come sfondo
        const bg = this.add.image(0, 0, 'pavimento').setOrigin(0);
        bg.displayWidth = this.cameras.main.width;
        bg.displayHeight = this.cameras.main.height;
        bg.setDepth(-1);

        // Imposta il colore di sfondo
        this.cameras.main.setBackgroundColor('#FFFBF5');

        // Definisci posizioni fisse in base alle dimensioni iniziali (non cambiano in seguito)
        const fixedCenterX = 195;   // Per esempio, se lo schermo è 800px
        const fixedCenterY = 340;   // Se lo schermo è 600px

        // Posiziona la credenza in modo fisso
        this.credenza = this.add.image(fixedCenterX, fixedCenterY - 100, 'credenza').setOrigin(0.5);
        
        // Posiziona il cesto in basso usando la dimensione dinamica della camera
        this.cesto = this.add.image(
            fixedCenterX, 
            this.cameras.main.height - 70,  // 50px di margine dal fondo
            'cesto'
        ).setOrigin(0.5).setScale(0.9); // Ridotto del 10%

        // Definisci la zona di fermata del cesto in base alla nuova posizione Y
        this.cesto.zoneDiFermata = new Phaser.Geom.Rectangle(
            fixedCenterX - 50,
            this.cameras.main.height - 50 - 110,  // 110px sopra il fondo (riguardo all'altezza del cesto)
            100,
            60
        );

        // Definizione degli ingredienti con posizioni fisse
        this.ingredients = [
            { key: '500g di farina', x: 80, y: 97, isCorrect: true, scale: 0.5 },
            { key: '200g di zucchero', x: 150, y: 90, isCorrect: true, scale: 0.5 },
            { key: '100g di burro', x: 250, y: 105, isCorrect: true, scale: 0.5 },
            { key: '100ml di latte', x: 350, y: 88, isCorrect: true, scale: 0.5 },
            { key: '80g di sale', x: 60, y: 200, isCorrect: false, scale: 0.3 },
            { key: '100ml d\'olio', x: 130, y: 180, isCorrect: false, scale: 0.5 },
            { key: '200ml di detersivo', x: 200, y: 190, isCorrect: false, scale: 0.4 },
            { key: 'tre uova', x: 260, y: 200, isCorrect: true, scale: 0.4 },
            { key: 'bustina di lievito', x: 330, y: 210, isCorrect: true, scale: 0.3 }
        ];

        // Crea gli ingredienti in posizioni fisse
        this.ingredients.forEach(ingredient => {
            ingredient.sprite = this.add.image(ingredient.x, ingredient.y, ingredient.key)
                .setInteractive()
                .setScale(ingredient.scale);
            ingredient.sprite.setData('ingredient', ingredient);
            ingredient.sprite.on('pointerdown', () => {
                if (!this.isDialogOpen) {
                    this.showConfirmationPanel(ingredient.sprite);
                }
            });
        });

        // NON regisatrate alcun listener di resize, in modo che le posizioni restino fisse.
        // this.scale.on('resize', this.resize, this);  // <- Rimosso

        this.updateScore();
    }
        

    showConfirmationPanel(ingredient) {
        const ingredientData = ingredient.getData('ingredient');

        // Imposta la variabile per indicare che la finestra di dialogo è aperta
        this.isDialogOpen = true;

        // Crea il pannello di conferma con bordo e angoli arrotondati
        const panelGraphics = this.add.graphics();
        const panelWidth = 300;
        const panelHeight = 300; // Aumenta l'altezza per ospitare i pulsanti uno sopra l'altro
        const panelX = this.cameras.main.centerX - panelWidth / 2;
        const panelY = this.cameras.main.centerY - panelHeight / 2;

        panelGraphics.lineStyle(2, 0x343434, 1);
        panelGraphics.fillStyle(0xFFFBF5, 0.9);
        panelGraphics.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);
        panelGraphics.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);

        const text = this.add.text(
            this.cameras.main.centerX, 
            this.cameras.main.centerY - 70, 
            `Vuoi aggiungere ${ingredientData.key}?`, 
            {
            fontFamily: 'Poppins',
            fontSize: '20px',
            color: '#000000',
            // Imposta il wordWrap a 60% della larghezza della camera
            wordWrap: { width: this.cameras.main.width * 0.6, useAdvancedWrap: true }
        }).setOrigin(0.5);

        // Bottone "Sì"
        const yesButton = createPrimaryButton(this, this.cameras.main.centerX, this.cameras.main.centerY + 15, 'Sì', () => {
            this.handleIngredientSelection(ingredient, ingredientData.isCorrect);
            panelGraphics.destroy();
            text.destroy();
            yesButton.destroy();
            noButton.destroy();
            this.isDialogOpen = false; // Chiudi la finestra di dialogo
        });

        // Bottone "No"
        const noButton = createPrimaryButton(this, this.cameras.main.centerX, this.cameras.main.centerY + 90, 'No', () => {
            panelGraphics.destroy();
            text.destroy();
            yesButton.destroy();
            noButton.destroy();
            this.isDialogOpen = false; // Chiudi la finestra di dialogo
        });
    }

    handleIngredientSelection(ingredient, isCorrect) {
        if (isCorrect) {
            this.score += 1000;
            this.correctIngredientsCount++;

            // Anima la caduta nel cesto con crescita del 20% di dimensione
            this.tweens.add({
                targets: ingredient,
                x: this.cesto.x,
                y: Math.min(this.cesto.y - 30, this.cameras.main.height - 350),
                scaleX: ingredient.scale * 1.2,
                scaleY: ingredient.scale * 1.2,
                duration: 500,
                onComplete: () => {
                    // Posiziona l'ingrediente in una posizione casuale all'interno della zona di fermata
                    const randomX = Phaser.Math.Between(this.cesto.zoneDiFermata.left, this.cesto.zoneDiFermata.right);
                    const randomY = Phaser.Math.Between(this.cesto.zoneDiFermata.top, this.cesto.zoneDiFermata.bottom);
                    ingredient.setPosition(randomX, randomY);

                    // Disabilita immediatamente l'interattività
                    ingredient.disableInteractive();
                    
                    this.showFeedback('correctFeedback');
                }
            });
        } else {
            this.score -= 200;
            this.showFeedback('wrongFeedback');
        }

        // Aggiorna il punteggio
        this.updateScore();

        // Controlla se tutti gli ingredienti corretti sono stati presi
        if (this.correctIngredientsCount === 6) {
             // Calcola il tempo trascorso in secondi
             const timeElapsed = this.time.now - this.startTime;
             const timeInSeconds = Math.floor(timeElapsed / 1000);

             // Sottrai il tempo dal punteggio finale (1 punto per secondo)
            const finalScore = this.score - timeInSeconds;

            this.time.delayedCall(1500, () => 
                this.scene.start('FineSweetPeach', { 
                    score: finalScore, 
                    time: timeElapsed  
                })
            );
        }
    }

    showFeedback(type) {
        const feedback = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, type).setOrigin(0.5).setScale(0.5);
        this.tweens.add({
            targets: feedback,
            alpha: { from: 1, to: 0 },
            duration: 1000,
            onComplete: () => feedback.destroy()
        });
    }

    updateScore() {
        // Score update now handled via GameState.
        // Removed HTML div update.
    }

}


