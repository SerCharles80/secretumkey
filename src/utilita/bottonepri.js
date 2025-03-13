export function createPrimaryButton(scene, x, y, text, callback, config = {}) {
    // Configurazione di default che può essere sovrascritta
    const buttonConfig = {
        width: config.width || 200,
        height: config.height || 50,
        backgroundColor: config.backgroundColor || 0x00AAFF,
        borderColor: config.borderColor || 0x343434,
        borderRadius: config.borderRadius || 25,
        shadowOffset: config.shadowOffset || 3,
        fontSize: config.fontSize || '20px',
        fontColor: config.fontColor || '#ffffff',
        fontFamily: config.fontFamily || 'Poppins',
        hasShadow: config.hasShadow !== undefined ? config.hasShadow : true,
        borderWidth: config.borderWidth || 2
    };

    const container = scene.add.container(0, 0);

    // Aggiungi l'ombra solo se richiesta
    if (buttonConfig.hasShadow) {
        const shadow = scene.add.graphics();
        shadow.fillStyle(buttonConfig.borderColor, 1);
        shadow.fillRoundedRect(
            x - buttonConfig.width / 2,
            y - buttonConfig.height / 2.2 + buttonConfig.shadowOffset,
            buttonConfig.width,
            buttonConfig.height,
            buttonConfig.borderRadius
        );
        container.add(shadow);
    }

    // Corpo principale del bottone
    const buttonGraphics = scene.add.graphics();
    buttonGraphics.fillStyle(buttonConfig.backgroundColor, 1);
    buttonGraphics.fillRoundedRect(
        x - buttonConfig.width / 2,
        y - buttonConfig.height / 2,
        buttonConfig.width,
        buttonConfig.height,
        buttonConfig.borderRadius
    );
    buttonGraphics.lineStyle(buttonConfig.borderWidth, buttonConfig.borderColor, 1);
    buttonGraphics.strokeRoundedRect(
        x - buttonConfig.width / 2,
        y - buttonConfig.height / 2,
        buttonConfig.width,
        buttonConfig.height,
        buttonConfig.borderRadius
    );
    container.add(buttonGraphics);

    // Testo del bottone
    const buttonText = scene.add.text(x, y, text, {
        fontFamily: buttonConfig.fontFamily,
        fontSize: buttonConfig.fontSize,
        color: buttonConfig.fontColor,
        align: 'center'
    }).setOrigin(0.5);
    container.add(buttonText);

    // Area cliccabile
    const buttonHitArea = scene.add.rectangle(
        x,
        y,
        buttonConfig.width,
        buttonConfig.height
    )
    .setInteractive({ useHandCursor: true })
    .setOrigin(0.5);
    container.add(buttonHitArea);

    // Eventi del bottone
    buttonHitArea.on('pointerdown', callback);

    // Metodi per modificare il bottone dopo la creazione
    container.setStyle = function(newConfig) {
        buttonGraphics.clear();
        
        // Aggiorna lo sfondo
        buttonGraphics.fillStyle(newConfig.backgroundColor || buttonConfig.backgroundColor, 1);
        buttonGraphics.fillRoundedRect(
            x - buttonConfig.width / 2,
            y - buttonConfig.height / 2,
            buttonConfig.width,
            buttonConfig.height,
            buttonConfig.borderRadius
        );
        
        // Aggiorna il bordo
        buttonGraphics.lineStyle(
            newConfig.borderWidth || buttonConfig.borderWidth,
            newConfig.borderColor || buttonConfig.borderColor,
            1
        );
        buttonGraphics.strokeRoundedRect(
            x - buttonConfig.width / 2,
            y - buttonConfig.height / 2,
            buttonConfig.width,
            buttonConfig.height,
            buttonConfig.borderRadius
        );

        // Aggiorna il testo se necessario
        if (newConfig.fontColor) {
            buttonText.setStyle({ color: newConfig.fontColor });
        }
    };

    container.setText = function(newText) {
        buttonText.setText(newText);
    };

    container.setInteractive = function(value) {
        buttonHitArea.removeInteractive();
        if (value) {
            buttonHitArea.setInteractive({ useHandCursor: true });
        }
    };

    return container;
}