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
const SkillsController = () => import('#controllers/skill_controller')
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
        router.post('/admin-register', [AuthController, 'adminRegister'])
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
    // Skill
    router
      .group(() => {
        router.get('/', [SkillsController, 'index'])
        router.post('/', [SkillsController, 'store'])
        router.get('/:id', [SkillsController, 'show'])
        router.put('/:id', [SkillsController, 'update'])
        router.delete('/:id', [SkillsController, 'destroy'])
      })
      .prefix('/skill')
  })
  .prefix('/api')
