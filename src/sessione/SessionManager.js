(function(window) {
    // SessionManager.js
    // Gestione sessioni utente per Phaser, esportato globalmente su window.Session
  
    // Per sviluppo in locale su porta 8080, punta sempre al server online
    const API_BASE = 'https://secretumkey.it/wp-json/secretumkey/v1';
    let sessionId = null;
    let userId = null;
  
    /** Helper per fetch con errori */
    async function apiRequest(path, options) {
      const res = await fetch(API_BASE + path, Object.assign({
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      }, options));
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      return res.json();
    }
  
    /** Login */
    async function login(username, password) {
      const data = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      userId = data.user_id;
      console.log('SessionManager: logged in user', userId);
      return userId;
    }
  
    /** Avvia sessione */
    async function startSession() {
      if (!userId) throw new Error('Utente non loggato');
      const data = await apiRequest('/session/start', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId })
      });
      sessionId = data.session_id;
      console.log('SessionManager: session started', sessionId);
      return sessionId;
    }
  
    /** Salva stato */
    async function saveSession(checkpoint, elapsedTime, score) {
      if (!sessionId) throw new Error('Sessione non avviata');
      await apiRequest('/session/save', {
        method: 'POST',
        body: JSON.stringify({ session_id: sessionId, checkpoint, elapsed_time: elapsedTime, score })
      });
      console.log(`SessionManager: saved checkpoint=${checkpoint}`);
    }
  
    /** Aggiunge bonus */
    async function addBonus(bonusType, bonusValue) {
      if (!sessionId) throw new Error('Sessione non avviata');
      const data = await apiRequest('/session/bonus', {
        method: 'POST',
        body: JSON.stringify({ session_id: sessionId, bonus_type: bonusType, bonus_value: bonusValue })
      });
      console.log('SessionManager: bonus added', data.bonus_id);
    }
  
    /** Pausa checkpoint */
    async function pauseCheckpoint(checkpoint) {
      if (!sessionId) throw new Error('Sessione non avviata');
      const data = await apiRequest(`/session/${sessionId}/pause`, {
        method: 'POST',
        body: JSON.stringify({ checkpoint })
      });
      console.log('SessionManager: paused at', data.paused_at);
      return data.paused_at;
    }
  
    /** Riprende checkpoint */
    async function resumeCheckpoint(checkpoint) {
      if (!sessionId) throw new Error('Sessione non avviata');
      const data = await apiRequest(`/session/${sessionId}/resume`, {
        method: 'POST',
        body: JSON.stringify({ checkpoint })
      });
      console.log('SessionManager: resumed at', data.resumed_at);
      return data.resumed_at;
    }
  
    /** Scan QR e save interno */
    async function handleQrScan(checkpoint, qrCode) {
      if (!sessionId) throw new Error('Sessione non avviata');
      const data = await apiRequest(`/session/${sessionId}/scan`, {
        method: 'POST',
        body: JSON.stringify({ checkpoint, qr_code: qrCode })
      });
      console.log('SessionManager: QR scan OK', data.checkpoint);
      return data;
    }
  
    /** Termina sessione */
    async function endSession() {
      if (!sessionId) throw new Error('Sessione non avviata');
      const data = await apiRequest('/session/end', {
        method: 'POST',
        body: JSON.stringify({ session_id: sessionId })
      });
      console.log('SessionManager: session ended, total_score=', data.total_score);
      return data.total_score;
    }
  
    // Esporta globale
    window.Session = {
      login,
      startSession,
      saveSession,
      addBonus,
      pauseCheckpoint,
      resumeCheckpoint,
      handleQrScan,
      endSession
    };
  
    console.log('SessionManager loaded and available as window.Session');
  })(window);
  