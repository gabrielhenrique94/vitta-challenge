const express = require('express');
const router = express.Router({mergeParams: true});
const repository = require('../repositories').territory;
const squares_repository = require('../repositories').square;
const utils = require('./api_utils');

const validade_territory = (territory) => {
    if (territory.name === undefined) return false;
    if (territory.start === undefined) return false;
    if (territory.start.x === undefined) return false;
    if (territory.start.y === undefined) return false;
    if (territory.end === undefined) return false;
    if (territory.end.x === undefined) return false;
    if (territory.end.y === undefined) return false;
    return true;
};

module.exports.list_territories = async(req, res) => {
    try {
        let data = await repository.list_all();
        res.status(200).send({
            count: data.length,
            data: data
        });
    } catch (err) {
        console.log(err);
        utils.send_error(res, utils.errors.INTERNAL_SERVER_ERROR, 'server/internal-server-error');
    }
};

module.exports.get_territory = async(req, res) => {
    const id = req.params.id;
    const with_painted = req.query.withpainted || false;
    try {
        const territory = await repository.get_by_id(id);
        if (with_painted) {
            territory.painted_squares = await squares_repository.get_by_territory_id(territory.id);
        }
        res.status(200).send({
            data: territory,
            error: false
        });
    } catch (err) { // when territory is not found, promisse is rejected
        console.log(err);
        utils.send_error(res, utils.errors.NOT_FOUND, 'territories/not-found');
    }
};

module.exports.delete_territory = async(req, res) => {
    const id = req.params.id;
    try {
        const territory = await repository.get_by_id(id);
    } catch (err) { //when territory is not found, promisse is rejected
        console.log(err);
        utils.send_error(res, utils.errors.NOT_FOUND, 'territories/not-found');
        return; // don't try to delete if territory not exists.
    }
    try {
        await repository.delete(id);
        res.status(200).send({
            error: false
        });
    } catch (err) { // when territory is not found, promisse is rejected
        console.log(err);
        utils.send_error(res, utils.errors.INTERNAL_SERVER_ERROR, 'server/internal-server-error');
    }
};


module.exports.create_territory = async(req, res) => {
    let territory = req.body;
    if (!validade_territory(territory)) {
        utils.send_error(res, utils.errors.BAD_REQUEST, 'territories/incomplete-data');
        return;
    }
    if (await repository.check_overlay(territory)) {
        utils.send_error(res, utils.errors.BAD_REQUEST, 'territories/territory-overlay');
        return;
    }
    try {
        let created_territory = await repository.create(territory);
        res.status(200).send(created_territory);
    } catch (err) {
        utils.send_error(res, utils.errors.INTERNAL_SERVER_ERROR, 'server/internal-server-error');
        console.log(err);
    }
};

router.get('/', module.exports.list_territories);
router.post('/', module.exports.create_territory);
router.get('/:id', module.exports.get_territory);
router.delete('/:id', module.exports.delete_territory);
module.exports.router = router;