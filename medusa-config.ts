import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Aggressive production detection
// Foolproof indicator: Render is Linux, you are on Windows. 
// Also check for Render-specific PORT.
const isProduction = process.env.NODE_ENV === "production" ||
  !!process.env.RENDER ||
  process.platform !== "win32" ||
  process.env.PORT === "10000" ||
  process.env.ADMIN_URL?.includes("onrender.com") ||
  process.env.DATABASE_URL?.includes("render.com")

// const productionStoreUrl = "https://full-ghee.vercel.app"

// Hard-code production URLs if we detect we are NOT on a local machine
const storeUrl = "https://full-ghee.vercel.app"
const googleCallbackUrl = "https://full-ghee.vercel.app/auth/google/callback"

console.log("--- MEDUSA CONFIG DIAGNOSTICS ---")
console.log("NODE_ENV:", process.env.NODE_ENV)
console.log("IS_PRODUCTION:", isProduction)
console.log("STORE_URL:", storeUrl)
console.log("GOOGLE_CALLBACK_URL:", googleCallbackUrl)
console.log("--- END DIAGNOSTICS ---")

export default defineConfig({
  admin: {
    disable: false,
    path: "/app",
    backendUrl: "https://ghee-backend-ewtj.onrender.com",
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS || `${storeUrl},https://docs.medusajs.com`,
      adminCors: process.env.ADMIN_CORS || "http://localhost:5173,http://localhost:9000,https://ghee-backend-ewtj.onrender.com",
      authCors: process.env.AUTH_CORS || `http://localhost:5173,http://localhost:9000,${storeUrl},https://ghee-backend-ewtj.onrender.com`,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: {
    /* fileService was removed — resolve path './src/services/file' does not exist.
       Medusa will use its built-in default local file service. */
    [Modules.PAYMENT]: {
      resolve: "@medusajs/payment",
      options: {
        providers: [
          /* Razorpay - Commented out, preserved for future use
          {
            resolve: "./src/modules/razorpay/index",
            id: "razorpay",
            options: {
              key_id: process.env.RAZORPAY_KEY_ID,
              key_secret: process.env.RAZORPAY_KEY_SECRET,
            },
          },
          */
          {
            resolve: "./src/modules/system-payment",
            id: "manual",
            options: {},
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
              callbackUrl: googleCallbackUrl,
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

