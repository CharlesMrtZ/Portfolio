import { criarAnimacaoPlayer } from "./playerAnimation.js";

export function criarPlayer(scene) {

    const player =
        scene.physics.add.sprite(
            230,
            1800,
            'personagem'
        );

    player.body.setSize(22, 20);
    player.body.setOffset(21, 45);

    criarAnimacaoPlayer(scene);

    return player;
}