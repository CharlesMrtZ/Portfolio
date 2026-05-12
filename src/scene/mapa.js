export function criarMapa(scene) {
    //mapa
    const map = scene.make.tilemap({ key: 'map' });

    const tilesetIsland =
        map.addTilesetImage('island', 'island');

    const tilesetObjects2 =
        map.addTilesetImage('objects2', 'objects2');

    const tilesetFence =
        map.addTilesetImage('fence', 'fence');

    const waterLayer =
        map.createLayer('water', tilesetIsland, 0, 0);

    const terrainLayer =
        map.createLayer('terrain', tilesetIsland, 0, 0);

    const terrain2Layer =
        map.createLayer('terrain2', tilesetIsland, 0, 0);

    const objectsLayer =
        map.createLayer(
            'objects', 
            [tilesetObjects2, 
                tilesetFence
            ], 
            0, 
            0
        );

    const objects2Layer =
        map.createLayer(
            'objects2', 
            tilesetObjects2, 
            0, 
            0
        );

    //colisão
    waterLayer.setCollisionByProperty({ 
        collider: true 
    });

    terrain2Layer.setCollisionByProperty({ 
        collider: true 
    });

    return {
        map,
        layers: {
            waterLayer,
            terrainLayer,
            terrain2Layer,
            objectsLayer,
            objects2Layer
        }
    };
}
