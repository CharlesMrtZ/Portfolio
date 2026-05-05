import { atualizarAnimacao } from "./playerAnimation.js";

export function atualizarPlayer(personagem, input, touchInput, velocidadeAtual) {
    //direção
    const velocidade = 100;
    let dirX = 0;
    let dirY = 0;

    if (input.teclado.W.isDown) dirY = -1;
    if (input.teclado.A.isDown) dirX = -1;
    if (input.teclado.S.isDown) dirY = 1;
    if (input.teclado.D.isDown) dirX = 1;

    // mobile - touch
    if (touchInput.left) dirX -= 1;
    if (touchInput.right) dirX += 1;
    if (touchInput.up) dirY -= 1;
    if (touchInput.down) dirY += 1;

    //estado
    let estaMovendo = dirX !== 0 || dirY !== 0;
    let estaCorrendo = (input.teclado.SHIFT.isDown || touchInput.run) && estaMovendo;

    //velocidade alvo
    let velocidadeAlvo = estaCorrendo ? 200 : velocidade;

    //normalizar direção para evitar movimento mais rápido na diagonal
    velocidadeAtual = Phaser.Math.Linear(velocidadeAtual, velocidadeAlvo, 0.05);
    /*let velocidadeAlvo = Math.hypot(dirX, dirY);
    if (velocidadeAlvo > 0) {
        dirX /= velocidadeAlvo;
        dirY /= velocidadeAlvo;
    }*/

    //correção diagonal
    let vx = dirX;
    let vy = dirY;
    if (vx !== 0 && vy !== 0) {
        vx *= Math.SQRT1_2; // 1/sqrt(2) para manter a velocidade diagonal consistente
        vy *= Math.SQRT1_2;
    }

    //aplicar velocidade
    personagem.setVelocity(vx * velocidadeAtual, vy * velocidadeAtual);

    atualizarAnimacao(personagem, dirX, dirY, estaCorrendo);

    return velocidadeAtual;
}