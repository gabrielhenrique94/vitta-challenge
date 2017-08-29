const express = require('express');
const router = express.Router({mergeParams: true});
const square_repository = require('../repositories').square;
const territory_repository = require('../repositories').territory;
const utils = require('./api_utils');
const error_repository = require('../repositories').error;

module.exports.dashboard = async(req, res) => {
    var data = {
        terr_by_painted: await territory_repository.get_ordered_most_painted(),
        terr_by_proportional_painted: await territory_repository.get_ordered_most_proportional_painted(),
        painted_squares: await square_repository.list_last_five_painted(),
        errors: await error_repository.list_last_five()
    };
    let total_area = 0;
    let total_painted_area = 0;
    for (let i = 0; i < data.terr_by_painted.length; i++) {
        total_area += data.terr_by_painted[i].area;
        total_painted_area += data.terr_by_painted[i].painted_area;
    }
    data.proportional_area = total_painted_area / total_area;

    res.render('dashboard', data);
};

router.get('/', module.exports.dashboard);

module.exports.router = router;