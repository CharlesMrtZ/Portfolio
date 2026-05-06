export class CameraController {
    constructor(scene, player, map, zoomPadrao) {
        this.scene = scene;
        this.cam = scene.cameras.main;
        this.player = player;
        this.zoomPadrao = zoomPadrao;

        this.mapaAberto = false;

        // setup inicial
        this.cam.startFollow(this.player);
        this.cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cam.setZoom(this.zoomPadrao);
    }

    toggleMapa() {
        if (!this.player) return;

        if (this.mapaAberto) {
            // voltar ao normal
            this.scene.tweens.add({
                targets: this.cam,
                zoom: this.zoomPadrao,
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

        this.mapaAberto = !this.mapaAberto;
    }

    abrirComTransicao(onComplete) {
        // 🔥 garante consistência
        if (this.mapaAberto) {
            this.cam.startFollow(this.player);
            this.mapaAberto = false;
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
            zoom: this.zoomPadrao,
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