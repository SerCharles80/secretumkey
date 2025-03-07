import Phaser from 'phaser';
import { createPrimaryButton } from '../utilita/bottonepri.js';

export class SponsaliaDeco extends Phaser.Scene {
    constructor() {
        super({ key: 'SponsaliaDeco' });
        this.score = 0;
        this.startTime = 0;
        this.isPlaying = false;
        this.items = [
            { key: 'item1', name: 'Vestito elegante', correct: true },
            { key: 'item2', name: 'Vestito da Sposa', correct: true },
            { key: 'item3', name: 'Vestaglia da notte', correct: true },
            { key: 'item4', name: 'Cappello di seta', correct: true },
            { key: 'item5', name: 'Detersivo piatti', correct: false },
            { key: 'item6', name: 'Anello ducale', correct: true },
            { key: 'item7', name: 'Vestaglia elegante', correct: true },
            { key: 'item8', name: 'Cavatappi', correct: false },
            { key: 'item9', name: 'Lenzuola di seta', correct: true },
            { key: 'item10', name: 'Collana d\'oro', correct: true },
            { key: 'item11', name: 'Fionda da caccia', correct: false },
            { key: 'item12', name: 'Mantello da pioggia', correct: true },
            { key: 'item13', name: 'Vestito da ballo', correct: true },
            { key: 'item14', name: 'Lenzuola di raso', correct: true },
            { key: 'item15', name: 'Orecchini d\'oro', correct: true },
            { key: 'item16', name: 'Caricabatterie smartphone', correct: false }
        ];
        this.currentItems = [];
        this.correctItemsFound = 0;
        this.totalCorrectItems = this.items.filter(item => item.correct).length;
    }

    preload() {
        // Carica le immagini necessarie
        this.items.forEach(item => {
            this.load.image(item.key, `assets/sponsalia/oggetti/${item.key}.png`);
        });
        this.load.image('approval', 'assets/sponsalia/oggetto-giusto.png');
        this.load.image('error', 'assets/sponsalia/oggetto-errato.png');
        this.load.image('sfondoIstruzioni', 'assets/sponsalia/sfondo-banchetto-sponsalia-rid.png');
        this.load.image('sfondoGioco', 'assets/sponsalia/pergamena-sponsalia-rid.png');

        //immagini header pergamena
        this.load.image('sponsaliaHeader', 'assets/sponsalia/corredo-scritta-medioevo.png');
    }   

    create() {
        this.cameras.main.setBackgroundColor('#FFFBF5');

        // Aggiungi l'immagine di sfondo
        const background = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'sfondoIstruzioni'
        ).setOrigin(0.5);


        // Adatta l'immagine di sfondo allo schermo
        const scaleX = this.cameras.main.width / background.width;
        const scaleY = this.cameras.main.height / background.height;
        const scale = Math.max(scaleX, scaleY);
        background.setScale(scale).setAlpha(0.8); // Imposta una trasparenza per leggibilità

        // Salva il riferimento allo sfondo
        this.initialElements = [background];

        // Crea il pannello con il testo iniziale
        const textPanel = this.add.graphics();
        textPanel.fillStyle(0xFFFFFF, 0.9);
        textPanel.lineStyle(2, 0x00AAFF);
        
        const panelWidth = this.cameras.main.width * 0.8;
        const panelHeight = 150;

        // Calcola la posizione Y per centrare verticalmente
        const panelX = (this.cameras.main.width - panelWidth) / 2;
        const panelY = (this.cameras.main.height - panelHeight) / 3;
        
        textPanel.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);
        textPanel.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 15);

        // Salva i riferimenti agli elementi iniziali
        this.initialElements = [];
        this.initialElements.push(textPanel);
        
        // Aggiungi il pannello agli elementi iniziali
        this.initialElements.push(textPanel);

        const instructionText = this.add.text(
            this.cameras.main.centerX,
            panelY + panelHeight/2,
            "Seleziona il corredo giusto per Forastiera, deve sposare Rinaldo e questo matrimonio è molto importante per la famiglia degli Acquaviva!",
            {
                fontFamily: 'Poppins',
                fontSize: '18px',
                color: '#000000',
                align: 'center',
                wordWrap: { width: panelWidth - 40 }
            }
        ).setOrigin(0.5);

        // Aggiungi il testo agli elementi iniziali
        this.initialElements.push(instructionText);

        // Crea il pulsante di avvio
        this.startButton = createPrimaryButton(
            this,
            this.cameras.main.centerX,
            panelY + panelHeight + 50,
            'Inizia',
            () => this.startGame()
        );
    }

    startGame() {
        this.isPlaying = true;
        this.startTime = this.time.now;

        // Fade out e distruzione degli elementi iniziali
        this.tweens.add({
            targets: [...this.initialElements, this.startButton],
            alpha: 0,
            duration: 500,
            onComplete: () => {
                // Distruggi gli elementi in modo sicuro
                this.initialElements.forEach(element => {
                    if (element && element.destroy) {
                        element.destroy();
                    }
                });
                if (this.startButton && this.startButton.destroy) {
                    this.startButton.destroy();
                }
                this.showGameElements();
            }
        });
    }

    showGameElements() {
        // Mostra lo sfondo della pergamena con fade in
        const background = this.add.image(
            this.cameras.main.centerX, 
            this.cameras.main.centerY, 
            'sfondoGioco'
        )
        .setOrigin(0.5)
        .setAlpha(0);
    
        // Adatta la pergamena allo schermo
        const scaleX = this.cameras.main.width / background.width;
        const scaleY = this.cameras.main.height / background.height;
        const scale = Math.max(scaleX, scaleY);
        background.setScale(scale);

        // Aggiungi l'immagine header
        const headerImage = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.height * 0.25, // Posiziona a 1/4 dell'altezza dello schermo
            'sponsaliaHeader'
        ).setOrigin(0.5);

        // Salva la reference dell'header per usarla in showItems
        this.headerImage = headerImage;
        headerImage.setAlpha(0);

        // Ridimensiona l'header al 70% della larghezza dello schermo
        const headerWidth = this.cameras.main.width * 0.7;
        const headerScale = headerWidth / headerImage.width;
        headerImage.setScale(headerScale);
        
        // Fade in della nuova immagine di sfondo
        this.tweens.add({
            targets: [background, headerImage],
            alpha: 1,
            duration: 500,
            onComplete: () => this.showItems()
        });
    }
    showItems() {
        // Seleziona 7 oggetti random dalla lista
        this.currentItems = Phaser.Utils.Array.Shuffle(this.items.slice())
            .slice(0, 5);
    
        // Calcola l'altezza totale della lista
        const itemHeight = 50;
        const spacing = 1; // Spazio tra gli elementi
        const totalHeight = (this.currentItems.length * itemHeight) + ((this.currentItems.length - 1) * spacing);
        
        // Calcola la posizione iniziale considerando l'header
        const startY = this.headerImage.y + (this.headerImage.displayHeight / 2) + 30;
        
        // Posiziona gli oggetti in colonna centrata
        this.currentItems.forEach((item, index) => {
            const y = startY + (index * (itemHeight + spacing));
            
            // Crea il contenitore per l'oggetto
            const container = this.add.container(this.cameras.main.centerX - 120, y);

            // Aggiungi l'immagine dell'oggetto
            const image = this.add.image(0, 0, item.key)
                .setDisplaySize(50, 50);
    
            // Aggiungi il testo dell'oggetto
            const text = this.add.text(30, 0, item.name, {
                fontFamily: 'Poppins',
                fontSize: '18px',
                color: '#000000'
            }).setOrigin(0, 0.5);
    
            container.add([image, text]);
            container.setInteractive(new Phaser.Geom.Rectangle(0, -25, text.width + 70, 50), 
                Phaser.Geom.Rectangle.Contains);
    
            container.on('pointerdown', () => this.selectItem(item, container));
        });
    }

    selectItem(item, container) {
        if (!this.isPlaying) return;
    
        if (item.correct) {
            this.score += 150;
            this.correctItemsFound++;
            this.showFeedback('approval', container);
        } else {
            this.score -= 50;
            this.showFeedback('error', container);
        }
    
        // Rimuovi l'oggetto dalla lista corrente
        this.currentItems = this.currentItems.filter(i => i !== item);
    
        // Rimuovi l'oggetto anche dalla lista principale degli items disponibili
        this.items = this.items.filter(i => i !== item);
    
        // Trova un nuovo oggetto non ancora utilizzato
        const remainingItems = this.items.filter(i => !this.currentItems.includes(i));
    
        if (remainingItems.length > 0) {
            // Seleziona un nuovo oggetto casuale
            const randomIndex = Math.floor(Math.random() * remainingItems.length);
            const newItem = remainingItems[randomIndex];
            
            // Aggiungi il nuovo oggetto dopo che l'animazione di rimozione è completata
            this.time.delayedCall(800, () => {
                this.addNewItem(newItem);
            });
        }
    
        // Controlla se il gioco è finito
        if (this.correctItemsFound >= this.totalCorrectItems) {
            this.endGame();
        }
    }
    addNewItem(item) {
        // Ottieni i container esistenti
        const containers = this.children.list.filter(child => child.type === 'Container');
        
        // Calcola la nuova posizione Y
        const itemHeight = 50;
        const spacing = 1;
        const y = this.headerImage.y + (this.headerImage.displayHeight / 2) + 30 + 
        (containers.length * (itemHeight + spacing));
    
        // Crea il nuovo container
        const container = this.add.container(this.cameras.main.centerX - 120, y);
        container.setAlpha(0); // Inizia invisibile
    
        // Aggiungi l'immagine dell'oggetto
        const image = this.add.image(0, 0, item.key)
            .setDisplaySize(30, 30);
    
        // Aggiungi il testo dell'oggetto
        const text = this.add.text(30, 0, item.name, {
            fontFamily: 'Poppins',
            fontSize: '18px',
            color: '#000000'
        }).setOrigin(0, 0.5);
    
        container.add([image, text]);
        container.setInteractive(new Phaser.Geom.Rectangle(0, -25, text.width + 70, 50), 
            Phaser.Geom.Rectangle.Contains);
    
        container.on('pointerdown', () => this.selectItem(item, container));
    
        // Aggiungi l'oggetto alla lista corrente
        this.currentItems.push(item);
    
        // Fade in del nuovo container
        this.tweens.add({
            targets: container,
            alpha: 1,
            duration: 300
        });
    
        // Riarrangia tutti gli elementi
        this.rearrangeItems();
    }

    showFeedback(type, container) {
        const feedback = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, type)
            .setScale(0)
            .setAlpha(0);

        this.tweens.add({
            targets: feedback,
            scale: 0.3,
            alpha: 1,
            duration: 500,
            onComplete: () => {
                this.time.delayedCall(500, () => {
                    feedback.destroy();
                    this.removePreviousItem(container);
                });
            }
        });
    }

    removePreviousItem(container) {
        this.tweens.add({
            targets: container,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                container.destroy();
                this.rearrangeItems();
            }
        });
    }

    rearrangeItems() {
        // Ottieni i container rimanenti
        const remainingContainers = this.children.list.filter(child => child.type === 'Container');
        
        // Calcola l'altezza totale della lista aggiornata
        const itemHeight = 50;
        const spacing = 1;
        const totalHeight = (remainingContainers.length * itemHeight) + 
                           ((remainingContainers.length - 1) * spacing);
        
        // Ricalcola la posizione iniziale per mantenere la lista centrata
        const startY = this.headerImage.y + (this.headerImage.displayHeight / 2) + 30;
        
        // Aggiorna la posizione di ogni container
        remainingContainers.forEach((container, index) => {
            this.tweens.add({
                targets: container,
                y: startY + (index * (itemHeight + spacing)),
                duration: 300,
                ease: 'Power2'
            });
        });
    }

    endGame() {
        const finalTime = this.time.now - this.startTime;
        this.isPlaying = false;
        
        this.time.delayedCall(1000, () => {
            this.scene.start('FineSponsaliaDeco', {
                score: this.score,
                time: finalTime
            });
        });
    }
}