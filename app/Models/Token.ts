import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { TokenTypes } from 'App/Enums/TokenTypes'
import { string } from '@ioc:Adonis/Core/Helpers'
import AppBaseModel from './AppBaseModel'

export default class Token extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public type: TokenTypes

  @column()
  public token: string

  @column.dateTime()
  public expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  public static async generatePasswordResetToken(user: User | null) {
    const token = string.generateRandom(64)
    if (!user) return token

    await Token.expireTokens(user, 'passwordResetTokens')

    const record = await user.related('tokens').create({
      token,
      type: TokenTypes.PASSWORD_RESET,
      expiresAt: DateTime.now().plus({ hour: 1 }),
    })

    return record.token
  }

  public static async generateVerifyEmailToken(user: User | null) {
    const token = string.generateRandom(64)

    if (!user) return token

    await Token.expireTokens(user, 'verifyEmailTokens')

    const record = await user.related('tokens').create({
      type: TokenTypes.VERIFY_EMAIL,
      expiresAt: DateTime.now().plus({ hours: 24 }),
      token,
    })

    return record.token
  }

  public static async expireTokens(
    user: User,
    relationName: 'passwordResetTokens' | 'verifyEmailTokens'
  ) {
    await user.related(relationName).query().update({ expiresAt: DateTime.now() })
  }

  public static async getTokenUser(token: string, type: TokenTypes) {
    const record = await Token.query()
      .preload('user')
      .where('token', token)
      .where('type', type)
      // @ts-ignore
      .where('expiresAt', '>', DateTime.now().toSQL())
      .first()

    return record?.user
  }

  public static async verify(token: string, type: TokenTypes) {
    const record = await Token.query()
      .where('token', token)
      .where('type', type)
      .where('expires_at', '>', DateTime.now().toSQL())
      .first()

    return !!record
  }
}
