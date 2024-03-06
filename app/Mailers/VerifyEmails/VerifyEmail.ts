import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'

export default class VerifyEmail extends BaseMailer {
  constructor(
    private user: User,
    private token: string
  ) {
    super()
  }
  public prepare(message: MessageContract) {
    const url = `${Env.get('FRONTEND_DOMAIN')}/verify-email?token=${this.token}`
    message
      .subject('The email subject')
      .html(
        `
        Dear ${this.user.email}
        please verify your account via <a href="${url}">This link</a>
      `
      )
      .from(Env.get('APP_EMAIL'))
      .to(this.user.email)
  }
}
