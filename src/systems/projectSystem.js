import { gameState } from "../core/state.js";

export function abrirProjeto(cena, camera, url) {
    if (gameState.projetoAberto) return;

    const painel = document.getElementById("painelProjeto");
    const frame = document.getElementById("frameProjeto");

    camera.abrirComTransicao(() => {
        gameState.projetoAberto = true;
        frame.src = url;
        painel.style.display = "block";

        cena.scene.pause();
    });
}

export function fecharProjeto(cena,camera){

    const painel = document.getElementById("painelProjeto");
    const frame = document.getElementById("frameProjeto");

    painel.style.display = "none";
    frame.src = "";

    gameState.projetoAberto = false;

    setTimeout(() => {
        cena.scene.resume();
    }, 50)

    camera.fecharComTransicao();
}