import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault()
    // Add your sign in logic here

    console.log("Signing in with:", email, password)

    const userData = {
        email,
        password
    }

    try {
        // Make the API call to the backend
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })
        // console.log("here is api ", process.env.REACT_APP_BASE_URL)
        const data = await response.json()

        if (response.ok) {
            console.log("SignIn successful:", data)
            localStorage.setItem("authToken", data.token)
            localStorage.setItem("user", JSON.stringify(data.updateUser.name))
            toast.success("Sign in successful")
            // Redirect the user to the login page after successful signup
            navigate("/")
          } else {
            toast.error("Sign in failed")
            console.error("Signup failed:", data)
          }
        } catch (error) {
            toast.error("Sign in failed")
          console.error("Error during signup:", error)
        }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-500">Sign in to continue to manage your Notes</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email/Username
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Sign In
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Not a member yet?{" "}
              <button onClick={() => navigate("/signup")} className="text-[#8B5CF6] hover:underline font-medium">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn

