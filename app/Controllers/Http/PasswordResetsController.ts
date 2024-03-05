import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SendToken from 'App/Mailers/PasswordReset/SendToken'
import Token from 'App/Models/Token'
import User from 'App/Models/User'
import SendPasswordResetTokenValidator from 'App/Validators/PasswordReset/SendPasswordResetTokenValidator'
import UpdatePasswordValidator from 'App/Validators/PasswordReset/UpdatePasswordValidator'

export default class PasswordResetsController {
  public async send({ request, response }: HttpContextContract) {
    const { email } = await request.validate(SendPasswordResetTokenValidator)

    const user = await User.findBy('email', email)
    const token = await Token.generatePasswordResetToken(user)

    const resetLink = `/reset-password?token=${token}`
    if (user) {
      await new SendToken(user, resetLink).sendLater()
    }

    return response.ok({
      message: 'If an account with that email exists, we sent you a password reset link.',
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const { password, token } = await request.validate(UpdatePasswordValidator)

    const user = await Token.getPasswordResetUser(token)

    if (!user) {
      return response.forbidden({
        message: 'Invalid token.',
      })
    }

    await Token.expirePasswordResetTokens(user)

    await user.merge({ password }).save()

    return response.ok({
      message: 'Password updated successfully.',
    })
  }
}
