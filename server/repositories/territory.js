const models = require('../models');
const error_repository = require('./errors');

function normalize_points(territory) {
    // end must be greater than start.
    if (territory.start.x > territory.end.x) {
        let aux_x = territory.start.x;
        territory.start.x = territory.end.x;
        territory.end.x = aux_x;
    }
    if (territory.start.y > territory.end.y) {
        let aux_y = territory.start.y;
        territory.start.y = territory.end.y;
        territory.end.y = aux_y;
    }
}

const clean_squares = async(territory_id) => {
    await models.square.destroy({
        where: {
            territoryId: territory_id
        }
    });
};

function format_territory(territory) {
    return {
        id: territory.id,
        name: territory.name,
        start: {
            x: territory.start_x,
            y: territory.start_y
        },
        end: {
            x: territory.end_x,
            y: territory.end_y
        },
        painted_area: territory.painted_area,
        area: (territory.end_y - territory.start_y ) * (territory.end_x - territory.start_x)
    };
}


module.exports.list_all = async() => {
    let list = await models.territory.findAll();
    let result = [];
    for (let i = 0; i < list.length; i++)
        result.push(format_territory(list[i]));
    return result;
};

module.exports.get_by_id = async(id) => {
    const territory = await models.territory.findById(id);
    return format_territory(territory);
};

module.exports.delete = async(id) => {
    await  clean_squares(id);
    await models.territory.destroy({
        where: {
            id: id
        }
    });
};

module.exports.find_by_point = async(x, y) => {
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


module.exports.create = async(territory) => {
    normalize_points(territory);
    let result = await models.territory.create({
        name: territory.name,
        start_x: territory.start.x,
        start_y: territory.start.y,
        end_x: territory.end.x,
        end_y: territory.end.y,
        painted_area: 0
    });
    return format_territory(result);
};

module.exports.update_painted_area = async(id, area) => {
    return await models.territory.update(
        {
            painted_area: area
        },
        {
            where: {
                id: id
            }
        }
    )
};
module.exports.check_overlay = async(territory) => {
    try {
        const overlay = await models.territory.find({
            limit: 1,
            where: {
                $or: [
                    {
                        $and: [
                            {start_y: {$lte: territory.start.y}},
                            {end_y: {$gte: territory.start.y}},
                            {start_x: {$lte: territory.start.x}},
                            {end_x: {$gte: territory.start.x}}
                        ]
                    }, {
                        $and: [
                            {start_y: {$lte: territory.end.y}},
                            {end_y: {$gte: territory.end.y}},
                            {start_x: {$lte: territory.end.x}},
                            {end_x: {$gte: territory.end.x}}
                        ]
                    }, {
                        $and: [
                            {start_y: {$lte: territory.start.y}},
                            {end_y: {$gte: territory.start.y}},
                            {start_x: {$lte: territory.end.x}},
                            {end_x: {$gte: territory.end.x}}
                        ]
                    }, {
                        $and: [
                            {start_y: {$lte: territory.end.y}},
                            {end_y: {$gte: territory.end.y}},
                            {start_x: {$lte: territory.start.x}},
                            {end_x: {$gte: territory.start.x}}
                        ]
                    }, {
                        // the new territory cannot contain any territory
                        $and: [
                            {start_x: {$gte: territory.start.x}},
                            {start_x: {$lte: territory.end.x}},
                            {start_y: {$gte: territory.start.y}},
                            {start_y: {$lte: territory.end.y}},
                            {end_x: {$gte: territory.start.x}},
                            {end_x: {$lte: territory.end.x}},
                            {end_y: {$gte: territory.start.y}},
                            {end_y: {$lte: territory.end.y}},
                        ]
                    }
                ]
            }
        });
        return (overlay !== null);
    } catch (err) {
        error_repository.log_error(err);
        return false;
    }
};
module.exports.get_ordered_most_painted = async() => {
    let list = await models.territory.findAll({
        order: models.sequelize.literal('painted_area DESC')
    });
    let result = [];
    for (let i = 0; i < list.length; i++)
        result.push(format_territory(list[i]));
    return result;
};

module.exports.get_ordered_most_proportional_painted = async() => {
    let list = await models.territory.findAll();
    let result = [];
    for (let i = 0; i < list.length; i++) {
        let terr = format_territory(list[i]);
        terr.proportinal_painted = terr.painted_area / terr.area;
        result.push(terr);
    }
    result.sort((a, b) => {
        return b.proportinal_painted - a.proportinal_painted;
    });
    return result;
};

module.exports.get_by_point = async(x, y) => {
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
