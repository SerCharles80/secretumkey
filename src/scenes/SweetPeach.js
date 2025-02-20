import Phaser from 'phaser';
import { GameState } from '../stato/GameState.js';
import { createPrimaryButton } from '../utilita/bottonepri.js';

export class SweetPeach extends Phaser.Scene {
    constructor() {
        super({ key: 'SweetPeach' });
        this.score = 0;
        this.correctIngredientsCount = 0;
        this.isDialogOpen = false; // Variabile per tracciare se la finestra di dialogo è aperta
    }

    preload() {
        // Carico le immagini
        this.load.image('credenza', 'assets/sweetpeach/credenza-vuota.png');
        this.load.image('cesto', 'assets/sweetpeach/cesto-vimini.png');
        this.load.image('correctFeedback', 'assets/sweetpeach/pesca-esulta.png');
        this.load.image('wrongFeedback', 'assets/sweetpeach/pesca-sbaglia.png');

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
        
        // Imposta il colore di sfondo
        this.cameras.main.setBackgroundColor('#FFFBF5');

        // Aggiungi l'immagine della credenza e mantienila fissa
        this.credenza = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'credenza').setOrigin(0.5);

        

        // Crea il cesto in basso
        this.cesto = this.add.image(this.cameras.main.centerX, this.cameras.main.height - 50, 'cesto').setOrigin(0.5).setScale(1);

        // Definisci la zona di fermata nel cesto (valori da adattare in base alla tua immagine)
        this.cesto.zoneDiFermata = new Phaser.Geom.Rectangle(
            this.cesto.x - 50, // X iniziale della zona
            this.cesto.y - 80, // Y iniziale della zona
            100, // Larghezza della zona
            60  // Altezza della zona
        );

        // Definizione degli ingredienti
        this.ingredients = [
            { key: '500g di farina', x: 80, y: 97, isCorrect: true, scale:0.5 },
            { key: '200g di zucchero', x: 150, y: 90, isCorrect: true, scale:0.5 },
            { key: '100g di burro', x: 250, y: 105, isCorrect: true, scale:0.5 },
            { key: '100ml di latte', x: 350, y: 88, isCorrect: true, scale:0.5 },
            { key: '80g di sale', x: 60, y: 200, isCorrect: false, scale:0.3},
            { key: '100ml d\'olio', x: 130, y: 180, isCorrect: false, scale:0.5 },
            { key: '200ml di detersivo', x: 200, y: 190, isCorrect: false, scale:0.4 }, // Ingrediente errato
            { key: 'tre uova', x: 260, y: 200, isCorrect: true, scale:0.4 },
            { key: 'bustina di lievito', x: 330, y: 210, isCorrect: true, scale:0.3 }
        ];

        // Salva il centro iniziale della scena
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.ingredients.forEach(ingredient => {
            // Calcola l'offset rispetto al centro iniziale
            const offsetX = ingredient.x - centerX;
            const offsetY = ingredient.y - centerY;
            // Salva l'offset nell'oggetto ingrediente per usarlo in fase di resize
            ingredient.offsetX = offsetX;
            ingredient.offsetY = offsetY;
            
            // Crea lo sprite posizionandolo in base al centro attuale + offset
            ingredient.sprite = this.add.image(centerX + offsetX, centerY + offsetY, ingredient.key)
                .setInteractive()
                .setScale(ingredient.scale);
            
            // Salva i dati dell'ingrediente nello sprite
            ingredient.sprite.setData('ingredient', ingredient);
            
            // Imposta l'evento di interazione
            ingredient.sprite.on('pointerdown', () => {
                if (!this.isDialogOpen) { // Controlla se la finestra di dialogo è aperta
                    this.showConfirmationPanel(ingredient.sprite);
                }
            });
        });
            

         // Aggiungi un listener per l'evento di ridimensionamento della finestra
         this.scale.on('resize', this.resize, this);

        // Punteggio iniziale
        this.updateScore();
    }

    resize(gameSize, baseSize, displaySize, resolution) {
        const width = gameSize.width;
        const height = gameSize.height;
    
        // Ridimensiona la camera
        this.cameras.resize(width, height);
    
        // Nuovo centro della camera
        const newCenterX = this.cameras.main.centerX;
        const newCenterY = this.cameras.main.centerY;
    
        // Riposiziona la credenza (se necessario)
        this.credenza && this.credenza.setPosition(newCenterX, newCenterY - 100);
    
        // Riposiziona il cesto
        this.cesto.setPosition(newCenterX, this.cameras.main.height - 50);
    
        // Riposiziona gli ingredienti usando gli offset salvati
        this.ingredients.forEach(ingredient => {
            if (ingredient.sprite) {
                ingredient.sprite.setPosition(newCenterX + ingredient.offsetX, newCenterY + ingredient.offsetY);
            }
        });
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
            this.cameras.main.centerY - 60, 
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

            // Anima la caduta nel cesto
            this.tweens.add({
                targets: ingredient,
                x: this.cesto.x,
                y: this.cesto.y - 30,
                duration: 500,
                onComplete: () => {
                    // Posiziona l'ingrediente in una posizione casuale all'interno della zona di fermata
                    const randomX = Phaser.Math.Between(this.cesto.zoneDiFermata.left, this.cesto.zoneDiFermata.right);
                    const randomY = Phaser.Math.Between(this.cesto.zoneDiFermata.top, this.cesto.zoneDiFermata.bottom);

                    ingredient.setPosition(randomX, randomY);

                    // Disabilita *immediatamente* l'interattività
                    ingredient.disableInteractive();
                    
                    //ingredient.destroy();
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
            this.time.delayedCall(1500, () => this.scene.start('FineSweetPeach', { score: this.score }));
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
        const scoreDiv = document.getElementById('PunteggioTotaleDiv');
        if (scoreDiv) {
            scoreDiv.innerText = `Punteggio: ${GameState.getScore() + this.score}`;
        }
    }

}


