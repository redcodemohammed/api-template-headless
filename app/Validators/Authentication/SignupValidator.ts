import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SignupValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
    username: schema.string({}, [
      rules.minLength(3),
      rules.maxLength(32),
      rules.unique({ table: 'users', column: 'username' }),
    ]),
    password: schema.string({}, [rules.minLength(8), rules.maxLength(32)]),
  })
}
