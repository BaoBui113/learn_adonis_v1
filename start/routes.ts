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

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router
  .group(() => {
    // Auth routes
    router
      .group(() => {
        router.post('/register', [AuthController, 'register'])
        router.post('/login', [AuthController, 'login'])
        router.post('/admin-register', [AuthController, 'adminRegister'])
        router.post('/admin-login', [AuthController, 'adminLogin'])
        router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
        // router.get('/me', [AuthController, 'me']).use(middleware.auth())
        router.get('/me', [AuthController, 'me']).use(middleware.auth({ guards: ['admin'] }))
      })
      .prefix('/auth')
  })
  .prefix('/api')
