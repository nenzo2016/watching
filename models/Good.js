const db = require('../db');

module.exports = db.defineModel('good', {
    item_id: db.STRING(100),
    detail:db.TEXT("long"),
    date:db.STRING(20)
});