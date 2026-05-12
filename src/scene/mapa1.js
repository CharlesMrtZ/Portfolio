export function criarMapa1(scene) {

    //mapa
    const map = scene.make.tilemap({ key: 'map-exgg' });

    //tilesets    
    const tilesetIsland = map.addTilesetImage('island', 'island');
    const tilesetTerrain = map.addTilesetImage('terrain', 'terrain');
    const tilesetObjects = map.addTilesetImage('objects2', 'objects2');
    const tilesetBlockCollision = map.addTilesetImage('block-collision', 'block-collision');

    //layers
    const waterLayer = map.createLayer('Water', tilesetIsland, 0, 0);
    const IslandLayer = map.createLayer('Island', tilesetIsland, 0, 0);
    const Ground2Layer = map.createLayer('Ground2', tilesetTerrain, 0, 0);
    const objectsLayer = map.createLayer('Object', tilesetObjects, 0, 0);
    const objects2Layer = map.createLayer('Object2', tilesetObjects, 0, 0);
    const objects3Layer = map.createLayer('Object3', tilesetObjects, 0, 0);

    //colisão
    const collisionWaterLayer = map.createLayer('Water-collision', tilesetBlockCollision, 0, 0);
    collisionWaterLayer.setCollisionByExclusion([-1]);
    collisionWaterLayer.setVisible(false);

    const collisionObjectsLayer = map.createLayer('Object-collision', tilesetBlockCollision, 0, 0);
    collisionObjectsLayer.setCollisionByExclusion([-1]);
    collisionObjectsLayer.setVisible(false);

    console.log("console.log(collisionWaterLayer):", collisionWaterLayer)
    console.log("console.log(collisionObjectsLayer):", collisionObjectsLayer);

    //return    
    return {
        map,
        layers: {
            waterLayer,
            IslandLayer,
            Ground2Layer,
            objectsLayer,
            objects2Layer,
            objects3Layer,

            collisionWaterLayer,
            collisionObjectsLayer
        }
    };
}
