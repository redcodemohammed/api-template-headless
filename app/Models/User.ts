import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Token from './Token'
import { TokenTypes } from 'App/Enums/TokenTypes'
import AppBaseModel from './AppBaseModel'
import VerifyEmail from 'App/Mailers/VerifyEmails/VerifyEmail'

export default class User extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public username: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column()
  public isEmailVerified: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Token)
  public tokens: HasMany<typeof Token>

  @hasMany(() => Token, {
    onQuery(query) {
      return query.where('type', TokenTypes.PASSWORD_RESET)
    },
  })
  public passwordResetTokens: HasMany<typeof Token>

  @hasMany(() => Token, {
    onQuery(query) {
      return query.where('type', TokenTypes.VERIFY_EMAIL)
    },
  })
  public verifyEmailTokens: HasMany<typeof Token>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  public async sendVerifyEmail() {
    const token = await Token.generateVerifyEmailToken(this)
    await new VerifyEmail(this, token).sendLater()
  }
}
