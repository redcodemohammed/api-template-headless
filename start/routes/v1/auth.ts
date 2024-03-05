import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('signin', 'AuthenticationController.signin').as('signin')
  Route.post('signup', 'AuthenticationController.signup').as('signup')
  Route.post('logout', 'AuthenticationController.logout').as('logout')
  Route.get('me', 'AuthenticationController.me').as('me').middleware('auth')
})
  .as('auth')
  .prefix('auth')
  .prefix('v1')
