// src/stato/GameState.js

// Oggetto per gestire lo stato globale del gioco
const GameState = {
    totalScore: 0, // Punteggio totale condiviso tra tutti i livelli

    /**
     * Aggiunge punti al punteggio totale
     * @param {number} points - I punti da aggiungere
     */
    addScore(points) {
        this.totalScore += points;
        console.log(`Nuovo punteggio totale: ${this.totalScore}`);
    },

    /**
     * Restituisce il punteggio totale attuale
     * @returns {number} Il punteggio totale
     */
    getScore() {
        return this.totalScore;
    },

    /**
     * Resetta il punteggio totale (utile se si vuole ricominciare)
     */
    resetScore() {
        this.totalScore = 0;
        console.log("Punteggio totale resettato.");
    }
};

// Esporta l'oggetto GameState per essere utilizzato nei vari livelli
export { GameState };
