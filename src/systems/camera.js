export function criarCameraState(scene, player, map, zoomPadrao) {
    const cam = scene.cameras.main;

    cam.startFollow(player);
    cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    cam.setZoom(zoomPadrao);

    return {
        scene,
        cam,
        player,
        zoomPadrao,
        mapaAberto: false
    };
}

export function toggleMapa(state) {
    
    if (state.mapaAberto) {
        state.scene.tweens.add({
            targets: state.cam,
            zoom: state.zoomPadrao,
            duration: 500,
            ease: 'Quad.easeIn'
        });

        state.cam.startFollow(state.player);
    } else {
        state.scene.tweens.add({
            targets: state.cam,
            zoom: 1,
            duration: 500,
            ease: 'Quad.easeOut'
        });

        state.cam.stopFollow();
    }

    state.mapaAberto = !state.mapaAberto;

}

export function abrirComTransicao(state, onComplete) {

    if (state.mapaAberto) {
        //voltar follow da camera
        state.cam.startFollow(state.player);
        state.mapaAberto = false;
    }

    state.scene.tweens.add({
        targets: state.cam,
        zoom: 10,
        duration: 800,
        ease: 'Quad.easeIn'
    });

    state.cam.fadeOut(800, 0, 0, 0);

    state.cam.once('camerafadeoutcomplete', () => {
        onComplete();
    });
}

export function fecharComTransicao(state) {
    state.scene.tweens.add({
        targets: state.cam,
        zoom: state.zoomPadrao,
        duration: 800,
        ease: 'Quad.easeOut'
    });

    state.cam.fadeIn(800, 0, 0, 0);
}