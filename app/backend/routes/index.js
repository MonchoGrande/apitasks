router = require('express').Router();
const controller = require('../controller');
//const { router } = require('../server');


router.get('/datos', controller.read)
router.post('/hoja', controller.create)




 module.exports = router;
