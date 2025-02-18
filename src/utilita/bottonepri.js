export function createPrimaryButton(scene, x, y, text, callback) {
    console.log(`Creazione pulsante: ${text} a (${x}, ${y})`);

    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonColor = 0x00AAFF; 
    const borderColor = 0x343434; 
    const borderRadius = 25; 
    const shadowOffset = 3;

    const shadow = scene.add.graphics();
    shadow.fillStyle(borderColor, 1);
    shadow.fillRoundedRect(
        x - buttonWidth / 2, 
        y - buttonHeight / 2.2 + shadowOffset, 
        buttonWidth, 
        buttonHeight, 
        borderRadius
    );

    const buttonGraphics = scene.add.graphics();
    buttonGraphics.fillStyle(buttonColor, 1);
    buttonGraphics.fillRoundedRect(
        x - buttonWidth / 2, 
        y - buttonHeight / 2, 
        buttonWidth, 
        buttonHeight, 
        borderRadius
    );
    buttonGraphics.lineStyle(2, borderColor, 1);
    buttonGraphics.strokeRoundedRect(
        x - buttonWidth / 2, 
        y - buttonHeight / 2, 
        buttonWidth, 
        buttonHeight, 
        borderRadius
    );

    const buttonText = scene.add.text(x, y, text, {
        fontFamily: 'Poppins',
        fontSize: '20px',
        color: '#ffffff',
        align: 'center'
    }).setOrigin(0.5, 0.5);

    const buttonHitArea = scene.add.rectangle(x, y, buttonWidth, buttonHeight)
    .setInteractive({ useHandCursor: true }) // Rende il pulsante interattivo su mobile e desktop
    .setOrigin(0.5);

    // Aggiunge evento per il clic (mouse) e il tocco (touch)
    buttonHitArea.on('pointerdown', () => {
        console.log(`Pulsante ${text} premuto!`); // Debug per controllare il touch
        callback();
    });
    
    
    // Contenitore che racchiude tutti gli elementi del pulsante
    const buttonContainer = scene.add.container(0, 0, [shadow, buttonGraphics, buttonText, buttonHitArea]);
    
    
    console.log(`Pulsante ${text} creato!`);
    return buttonContainer;
}