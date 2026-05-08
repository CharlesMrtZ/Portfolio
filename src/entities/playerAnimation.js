export function atualizarAnimacao(personagem, dirX, dirY, estaCorrendo) {
    //animação
    let direcao = '';

    let direcoes = {
        "0,0": 'baixo-idle',
        "0,1": 'baixo',
        "0,-1": 'cima',
        "-1,0": 'baixo-esquerda', //esquerda
        "1,0": 'baixo-direita', //direita
        "-1,1": 'baixo-esquerda', //baixo-esquerda
        "1,1": 'baixo-direita', //baixo-direita
        "-1,-1": 'baixo-esquerda', //cima-esquerda
        "1,-1": 'baixo-direita' // cima-direita
    };

    let chave = `${Math.sign(dirX)},${Math.sign(dirY)}`;
    direcao = direcoes[chave] || 'baixo-idle';

    personagem.anims.play(direcao, true);
    personagem.anims.timeScale = estaCorrendo ? 1.5 : 1; // Aumenta a velocidade da animação ao correr

}

const frameRateBase = 8; // Velocidade base da animação

export function criarAnimacaoPlayer(scene) {

    function criar(nome, linha) {
        scene.anims.create({
            key: nome,

            frames:
                scene.anims.generateFrameNumbers(
                    'personagem',
                    {
                        start: linha * 4,
                        end: linha * 4 + 3
                    }
                ),
            frameRate: frameRateBase,
            repeat: -1
        });
    }

    criar('baixo-idle', 0);
    criar('esquerda', 1);
    criar('cima-idle', 2);
    criar('direita', 3);
    criar('baixo', 4);
    criar('baixo-esquerda', 5);
    criar('cima', 6);
    criar('baixo-direita', 7);
}