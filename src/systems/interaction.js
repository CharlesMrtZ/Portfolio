let zonas = [];
let zonaAtual = null;
let podeInteragir = false;

let cenaRef;

export function initInteracoes(scene) {
    cenaRef = scene;    
}

export function registrarZona(scene, config) {
    
    const zona = scene.add.zone(
        config.x,
        config.y,
        config.largura,
        config.altura
    );

    scene.physics.add.existing(zona);

    zona.body.setAllowGravity(false);
    zona.body.setImmovable(true);

    zona.data = {
        url: config.url
    };

    zonas.push(zona);
}

export function atualizarInteracoes(player, teclaE, touchInput, abrirProjetoCallback) {
    
    podeInteragir = false;
    zonaAtual = null;

    for (let zona of zonas) {
        if (cenaRef.physics.overlap(player, zona)) {
            zonaAtual = zona;
            podeInteragir = true;
            break
        }
    }

    const interagir =
        ( teclaE && Phaser.Input.Keyboard.JustDown(teclaE)) ||
        touchInput?.interact;

    if (podeInteragir && interagir && zonaAtual) {
        abrirProjetoCallback(zonaAtual.data.url)
    }

    return {
        podeInteragir,
        zonaAtual
    };
}