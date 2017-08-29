const models = require('../models');
const error_repository = require('./errors');
const territory_repository = require('./territory')

module.exports.is_in_territory = async(x, y) => {
    try {
        let territory = await territory_repository.get_by_point(x, y);
        return (!!territory);
    } catch (err) {
        error_repository.log_error(err);
        return false;
    }
};

module.exports.list_last_five_painted = async() => {
    return await models.square.findAll({
        limit: 5,
        order: models.sequelize.literal('createdAt DESC'),
        attributes: ['x', 'y']
    });
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
    let territory = await territory_repository.get_by_point(x, y);
    territory_repository.update_painted_area(territory.id, territory.painted_area + 1);

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