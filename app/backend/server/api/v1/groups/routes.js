const router = require('express').Router({
  mergeParams: true
})

const controller = require('./controller')
const { auth, verifyAdmin } = require('../auth')

/*
 /api/groups/ POST - Crear grupo --funciona
 /api/groups/ GET - Listar grupos --funciona
 /api/groups/: id - GET - Obtener un grupo por Id --funciona
 /api/groups /: id - PUT - Actualizar un grupo --funciona
 /api/groups/:id- DELETE - Eliminar un grupo --funciona
 */

router.param('id', controller.id)

router.route('/').post(auth, verifyAdmin, controller.create).get(auth, verifyAdmin, controller.all)

router
  .route('/:id')
  .get(auth, controller.read)
  .put(auth, verifyAdmin, controller.update)
  .delete(auth, verifyAdmin, controller.deleted)

module.exports = router
