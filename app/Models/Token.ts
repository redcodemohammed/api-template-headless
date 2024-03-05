import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { TokenTypes } from 'App/Enums/TokenTypes'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class Token extends BaseModel {
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

    await Token.expirePasswordResetTokens(user)

    const record = await user.related('tokens').create({
      token,
      type: TokenTypes.PASSWORD_RESET,
      expiresAt: DateTime.now().plus({ hour: 1 }),
    })

    return record.token
  }

  public static async expirePasswordResetTokens(user: User) {
    await user.related('passwordResetTokens').query().update({ expiresAt: DateTime.now() })
  }

  public static async getPasswordResetUser(token: string) {
    const record = await Token.query()
      .where('token', token)
      .where('type', TokenTypes.PASSWORD_RESET)
      .where('expires_at', '>', DateTime.now().toSQL())
      .first()

    return record?.user
  }

  public static async verify(token: string) {
    const record = await Token.query()
      .where('token', token)
      .where('expires_at', '>', DateTime.now().toSQL())
      .first()

    return !!record
  }
}
