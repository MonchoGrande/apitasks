const router = require('express').Router({
  mergeParams: true
})

const controller = require('./controller')
const { auth, owner, verifyAdmin } = require('../auth')

/*
 /api/tasks/ POST - crear tarea --funciona
 /api/tasks / GET - Listar tareas --funciona
 /api/tasks /: id - GET - Obtener un tarea por Id --funciona
 /api/tasks /: id - PUT - Actualizar una tarea --funciona
 /api/tasks/:id- DELETE - Eliminar tarea po Id --funciona
 */

router.param('id', controller.id)

router
  .route('/')
  .post(auth, controller.parentId, controller.create)
  .get(auth, controller.parentId, controller.all)

router
  .route('/:id')
  .get(auth, owner, controller.read)
  .put(auth, owner, controller.update)
  .delete(auth, verifyAdmin, controller.deleted)

module.exports = router
