import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TokenTypes } from 'App/Enums/TokenTypes'
import Token from 'App/Models/Token'
import VerifyEmailValidator from 'App/Validators/VerifyEmail/VerifyEmail'

export default class VerifyEmailsController {
  public async send({ auth, response }: HttpContextContract) {
    if (!auth.user?.isEmailVerified) {
      await auth.user?.sendVerifyEmail()
      return response.ok({
        message: 'Email sent successfully',
      })
    }

    return response.badRequest('Email already verified')
  }

  public async store({ request, response, auth }: HttpContextContract) {
    if (auth.user?.isEmailVerified) {
      return response.badRequest('Email already verified')
    }

    const { token } = await request.validate(VerifyEmailValidator)
    const user = await Token.getTokenUser(token, TokenTypes.VERIFY_EMAIL)

    const isMatch = user?.id === auth.user?.id

    if (!user || !isMatch) {
      return response.forbidden('Invalid token.')
    }

    await Token.expireTokens(user, 'verifyEmailTokens')

    await user.merge({ isEmailVerified: true }).save()

    return response.ok({
      message: 'Email verified successfully.',
    })
  }
}
