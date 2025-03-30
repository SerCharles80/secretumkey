const allowedLinks = [
    'https://secretumkey.it/',
	'https://secretumkey.it/chiesa-san-nicolo/',
	'https://secretumkey.it/chiesa-san-lorenzo/',
	'https://secretumkey.it/palazzo-chiappini/',
	'https://secretumkey.it/chiesa-san-rocco/',
	'https://secretumkey.it/porta-vecchia/',
	'https://secretumkey.it/punto-informativo/',
	'https://secretumkey.it/fortezza/',
    'https://secretumkey.it/bonus-fortezza/',
	'https://secretumkey.it/bonus-museo/'
];

const scannedLinks = new Set();

export function processQRCode(qrData) {
	// Aggiungi la condizione per il codice iniziale
	if (qrData === "https://secretumkey.it/") {
		return "codiceIniziale";
	}
	
	// Verifica se il QR code scansionato è valido
	if (allowedLinks.includes(qrData)) {
		// Esegue il controllo per assicurare che il codice non sia già stato scansionato
		if (!scannedLinks.has(qrData)) {
			scannedLinks.add(qrData);
			return "ok";
		} else {
			return "alreadyScanned";
		}
	}
	return "invalid";
}
