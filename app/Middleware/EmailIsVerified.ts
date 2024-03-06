import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EmailIsVerified {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    const user = auth.user!
    if (!user.isEmailVerified) {
      return response.forbidden({ message: 'Email is not verified' })
    }
    await next()
  }
}
