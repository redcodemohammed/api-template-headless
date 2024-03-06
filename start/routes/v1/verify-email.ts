import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/', 'VerifyEmailsController.send')
    .middleware('throttle:email')
    .as('email.verify.send')
  Route.patch('/', 'VerifyEmailsController.store').as('email.verify.store')
})
  .prefix('/verify-email')
  .prefix('/v1')
  .middleware('auth')
