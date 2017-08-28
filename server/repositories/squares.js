const models = require('../models');
let _find_container_territory = async(x, y) => {
    return await models.territory.find({
        limit: 1,
        where: {
            $and: [
                {start_x: {$lte: x}},
                {end_x: {$gte: x}},
                {start_y: {$lte: y}},
                {end_y: {$gte: y}}
            ]
        }
    });
};

module.exports.is_in_territory = async(x, y) => {
    try {
        let territory = await _find_container_territory(x, y);
        return (!!territory);
    } catch (err) {
        return false;
    }
};

module.exports.get_by_territory_id = async(id) => {
    return await models.square.findAll({
        where: {
            territoryId: id
        },
        attributes: ['x', 'y']
    });
};

module.exports.paint = async(x, y) => {
    let territory = await _find_container_territory(x, y);
    let square = await models.square.create({
        x: x,
        y: y
    });
    await square.setTerritory(territory);
    return {
        x: x,
        y: y,
        painted: true
    };
};