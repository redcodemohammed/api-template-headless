import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ApiResponseMiddleware {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    // Execute the next middleware or route handler
    try {
      await next()
    } catch (error) {
      // console.log(error)
      ctx.response.status(error.status || 500).json({
        success: false,
        code: error.status || 500,
        message: error.message,
        errors: error?.messages?.errors,
      })
      return // Stop further middleware execution
    }

    // Check if the response is successful (status code 2xx)
    if (ctx.response.response.statusCode >= 200 && ctx.response.response.statusCode < 400) {
      ctx.response.json({
        success: true,
        code: ctx.response.response.statusCode,
        data: ctx.response.getBody(),
      })
    }

    // check for errors and handle them in the same way
    if (ctx.response.response.statusCode >= 400) {
      ctx.response.json({
        success: false,
        code: ctx.response.response.statusCode,
        message: ctx.response.getBody(),
      })
    }
  }
}
