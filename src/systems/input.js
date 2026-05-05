export function criarInput(scene) {
    const teclado = scene.input.keyboard.addKeys({
        'W': Phaser.Input.Keyboard.KeyCodes.W,
        'A': Phaser.Input.Keyboard.KeyCodes.A,
        'S': Phaser.Input.Keyboard.KeyCodes.S,
        'D': Phaser.Input.Keyboard.KeyCodes.D,
        'SHIFT': Phaser.Input.Keyboard.KeyCodes.SHIFT,
    });

    const teclaE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    const teclaEsc = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    const teclaM = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

    return {
        teclado,
        teclaE,
        teclaEsc,
        teclaM
    };
}