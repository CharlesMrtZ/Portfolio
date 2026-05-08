import { criarInput } from "../systems/input.js";
import { initInteracoes, registrarZona, atualizarInteracoes } from "../systems/interaction.js";
import { projetos } from "../data/projects.js";
import { criarMapa } from "../scene/mapa.js";
import { criarPlayer } from "../entities/playerFactory.js";
import { CameraController } from "../systems/camera.js";
import { criarUI, mostrarTextoInteracao, esconderTextoInteracao } from "../ui/ui.js";
import { gameState, abrirProjetoState, fecharProjetoState, toggleMapaState, setDebugFisicaState, toggleControlesMobileState } from "../core/state.js";
import { criarControlesMobile } from "../systems/mobileControls.js";
import { atualizarPlayer } from "../entities/player.js";
import { abrirProjeto, fecharProjeto } from "../systems/projectSystem.js";



export class GameScene extends Phaser.Scene {

    constructor() {
        super({ key: "mapa_portfolio" });
    }

    preload() {

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

    create() {

        this.velocidadeAtual = 0;

        //imports
        this.inputSistema = criarInput(this);

        this.configurarAtalhos();

        initInteracoes(this);

        //Projetos
        projetos.forEach(projeto => {
            registrarZona(this, projeto);
        });

        //mapa
        const mapData = criarMapa(this);

        //personagem
        this.personagem = criarPlayer(this);

        //colisores
        this.physics.add.collider(
            this.personagem,
            mapData.layers.waterLayer
        );

        this.physics.add.collider(
            this.personagem,
            mapData.layers.terrain2Layer
        );

        //cameras
        this.cameraController = new CameraController(this, this.personagem, mapData.map);


        //UI
        criarUI(this);

        const uiCamera = this.cameras.add(0, 0, 1280, 900);
        uiCamera.setScroll(0, 0)
        uiCamera.ignore([mapData.layers.waterLayer, mapData.layers.terrainLayer, mapData.layers.terrain2Layer, mapData.layers.objectsLayer, mapData.layers.objects2Layer, this.personagem])


        //mobile
        // usarControlesMobile = this.sys.game.device.input.touch;
        gameState.usarControlesMobile = true;

        if (gameState.usarControlesMobile) {
            this.touchInput = criarControlesMobile(this);
        }

        window.fecharProjeto = () => fecharProjeto(this, this.cameraController);

        //debug
        this.physics.world.createDebugGraphic();

        // força estado inicial OFF
        this.physics.world.debugGraphic.visible = gameState.debugFisicaAtivo;

        window.addEventListener('resize', () => {
            this.scale.refresh();
        });

        window.toggleDebugFisica = () => {this.toggleDebugFisica()};
    }

    update() {
        if (gameState.projetoAberto) return;

        //movimento
        this.velocidadeAtual = atualizarPlayer(
            this.personagem,
            this.inputSistema,
            this.touchInput,
            this.velocidadeAtual
        );

        //Interações
        const interacao = atualizarInteracoes(
            this.personagem,
            this.inputSistema.teclaE,
            this.touchInput,
            (url) => {
                abrirProjeto(this, this.cameraController, url);
            }
        );

        if (interacao.podeInteragir) {
            mostrarTextoInteracao();
        } else {
            esconderTextoInteracao();
        }

        //mapa
        if (Phaser.Input.Keyboard.JustDown(this.inputSistema.teclaM)) {
            this.cameraController.toggleMapa();
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
                    velocityText.innerText = "Velocity: " + this.velocidadeAtual.toFixed(2);
                }
            } else {
                debugPanel.style.display = 'none';
            }
        }

    }

    configurarAtalhos() {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && gameState.projetoAberto) {
                this.cameraController.shake();
                fecharProjeto(this, this.cameraController);
            }
        });
    };

    toggleDebugFisica() {
        const world = this.physics.world;
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
}

