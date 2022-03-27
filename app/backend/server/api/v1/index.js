const router = require('express').Router()
const tasks = require('./tasks/routes')
const users = require('./users/routes')
const groups = require('./groups/routes')

router.use('/users', users)
router.use('/tasks', tasks)
router.use('/groups', groups)

module.exports = router
