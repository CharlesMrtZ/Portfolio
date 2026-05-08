import { fecharMapaState, gameState, toggleMapaState } from "../core/state.js";


const isMobile = window.innerWidth < 768;
const zoom_padrao = isMobile ? 4 : 3;

export class CameraController {
    constructor(scene, player, map) {
        this.scene = scene;
        this.cam = scene.cameras.main;
        this.player = player;

        fecharMapaState();

        // setup inicial
        this.cam.startFollow(this.player);
        this.cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cam.setZoom(zoom_padrao);
    }

    toggleMapa() {
        if (!this.player) return;

        if (gameState.mapaAberto) {
            // voltar ao normal
            this.scene.tweens.add({
                targets: this.cam,
                zoom: zoom_padrao,
                duration: 500,
                ease: 'Quad.easeIn'
            });

            this.cam.startFollow(this.player);

        } else {
            // abrir mapa
            this.scene.tweens.add({
                targets: this.cam,
                zoom: 1,
                duration: 500,
                ease: 'Quad.easeOut'
            });

            this.cam.stopFollow();
        }

        toggleMapaState();
    }

    abrirComTransicao(onComplete) {
        if (gameState.mapaAberto) {
            this.cam.startFollow(this.player);
            fecharMapaState();
        }

        this.scene.tweens.add({
            targets: this.cam,
            zoom: 10,
            duration: 600,
            ease: 'Quad.easeIn'
        });

        this.cam.fadeOut(600, 0, 0, 0);

        this.cam.once('camerafadeoutcomplete', () => {
            onComplete();
        });
    }

    fecharComTransicao() {
        this.scene.tweens.add({
            targets: this.cam,
            zoom: zoom_padrao,
            duration: 800,
            ease: 'Quad.easeOut'
        });

        this.cam.fadeIn(800, 0, 0, 0);

        this.cam.startFollow(this.player);
    }

    shake(intensidade = 0.01, duracao = 200) {
    this.cam.shake(duracao, intensidade);
}
}