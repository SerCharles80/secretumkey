// export const SessionManager = {
//     sessionKey: 'game_session',

//     // Stato della sessione: punteggio, checkpoint, ecc.
//     state: {
//         score: 0,
//         checkpoint: 0,
//         // puoi aggiungere ulteriori dati necessari
//     },

//     // Invia il punteggio all'account utente (qui simulato con una chiamata mock)
//     transmitScore() {
//         console.log("Trasmetto punteggio:", this.state.score);
//         // Qui puoi fare una chiamata fetch/axios a un'API REST per aggiornare il punteggio sul server
//     },

//     // Salva la sessione (qui usiamo localStorage per il demo)
//     saveSession() {
//         localStorage.setItem(this.sessionKey, JSON.stringify(this.state));
//         console.log("Sessione salvata:", this.state);
//     },

//     // Recupera la sessione salvata
//     restoreSession() {
//         const saved = localStorage.getItem(this.sessionKey);
//         if (saved) {
//             this.state = JSON.parse(saved);
//             console.log("Sessione ripristinata:", this.state);
//         } else {
//             console.log("Nessuna sessione precedente trovata.");
//         }
//         return this.state;
//     },

//     // Aggiorna lo stato della sessione ad ogni checkpoint
//     updateCheckpoint(checkpointNumber, score) {
//         this.state.checkpoint = checkpointNumber;
//         this.state.score = score;
//         this.saveSession();
//     },

//     // Imposta lo stato come “in pausa” al checkpoint (ad esempio: disabilitando input o mettendo in pausa la scena corrente)
//     pauseGameAtCheckpoint(scene) {
//         // Trasmetti il punteggio prima di mettere in pausa
//         this.transmitScore();
//         // Salva lo stato attuale
//         this.saveSession();
//         // Mette in pausa la scena corrente
//         scene.scene.pause();
//         console.log("Gioco in pausa al checkpoint:", this.state.checkpoint);
//     },

//     // Riprende il gioco, ad esempio, dopo che il QR è stato scansionato correttamente
//     resumeGame(scene) {
//         // Aggiungi eventuale logica di ripristino se necessario
//         scene.scene.resume();
//         console.log("Gioco ripreso");
//     }
// };