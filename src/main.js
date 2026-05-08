import { gameState, abrirProjetoState, fecharProjetoState, toggleMapaState, setDebugFisicaState, toggleControlesMobileState } from "./core/state.js";
import { GameScene } from "./scene/gameScene.js";

//deixaram de ser utilizados
import { criarInput } from "./systems/input.js";
import { criarControlesMobile } from "./systems/mobileControls.js";
import { atualizarPlayer } from "./entities/player.js";
import { initInteracoes, registrarZona, atualizarInteracoes } from "./systems/interaction.js";
import { CameraController } from "./systems/camera.js";
import { projetos } from "./data/projects.js";
import { criarUI, mostrarTextoInteracao, esconderTextoInteracao } from "./ui/ui.js";
import { criarMapa } from "./scene/mapa.js";
import { criarPlayer } from "./entities/playerFactory.js";
import { abrirProjeto, fecharProjeto } from "./systems/projectSystem.js";

const isMobile = window.innerWidth < 768;

let game;

const config = {
    type: Phaser.AUTO,
    parent: 'gameContainer',
    backgroundColor: '#222222',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: !isMobile ? Phaser.Scale.CENTER_BOTH : Phaser.Scale.CENTER_HORIZONTALLY,
        width: 1280,
        height: 900
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: gameState.debugPanel
        }
    },

    scene: [GameScene]
};

game = new Phaser.Game(config);

