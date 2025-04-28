import Phaser from 'phaser';
//import { Ytestqr } from './scenes/checkpoint/Ytestqr';
import { AchiesaSanNicolo } from './scenes/checkpoint/AchiesaSanNicolo';
import { WelcomeScreen } from './scenes/intro/WelcomeScreen';
import { WherisAcquaviva } from './scenes/WherisAcquaviva';
import { FineWerisAcquaviva } from './scenes/end/FineWerisAcquaviva';
import { BchiesaSanLorenzo } from './scenes/checkpoint/BchiesaSanLorenzo';
import { SweetPeachInstructions } from './scenes/intro/SweetPeachInstructions';
import { SweetPeach } from './scenes/SweetPeach';
import { FineSweetPeach } from './scenes/end/FineSweetPeach';
import { FlagPuzzleIntro } from './scenes/intro/FlagPuzzleIntro';
import { FlagPuzzle } from './scenes/FlagPuzzle';
import { FineFlagPuzzle } from './scenes/end/FineFlagPuzzle';
import { CpalazzoChiappini } from './scenes/checkpoint/CpalazzoChiappini';
import { IcomuneIntro } from './scenes/intro/IcomuneIntro';
import { Icomune } from './scenes/Icomune';
import { FineIcomune } from './scenes/end/FineIcomune';
import { DchiesaSanRocco } from './scenes/checkpoint/DchiesaSanRocco';
import { DecoPuzzleIntro } from './scenes/intro/DecoPuzzleIntro';
import { DecoPuzzle } from './scenes/DecoPuzzle';
import { FineDecoPuzzle } from './scenes/end/FineDecoPuzzle';
import { CamminamiIntro } from './scenes/intro/CamminamiIntro';
import { Camminami } from './scenes/Camminami';
import { FineCamminami } from './scenes/end/FineCamminami';
import { EportaVecchia } from './scenes/checkpoint/EportaVecchia';
import { SponsaliaDecoIntro } from './scenes/intro/SponsaliaDecoIntro';
import { SponsaliaDeco } from './scenes/SponsaliaDeco';
import { FineSponsaliaDeco } from './scenes/end/FineSponsaliaDeco';
import { PietaIntro } from './scenes/intro/PietaIntro';
import { PietaSegreta } from './scenes/PietaSegreta';
import { FinePietaSegreta } from './scenes/end/FinePietaSegreta';
import { Ftotem } from './scenes/checkpoint/Ftotem';
import { FortezzaGostIntro } from './scenes/intro/FortezzaGostIntro';
import { FortezzaGost } from './scenes/FortezzaGost';
import { FineFortezzaGost } from './scenes/end/FineFortezzaGost';
import { Gfortezza } from './scenes/checkpoint/Gfortezza';
import { SciaboloneIntro } from './scenes/intro/SciaboloneIntro';
import { Sciabolone } from './scenes/Sciabolone';
import { FineSciabolone } from './scenes/end/FineSciabolone';
import { HbonusFortezza } from './scenes/checkpoint/HbonusFortezza';
import { BonusVinoMemoryIntro } from './scenes/intro/BonusVinoMemoryIntro';
import { BonusVinoMemory } from './scenes/BonusVinoMemory';
import { FineBonusVinoMemory } from './scenes/end/FineBonusVinoMemory';
import { IbonusMuseo } from './scenes/checkpoint/IbonusMuseo';
import { GrattaPajaIntro } from './scenes/intro/GrattaPajaIntro';
import { GrattaPaja } from './scenes/GrattaPaja';
import { FineGrattaPaja } from './scenes/end/FineGrattaPaja';
import { FinaleSecretum } from './scenes/FinaleSecretum';

window.onload = function () {
    const gameContainer = document.getElementById('contenitore-gioco-phaser');

    if (!gameContainer) {
        console.error("Errore: Il container del gioco non è stato trovato.");
        return;
    }

    console.log("Avvio del gioco Phaser...");

    const config = {
        type: Phaser.AUTO,
        parent: 'contenitore-gioco-phaser',
        backgroundColor: '#FFFBF5', // Imposta il colore di sfondo globale qui
        scene: [


            // AchiesaSanNicolo,
                WelcomeScreen, 
                WherisAcquaviva,
                FineWerisAcquaviva,
            

            BchiesaSanLorenzo,
                SweetPeachInstructions,
                SweetPeach,             
                FineSweetPeach,
                FlagPuzzleIntro,
                FlagPuzzle,
                FineFlagPuzzle,

            
            CpalazzoChiappini,
                IcomuneIntro,
                Icomune,
                FineIcomune,

            
            DchiesaSanRocco,
                DecoPuzzleIntro,
                DecoPuzzle,
                FineDecoPuzzle,
                CamminamiIntro,
                Camminami,
                FineCamminami,
            
            
            EportaVecchia,
                SponsaliaDecoIntro,
                SponsaliaDeco,
                FineSponsaliaDeco,
                PietaIntro,
                PietaSegreta,
                FinePietaSegreta,

            
            Ftotem,
                FortezzaGostIntro,
                FortezzaGost,
                FineFortezzaGost,

            
            Gfortezza,
                SciaboloneIntro,
                Sciabolone,
                FineSciabolone,


            HbonusFortezza,
                BonusVinoMemoryIntro,
                BonusVinoMemory,
                FineBonusVinoMemory,


            IbonusMuseo,
                GrattaPajaIntro,
                GrattaPaja,
                FineGrattaPaja,

            FinaleSecretum
        ],
        audio: {
            noAudio: true  // Disabilita l'AudioContext
        },
        scale: {
            mode: Phaser.Scale.RESIZE, // Adatta il gioco al div
            autoCenter: Phaser.Scale.CENTER_BOTH // Centra il gioco
        }
    };

    const game = new Phaser.Game(config);

    // Debug: Controlla se il gioco è stato inizializzato
    game.events.on('ready', () => {
        console.log("Gioco avviato con successo!");
    });

    // Debug: Verifica se il gioco non parte
    game.events.on('shutdown', () => {
        console.error("Il gioco è stato chiuso inaspettatamente!");
    });
};
