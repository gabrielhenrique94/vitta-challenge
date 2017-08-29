const models = require('../models');


module.exports.log_error = async(error) => {
    console.log(error);
    try {
        await models.error.create({
            error: error
        });
    } catch (err) {
        console.log(err);
    }
};
module.exports.list_last_five = async() => {
    return await models.error.findAll({
        limit: 5,
        order: models.sequelize.literal('createdAt DESC'),
    });
};
