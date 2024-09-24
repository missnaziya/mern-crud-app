const todoController = require('./../controllers/todoController')
const auth = require('./../middleware/auth')
const express = require('express')


const router = express.Router();

router.post('/add-todo',auth, todoController.addTodoList)
router.put('/update-todo/:todoId',auth, todoController.updateTodo)
router.get('/get-todo/:todoId',auth, todoController.getById)
router.get('/get-all-todo',auth, todoController.getAllTodo  )
router.delete('/delete-todo/:todoId',auth, todoController.deleteById)



// router.post('/log-in', authController.login)
// router.get('/me',auth, authController.me)

module.exports = router