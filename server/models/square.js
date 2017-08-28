module.exports = (sequelize, DataTypes) => {
    const square = sequelize.define('square', {
        x: {
            type: DataTypes.INTEGER
        },
        y: {
            type: DataTypes.INTEGER
        }
    });
    square.associate = (models) => {
        models.square.belongsTo(models.territory);
    };
    return square;
};
