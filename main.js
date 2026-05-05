let personagem;
let tecla;
let teclaE;

let podeInteragir;
let textoInteracao;

//zona hardcoded (teste temporário)
let zonaCasa1;

//Projetos
//let projeto1 = "https://www.twitch.tv/sovousetuvai";
let projeto1 = "./teste.html";
//let projeto2 = "https://www.youtube.com/@sovousetuvai";
let projeto2 = "";

const velocidade = 100;
let velocidadeAtual = 0;
const frameRateBase = 8;

let cena;

const zoom_padrao = 3;
let projetoAberto = false;

//mobile
let touchInput = {
    up: false,
    down: false,
    left: false,
    right: false
};

let botoesMobile = {};
let usarControlesMobile = false;

//DEBUG
let debugAtivo = true;
let debugFisicaAtivo = false;

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 900,
    backgroundColor: '#222222',
    pixelArt: true,
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
    //personagem
    this.load.spritesheet('personagem', './assets/tiles/Player1.png', {
        frameWidth: 64,
        frameHeight: 64
    });

    //tiles
    //this.load.image('ground', './assets/tiles/Textures.png');
    this.load.image('terrain', './assets/map 2/island.png');
    this.load.image('objects2', './assets/map 2/objects2.png');
    this.load.image('fence', './assets/map 2/fence.png');
    //this.load.tilemapTiledJSON('map', './assets/map/map.json')
    this.load.tilemapTiledJSON('map', './assets/map 2/map1.json')

}

function create() {
    cena = this;

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

    //teclas
    tecla = this.input.keyboard.addKeys({
        up: 'W',
        left: 'A',
        down: 'S',
        right: 'D',
        shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
    });

    teclaE = this.input.keyboard.addKey('E');

    //colisores
    this.physics.add.collider(personagem, waterLayer);
    this.physics.add.collider(personagem, terrain2Layer)

    //zonas
    zonaCasa1 = this.add.zone(400, 170, 250, 140);
    this.physics.add.existing(zonaCasa1);
    zonaCasa1.body.setAllowGravity(false);
    zonaCasa1.body.setImmovable(true);
    zonaCasa1.url = projeto1

    zonaCasa2 = this.add.zone(470, 460, 250, 140);
    this.physics.add.existing(zonaCasa2);
    zonaCasa2.body.setAllowGravity(false);
    zonaCasa2.body.setImmovable(true);
    zonaCasa2.url = projeto2

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


    //interações de UI
    textoInteracao = this.add.text(240, 250, 'Pressione E', {
        fontSize: '36px',
        fill: '#ffffff',
        backgroundColor: '#000000'
    });
    //textoInteracao.setVisible(false);
    textoInteracao.setOrigin(0.5);
    textoInteracao.setDepth(1000);
    this.cameras.main.ignore([textoInteracao])

    podeInteragir = false;

    this.physics.add.overlap(personagem, zonaCasa1, () => {
        podeInteragir = true;
    });

    //mobile
    // usarControlesMobile = this.sys.game.device.input.touch;
    usarControlesMobile = true;

    if (usarControlesMobile) {

        const largura = this.scale.width;
        const altura = this.scale.height;

        function criarBotao(x, y, label) {
            const bg = this.add.circle(x, y, 40, 0x000000, 0.4)
                .setInteractive()
                .setScrollFactor(0)
                .setDepth(9999);

            const ajusteY = (label === '←' || label === '→') ? -10 : 0;

            const txt = this.add.text(x, y + ajusteY, label, {
                fontSize: '80px',
                color: '#ffffff'
            })
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(10000);

            return bg;
        }

        botoesMobile.left = criarBotao.call(this, 60, altura - 700, '←');
        botoesMobile.right = criarBotao.call(this, 190, altura - 700, '→');
        botoesMobile.up = criarBotao.call(this, 130, altura - 770, '↑');
        botoesMobile.down = criarBotao.call(this, 130, altura - 630, '↓');

        botoesMobile.left.on('pointerdown', () => touchInput.left = true);
        botoesMobile.left.on('pointerup', () => touchInput.left = false);
        botoesMobile.left.on('pointerout', () => touchInput.left = false);

        botoesMobile.right.on('pointerdown', () => touchInput.right = true);
        botoesMobile.right.on('pointerup', () => touchInput.right = false);
        botoesMobile.right.on('pointerout', () => touchInput.right = false);

        botoesMobile.up.on('pointerdown', () => touchInput.up = true);
        botoesMobile.up.on('pointerup', () => touchInput.up = false);
        botoesMobile.up.on('pointerout', () => touchInput.up = false);

        botoesMobile.down.on('pointerdown', () => touchInput.down = true);
        botoesMobile.down.on('pointerup', () => touchInput.down = false);
        botoesMobile.down.on('pointerout', () => touchInput.down = false);
    }

    //debug
    this.physics.world.createDebugGraphic();

    // força estado inicial OFF
    this.physics.world.debugGraphic.visible = debugFisicaAtivo;
}

function update() {
    if (projetoAberto) return;


    //movimentação personagem
    let dirX = 0;
    let dirY = 0;

    //Se quiser efeito de deslizar, colocar no topo do arquivo as duas variáveis abaixo
    let ultimoVX = 0;
    let ultimoVY = 0;

    if (tecla.left.isDown) dirX = -1;
    if (tecla.right.isDown) dirX = 1;
    if (tecla.up.isDown) dirY = -1;
    if (tecla.down.isDown) dirY = 1;

    // mobile - touch
    if (touchInput.left) dirX -= 1;
    if (touchInput.right) dirX += 1;
    if (touchInput.up) dirY -= 1;
    if (touchInput.down) dirY += 1;

    //estado
    let estaMovendo = dirX !== 0 || dirY !== 0;
    let estaCorrendo = tecla.shift.isDown && estaMovendo;

    //velocidade
    let velocidadeAlvo = estaCorrendo ? 200 : velocidade;

    if (!estaMovendo) velocidadeAlvo = 0;

    //suavização
    velocidadeAtual = Phaser.Math.Linear(velocidadeAtual, velocidadeAlvo, 0.05);

    //correção diagonal
    let vx = dirX;
    let vy = dirY;

    if (vx !== 0 && vy !== 0) {
        vx *= 0.7071;
        vy *= 0.7071;
    }

    if (estaMovendo) {
        ultimoVX = vx;
        ultimoVY = vy;
    }

    //movimento
    personagem.setVelocity(ultimoVX * velocidadeAtual, ultimoVY * velocidadeAtual);

    //direções
    let direcao = '';

    if (dirX === 0 && dirY === 0) direcao = 'baixo-idle';
    else if (dirX === 0 && dirY === 1) direcao = 'baixo';
    else if (dirX === 0 && dirY === -1) direcao = 'cima';
    else if (dirX === -1 && dirY === 0) direcao = 'baixo-esquerda';
    else if (dirX === 1 && dirY === 0) direcao = 'baixo-direita';

    else if (dirX === -1 && dirY === 1) direcao = 'baixo-esquerda';
    else if (dirX === 1 && dirY === 1) direcao = 'baixo-direita';
    else if (dirX === -1 && dirY === -1) direcao = 'baixo-esquerda';
    else if (dirX === 1 && dirY === -1) direcao = 'baixo-direita';


    if (direcao !== '') {
        personagem.anims.play(direcao, true);

        personagem.anims.timeScale = estaCorrendo ? 1.5 : 1;
    } else {
        personagem.anims.stop();
    }

    //Interações

    podeInteragir = false;

    let zonaAtual = null;
    if (this.physics.overlap(personagem, zonaCasa1)) {
        zonaAtual = zonaCasa1;
    } else {
        zonaAtual = zonaCasa2
    }

    if (this.physics.overlap(personagem, zonaAtual)) {
        podeInteragir = true;
    };

    if (podeInteragir) {
        textoInteracao.setVisible(true);
    } else {
        textoInteracao.setVisible(false);
    }


    if (podeInteragir && Phaser.Input.Keyboard.JustDown(teclaE)) {
        //zoom leve (retorno ao mapa)
        this.tweens.add({
            targets: this.cameras.main,
            zoom: 10,
            duration: 1000,
            ease: 'Quad.easeIn'
        });

        //fade
        this.cameras.main.fadeOut(1000, 0, 0, 0);

        this.cameras.main.once('camerafadeoutcomplete', () => {
            projetoAberto = true;
            const painel = document.getElementById("painelProjeto");
            const frame = document.getElementById("frameProjeto");

            frame.src = zonaAtual.url;
            painel.style.display = "block";

            cena.scene.pause();
        })


    }

    //DEBUG
    if (debugAtivo) {
        const debugPanel = document.getElementById("debugPanel");
        //debugPanel.style.display = 'none'

        const zoomText = document.getElementById("debugZoom");

        if (zoomText) {
            zoomText.innerText = "Zoom: " + this.cameras.main.zoom.toFixed(2);
        }
    }

}

function fecharProjeto() {
    const painel = document.getElementById("painelProjeto");
    const frame = document.getElementById("frameProjeto");

    painel.style.display = "none";
    frame.src = "";

    projetoAberto = false;

    cena.scene.resume();

    cena.cameras.main.setZoom(zoom_padrao);

    // anima suavemente
    cena.tweens.add({
        targets: cena.cameras.main,
        zoom: zoom_padrao,
        duration: 800,
        ease: 'Quad.easeOut'
    });

    cena.cameras.main.fadeIn(800, 0, 0, 0);
}

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