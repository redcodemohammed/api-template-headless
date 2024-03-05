import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import SignupValidator from 'App/Validators/Authentication/SignupValidator'

export default class AuthenticationController {
  public async logout({ auth }: HttpContextContract) {
    await auth.logout()
  }

  public async signin({ request, auth }: HttpContextContract) {
    const { uid, password } = await request.only(['uid', 'password'])

    const token = await auth.attempt(uid, password)

    return token
  }

  public async me({ auth }: HttpContextContract) {
    return auth.user
  }

  public async signup({ request, auth }: HttpContextContract) {
    const { email, password, username } = await request.validate(SignupValidator)

    const user = await User.create({ email, password, username })

    const token = await auth.login(user)

    return token
  }
}
