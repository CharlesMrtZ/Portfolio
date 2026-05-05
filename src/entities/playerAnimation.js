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