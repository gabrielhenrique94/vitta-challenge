module.exports = (sequelize, DataTypes) => {
    const error = sequelize.define('error', {
        message: {
            type: DataTypes.STRING
        },
        route: {
            type: DataTypes.STRING
        }
    });
    error.associate = (models) => {

    };
    return square;
};
