import { gameState, abrirProjetoState, fecharProjetoState, toggleMapaState, setDebugFisicaState, toggleControlesMobileState } from "./core/state.js";
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



//imports
let input;
let touchInput;
let camera;


let personagem;

let velocidadeAtual = 0;
const frameRateBase = 8;

let cena;

const isMobile = window.innerWidth < 768;

const zoom_padrao = isMobile ? 4 : 3;

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

    scene: {
        key: 'mapa',
        preload: preload,
        create: create,
        update: update
    }
};

game = new Phaser.Game(config);

function preload() {

    //personagem
    this.load.spritesheet('personagem', './assets/tiles/Player1.png', {
        frameWidth: 64,
        frameHeight: 64
    });

    //tiles
    //this.load.image('ground', '../assets/tiles/Textures.png');
    this.load.image('terrain', '../assets/map 2/island.png');
    this.load.image('objects2', '../assets/map 2/objects2.png');
    this.load.image('fence', '../assets/map 2/fence.png');
    //this.load.tilemapTiledJSON('map', '../assets/map/map.json')
    this.load.tilemapTiledJSON('map', '../assets/map 2/map1.json')

}

function create() {
    //imports
    input = criarInput(this);

    configurarAtalhos(this);

    cena = this;

    initInteracoes(this);

    //Projetos
    projetos.forEach(projeto => {
        registrarZona(this, projeto);
    });

    //mapa
    const mapData = criarMapa(this);

    //personagem
    personagem = criarPlayer(this);

    //colisores
    this.physics.add.collider(
        personagem, 
        mapData.layers.waterLayer
    );

    this.physics.add.collider(
        personagem, 
        mapData.layers.terrain2Layer
    );

    //cameras
    camera = new CameraController(this, personagem, mapData.map, zoom_padrao);

    
    //UI
    criarUI(this);
    
    const uiCamera = this.cameras.add(0, 0, 1280, 900);
    uiCamera.setScroll(0, 0)
    uiCamera.ignore([mapData.layers.waterLayer, mapData.layers.terrainLayer, mapData.layers.terrain2Layer, mapData.layers.objectsLayer, mapData.layers.objects2Layer, personagem])


    //mobile
    // usarControlesMobile = this.sys.game.device.input.touch;
    gameState.usarControlesMobile = true;

    if (gameState.usarControlesMobile) {
        touchInput = criarControlesMobile(this);
    }

    //debug
    this.physics.world.createDebugGraphic();

    // força estado inicial OFF
    this.physics.world.debugGraphic.visible = gameState.debugFisicaAtivo;
}

function update() {
    if (gameState.projetoAberto) return;

    //movimento
    velocidadeAtual = atualizarPlayer(
        personagem,
        input,
        touchInput,
        velocidadeAtual
    );

    //Interações
    const interacao = atualizarInteracoes(
        personagem,
        input.teclaE,
        touchInput,
        (url) => {
                abrirProjeto(cena, camera, url);
        }
    );

    if (interacao.podeInteragir) {
        mostrarTextoInteracao();
    } else {
        esconderTextoInteracao();
    }

    //mapa
    if (Phaser.Input.Keyboard.JustDown(input.teclaM)) {
        camera.toggleMapa();
    }


    //DEBUG
    if (gameState.debugPanel) {
        const debugPanel = document.getElementById("debugPanel");
        if (gameState.debugPanel) {
            debugPanel.style.display = "block";

            const zoomText = document.getElementById("debugZoom");
            const velocityText = document.getElementById("debugVelocity");

            if (zoomText) {
                zoomText.innerText = "Zoom: " + this.cameras.main.zoom.toFixed(2);
            }
            if (velocityText) {
                velocityText.innerText = "Velocity: " + velocidadeAtual.toFixed(2);
            }
        } else {
            debugPanel.style.display = 'none';
        }
    }

}

window.fecharProjeto = () => fecharProjeto(cena, camera);

function toggleDebugFisica() {
    const world = cena.physics.world;
    const btn = document.getElementById("btnDebug");

    if (!world.debugGraphic) return;

    // alterna visibilidade
    world.debugGraphic.visible = !world.debugGraphic.visible;


    if (world.debugGraphic.visible) {
        btn.innerText = "Debug: ON";
        setDebugFisicaState(true);
    } else {
        btn.innerText = "Debug: OFF";
        setDebugFisicaState(false);
    }
}
window.toggleDebugFisica = toggleDebugFisica;

window.addEventListener('resize', () => {
    game.scale.refresh();
});

function configurarAtalhos(scene) {
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && gameState.projetoAberto) {
            camera.shake();
            fecharProjeto();
        }
    });
};
