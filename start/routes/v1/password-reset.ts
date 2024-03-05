import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/send', 'PasswordResetsController.send').middleware(['throttle:email'])
  Route.patch('/store', 'PasswordResetsController.store').as('password.store')
})
  .prefix('/password-reset')
  .prefix('/v1')
