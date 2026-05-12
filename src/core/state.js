export const gameState = {
    projetoAberto: false,
    mapaAberto: false,
    usarControlesMobile: false,

    //DEBUG
    debugPanel: true,
    debugFisicaAtivo: true
};

// PROJETO
export function abrirProjetoState(){
    gameState.projetoAberto = true;
}

export function fecharProjetoState(){
    gameState.projetoAberto = false;
}


// MAPA
export function abrirMapaState() {
    gameState.mapaAberto = true;
}

export function fecharMapaState() {
    gameState.mapaAberto = false;
}

export function toggleMapaState() {
    gameState.mapaAberto = !gameState.mapaAberto;
}


//DEBUG
export function setDebugFisicaState(valor) {
    gameState.debugFisicaAtivo = valor;
}

export function toggleControlesMobileState() {
    gameState.usarControlesMobile = !gameState.usarControlesMobile;
    // if (gameState.usarControlesMobile) {
    //     document.body.classList.add("mobile-controls");
    // } else {
    //     document.body.classList.remove("mobile-controls");
    // }
}
