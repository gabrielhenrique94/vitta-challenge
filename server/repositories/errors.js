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
