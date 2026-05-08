let textoInteracao = null;

export function criarUI(scene) {
    textoInteracao = scene.add.text(
        240, 
        250, 
        "Pressione E", 
        {
            fontSize: '36px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        }
    );

    textoInteracao.setOrigin(0.5);
    textoInteracao.setDepth(1000);
    textoInteracao.setVisible(false);

    scene.cameras.main.ignore([textoInteracao]);
}

export function mostrarTextoInteracao() {
    if (textoInteracao) {
        textoInteracao.setVisible(true);
    }
}

export function esconderTextoInteracao() {
    if (textoInteracao) {
        textoInteracao.setVisible(false);
    }
}
