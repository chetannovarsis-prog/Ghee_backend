// Test fetching orders from Medusa store API
const MEDUSA_BACKEND_URL = "http://localhost:9000"

async function testOrdersAPI() {
  try {
    console.log("Testing /store/orders endpoint...")
    
    // Test without auth (should fail)
    console.log("\n1. Testing without authentication:")
    const res1 = await fetch(`${MEDUSA_BACKEND_URL}/store/orders`)
    console.log("Status:", res1.status)
    const data1 = await res1.text()
    console.log("Response:", data1.substring(0, 200))
    
    // We need to get a JWT token first
    // For testing, let's try to login
    console.log("\n2. Testing with login:")
    const loginRes = await fetch(`${MEDUSA_BACKEND_URL}/auth/customer/emailpass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "ansupal01@gmail.com",
        password: "123456" // Update with actual password
      })
    })
    
    console.log("Login status:", loginRes.status)
    const loginData = await loginRes.json()
    console.log("Login response:", JSON.stringify(loginData, null, 2))
    
    if (loginData.token) {
      console.log("\n3. Testing orders with auth token:")
      const res2 = await fetch(`${MEDUSA_BACKEND_URL}/store/orders`, {
        headers: {
          "Authorization": `Bearer ${loginData.token}`
        }
      })
      console.log("Status:", res2.status)
      const data2 = await res2.json()
      console.log("Orders count:", data2.orders?.length || 0)
      console.log("Orders:", JSON.stringify(data2, null, 2))
    }
    
  } catch (error) {
    console.error("Error:", error)
  }
}

testOrdersAPI()
