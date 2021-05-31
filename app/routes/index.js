const checkRoutes = require('./check_routes');
module.exports = function(app, db) {
    checkRoutes(app, db);
};