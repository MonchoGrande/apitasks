const router = require('express').Router()
const taskRouter = require('../tasks/routes')
const controller = require('./controller')
const { auth, verifyAdmin } = require('../auth')

/*
 /api/users/singup POST - Crear usuario --funciona
 /api/users / GET - Listar usuarios --funciona
 /api/users/signin - POST -Login --funciona
 /api/users /: id - GET - Obtener un usuario por Id --funciona
 /api/users /: id - PUT - Actualizar un usuario --funciona
 /api/users/:id- DELETE - Eliminar usuario
 */

router.param('id', controller.id)

router.route('/').get(auth, verifyAdmin, controller.all)
router.route('/signin').post(controller.signin)
router.route('/signup').post(auth, verifyAdmin, controller.signup)

router
  .route('/:id')
  .get(auth, verifyAdmin, controller.read)
  .put(auth, verifyAdmin, controller.update)
  .delete(auth, verifyAdmin, controller.deleted)

router.use('/:userId/tasks', taskRouter)

module.exports = router
