import { criarInput } from "./systems/input.js";
import { criarControlesMobile } from "./systems/mobileControls.js";
import { atualizarPlayer } from "./entities/player.js";
import { initInteracoes, registrarZona, atualizarInteracoes } from "./systems/interaction.js";

//imports
let input;
let touchInput;


let personagem;
let tecla;
let teclaE;

let podeInteragir;
let textoInteracao;

//zona hardcoded (teste temporário)
let zonaCasa1;
let zonaCasa2;

//Projetos
//let projeto1 = "https://www.twitch.tv/sovousetuvai";
let projeto1 = "../assets/projetos/projeto1/index.html";
//let projeto2 = "https://www.youtube.com/@sovousetuvai";
let projeto2 = "../assets/projetos/projeto2/teste.html";

let velocidadeAtual = 0;
const frameRateBase = 8;

let cena;

const isMobile = window.innerWidth < 768;

const zoom_padrao = isMobile ? 4 : 3;

let projetoAberto = false;
let mapaAberto = false;

//mobile
let usarControlesMobile = false;

//DEBUG
let debugAtivo = true;
let debugFisicaAtivo = false;

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
            debug: false
        }
    },

    scene: {
        key: 'mapa',
        preload: preload,
        create: create,
        update: update
    }
};

new Phaser.Game(config);

function preload() {
    //imports
    input = criarInput(this);


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
    cena = this;

    initInteracoes(this);

    registrarZona(this, {
        x: 400,
        y: 170,
        largura: 250,
        altura: 140,
        url: projeto1
    });

    registrarZona(this, {
        x: 470,
        y: 460,
        largura: 250,
        altura: 140,
        url: projeto2
    })


    //mapa
    const map = this.make.tilemap({ key: 'map' });
    const tilesetIsland = map.addTilesetImage('island', 'terrain');
    const tilesetObjects2 = map.addTilesetImage('objects2', 'objects2');
    const tilesetFence = map.addTilesetImage('fence', 'fence');
    //const groundLayer = map.createLayer('grass', tileset, 0, 0);
    //const waterLayer = map.createLayer('water', tileset, 0, 0);
    const waterLayer = map.createLayer('water', tilesetIsland, 0, 0);
    const terrainLayer = map.createLayer('terrain', tilesetIsland, 0, 0);
    const terrain2Layer = map.createLayer('terrain2', tilesetIsland, 0, 0);
    const objectsLayer = map.createLayer('objects', [tilesetObjects2, tilesetFence], 0, 0);
    const objects2Layer = map.createLayer('objects2', tilesetObjects2, 0, 0);

    //colisão
    waterLayer.setCollisionByProperty({ collider: true });
    terrain2Layer.setCollisionByProperty({ collider: true });



    //personagem
    personagem = this.physics.add.sprite(180, 200, 'personagem');
    personagem.body.setSize(22, 20);
    personagem.body.setOffset(21, 45);

    function criarAnimacao(nome, linha) {
        this.anims.create({
            key: nome,
            frames: this.anims.generateFrameNumbers('personagem', {
                start: linha * 4,
                end: linha * 4 + 3
            }),
            frameRate: frameRateBase,
            repeat: -1
        });
    }

    //chamadas de animação
    criarAnimacao.call(this, 'baixo-idle', 0)
    criarAnimacao.call(this, 'esquerda', 1)
    criarAnimacao.call(this, 'cima-idle', 2)
    criarAnimacao.call(this, 'direita', 3)
    criarAnimacao.call(this, 'baixo', 4)
    criarAnimacao.call(this, 'baixo-esquerda', 5)
    criarAnimacao.call(this, 'cima', 6)
    criarAnimacao.call(this, 'baixo-direita', 7)


    //colisores
    this.physics.add.collider(personagem, waterLayer);
    this.physics.add.collider(personagem, terrain2Layer)

    //cameras
    //mundo
    this.cameras.main.startFollow(personagem);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setZoom(zoom_padrao);

    //fadeIn Resume
    this.cameras.main.fadeIn(300, 0, 0, 0);

    this.tweens.add({
        targets: this.cameras.main,
        zoom: zoom_padrao,
        duration: 300,
        ease: 'Quad.easeOut'
    });

    //UI
    const uiCamera = this.cameras.add(0, 0, 1280, 900);
    uiCamera.setScroll(0, 0)
    uiCamera.ignore([waterLayer, terrainLayer, terrain2Layer, objectsLayer, objects2Layer, personagem])

    //mobile
    // usarControlesMobile = this.sys.game.device.input.touch;
    usarControlesMobile = true;

    if (usarControlesMobile) {
        touchInput = criarControlesMobile(this);
    }

    //debug
    this.physics.world.createDebugGraphic();

    // força estado inicial OFF
    this.physics.world.debugGraphic.visible = debugFisicaAtivo;
}

function update() {
    if (projetoAberto) return;

    //movimento
    velocidadeAtual = atualizarPlayer(
        personagem,
        input,
        touchInput,
        velocidadeAtual
    );

    //Interações
    atualizarInteracoes(
        personagem,
        input.teclaE,
        touchInput,
        abrirProjeto
    )

    if (Phaser.Input.Keyboard.JustDown(input.teclaM)) {
        toggleMapa();
    }

    //DEBUG
    if (debugAtivo) {
        const debugPanel = document.getElementById("debugPanel");
        //debugPanel.style.display = 'none'

        const zoomText = document.getElementById("debugZoom");
        const velocityText = document.getElementById("debugVelocity");

        if (zoomText) {
            zoomText.innerText = "Zoom: " + this.cameras.main.zoom.toFixed(2);
        }
        if (velocityText) {
            velocityText.innerText = "Velocity: " + velocidadeAtual.toFixed(2);
        }
    }

}

function abrirProjeto(url) {

    if (projetoAberto) return;

    //zoom
    cena.tweens.add({
        targets: cena.cameras.main,
        zoom: 10,
        duration: 500,
        ease: 'Quad.easeIn'
    });

    //fade OUT
    cena.cameras.main.fadeOut(500, 0, 0, 0);

    cena.cameras.main.once('camerafadeoutcomplete', () => {
        projetoAberto = true;

        const painel = document.getElementById("painelProjeto");
        const frame = document.getElementById("frameProjeto");

        frame.src = url;
        painel.style.display = "block";

        cena.scene.pause();
    })
}

function fecharProjeto() {
    const painel = document.getElementById("painelProjeto");
    const frame = document.getElementById("frameProjeto");

    painel.style.display = "none";
    frame.src = "";

    projetoAberto = false;

    setTimeout(() => {
        cena.scene.resume();
    }, 50)

    // anima suavemente
    cena.tweens.add({
        targets: cena.cameras.main,
        zoom: zoom_padrao,
        duration: 800,
        ease: 'Quad.easeOut'
    });

    cena.cameras.main.fadeIn(800, 0, 0, 0);

    if (mapaAberto) {
        //voltar follow da camera
        cena.cameras.main.startFollow(personagem);
        mapaAberto = !mapaAberto;
    }
}

window.fecharProjeto = fecharProjeto;

function toggleDebugFisica() {
    const world = cena.physics.world;
    const btn = document.getElementById("btnDebug");

    if (!world.debugGraphic) return;

    // alterna visibilidade
    world.debugGraphic.visible = !world.debugGraphic.visible;


    if (world.debugGraphic.visible) {
        btn.innerText = "Debug: ON";
        debugFisicaAtivo = true
    } else {
        btn.innerText = "Debug: OFF";
        debugFisicaAtivo = false
    }
}
window.toggleDebugFisica = toggleDebugFisica;

window.addEventListener('resize', () => {
    game.scale.refresh();
});

function toggleMapa() {
    if (projetoAberto) return; //pra não deixar o mapa abrir dentro do projeto

    mapaAberto = !mapaAberto;

    if (mapaAberto) {
        cena.tweens.add({
            targets: cena.cameras.main,
            zoom: 1,
            duration: 500,
            ease: 'Quad.easeOut'
        });

        //parar follow da camera
        cena.cameras.main.stopFollow();
    } else {
        cena.tweens.add({
            targets: cena.cameras.main,
            zoom: zoom_padrao,
            duration: 500,
            ease: 'Quad.easeIn'
        });

        //voltar follow da camera
        cena.cameras.main.startFollow(personagem);
    }

}