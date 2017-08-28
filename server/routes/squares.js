const express = require('express');
const router = express.Router({mergeParams: true});
const repository = require('../repositories').square;
const utils = require('./api_utils');
const error_repository = require('../repositories').error;

module.exports.get_by_coordinates = async(req, res) => {
    const x = req.params.x;
    const y = req.params.y;
    let is_in_territory = await repository.is_in_territory(x, y);
    if (is_in_territory) {
        utils.send_error(res, utils.errors.BAD_REQUEST, 'squares/not-found');
        return;
    }

    try {
        let square = await repository.get_by_coordinates(x, y);
        square.painted = true;
        res.status(200).send({
            data: {
                x: x,
                y: y,
                painted: true
            },
            error: false
        });
    } catch (err) {
        error_repository.log_error(err);
        res.status(200).send({
            data: {
                x: x,
                y: y,
                painted: false
            },
            error: false
        });
    }
};


module.exports.paint = async(req, res) => {
    const x = req.params.x;
    const y = req.params.y;

    let is_in_territory = await repository.is_in_territory(x, y);
    if (!is_in_territory) {
        utils.send_error(res, utils.errors.BAD_REQUEST, 'squares/not-found');
        return;
    }
    try {
        let square = await repository.paint(x, y);
        res.status(200).send({
            error: false,
            data: square
        });
    } catch (err) {
        error_repository.log_error(err);
        utils.send_error(res, utils.errors.INTERNAL_SERVER_ERROR, 'squares/internal_server_error');
    }
};

router.patch('/:x/:y/paint', module.exports.paint);
router.get('/:x/:y', module.exports.get_by_coordinates);

module.exports.router = router;