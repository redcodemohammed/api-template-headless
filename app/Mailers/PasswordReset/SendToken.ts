import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'

export default class SendToken extends BaseMailer {
  constructor(
    private user: User,
    private url: string
  ) {
    super()
  }
  public prepare(message: MessageContract) {
    message
      .subject('Password reset')
      .html(
        `Visit this URL to reset your password <a href="${Env.get('FRONTEND_DOMAIN')}${
          this.url
        }">click here</a>`
      )
      .from(Env.get('APP_EMAIL'))
      .to(this.user.email)
  }
}
