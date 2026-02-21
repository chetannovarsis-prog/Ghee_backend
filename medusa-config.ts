import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

export default defineConfig({
  admin: {
    disable: false,
    path: "/app",
    backendUrl: "https://ghee-backend-ewtj.onrender.com",
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:8000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:5173,http://localhost:9000,https://ghee-backend-ewtj.onrender.com",
      authCors: process.env.AUTH_CORS || "http://localhost:5173,http://localhost:9000,http://localhost:8000,https://ghee-backend-ewtj.onrender.com",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: {
    [Modules.PAYMENT]: {
      resolve: "@medusajs/payment",
      options: {
        providers: [

          {
            resolve: "./src/modules/razorpay/index",
            id: "razorpay",
            options: {
              key_id: process.env.RAZORPAY_KEY_ID,
              key_secret: process.env.RAZORPAY_KEY_SECRET,
            },
          },
        ],
      },
    },
    [Modules.AUTH]: {
      resolve: "@medusajs/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/auth-emailpass",
            id: "emailpass",
            options: {},
          },
          {
            resolve: "@medusajs/auth-google",
            id: "google",
            options: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              callbackUrl: `${process.env.STORE_URL}/auth/google/callback`,
            },
          },
        ],
      },
    },
    "email_notifications": {
      resolve: "./src/modules/email_notifications",
      options: {
        api_key: process.env.RESEND_API_KEY || "re_Z769135M_4uG2Lb8rRWW3sJgxjrA5EzD5",
        from: "onboarding@resend.dev",
      },
    },
  },
})
