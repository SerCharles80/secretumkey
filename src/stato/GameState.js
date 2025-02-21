// src/stato/GameState.js

const GameState = {
    totalScore: 0, // Punteggio totale condiviso tra tutti i livelli

    /**
     * Aggiunge punti al punteggio totale.
     * @param {number} points - I punti da aggiungere.
     */
    addScore(points) {
        this.totalScore += points;
        this.updateDisplay(); // Aggiorna il display ogni volta che il punteggio cambia
        console.log(`Nuovo punteggio totale: ${this.totalScore}`);
    },

    /**
     * Restituisce il punteggio totale attuale.
     * @returns {number} Il punteggio totale.
     */
    getScore() {
        return this.totalScore;
    },

    /**
     * Resetta il punteggio totale (utile per ricominciare il gioco).
     */
    resetScore() {
        this.totalScore = 0;
        this.updateDisplay(); // Aggiorna il display quando il punteggio viene resettato
        console.log("Punteggio totale resettato.");
    },

    // Nuovo metodo per aggiornare il display
    updateDisplay() {
        const scoreDiv = document.getElementById('PunteggioTotaleDiv');
        if (scoreDiv) {
            scoreDiv.innerText = `Punti: ${this.totalScore}`;
        } else {
            console.error("Div 'PunteggioTotaleDiv' non trovato!");
        }
    },

    // Inizializza il display al caricamento
    init() {
        this.updateDisplay();
    }
};

// Inizializza il display quando il modulo viene caricato
GameState.init();

export { GameState };
