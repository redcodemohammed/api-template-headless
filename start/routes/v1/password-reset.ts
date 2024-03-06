import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'PasswordResetsController.send').middleware(['throttle:email'])
  Route.patch('/', 'PasswordResetsController.store').as('password.store')
})
  .prefix('/password-reset')
  .prefix('/v1')
