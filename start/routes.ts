/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')
const PostsController = () => import('#controllers/post_controller')
const UserController = () => import('#controllers/user_controller')
router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router
  .group(() => {
    // User routes
    router
      .group(() => {
        router.get('/', [UserController, 'index'])
        router.get('/:id', [UserController, 'show'])
      })
      .prefix('/users')
    // Auth routes
    router
      .group(() => {
        router.post('/register', [AuthController, 'register'])
        router.post('/login', [AuthController, 'login'])
        router.post('/admin-login', [AuthController, 'adminLogin'])
        router
          .post('/logout', [AuthController, 'logout'])
          .use(middleware.auth({ guards: ['admin', 'user'] }))
        router.get('/me', [AuthController, 'me']).use(middleware.auth({ guards: ['admin'] }))
      })
      .prefix('/auth')
    // Post routes
    router
      .group(() => {
        router.get('/', [PostsController, 'index'])
        router.post('/', [PostsController, 'create']).use(middleware.auth({ guards: ['admin'] }))
        router.get('/:id', [PostsController, 'show'])
        router.put('/:id', [PostsController, 'update']).use(middleware.auth({ guards: ['admin'] }))
        router
          .delete('/:id', [PostsController, 'destroy'])
          .use(middleware.auth({ guards: ['admin'] }))
      })
      .prefix('/posts')
  })
  .prefix('/api')
