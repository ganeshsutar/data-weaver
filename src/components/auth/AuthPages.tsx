import { useState, createContext, useContext } from "react"
import { LoginPage } from "./LoginPage"
import { SignUpPage } from "./SignUpPage"
import { ConfirmSignUpPage } from "./ConfirmSignUpPage"
import { ForgotPasswordPage } from "./ForgotPasswordPage"
import { ConfirmResetPage } from "./ConfirmResetPage"

type AuthRoute = "signIn" | "signUp" | "confirmSignUp" | "forgotPassword" | "confirmResetPassword"

interface AuthContextType {
  route: AuthRoute
  email: string
  toSignIn: () => void
  toSignUp: () => void
  toConfirmSignUp: (email: string) => void
  toForgotPassword: () => void
  toConfirmResetPassword: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuthNavigation() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthNavigation must be used within AuthPages")
  }
  return context
}

export function AuthPages() {
  const [route, setRoute] = useState<AuthRoute>("signIn")
  const [email, setEmail] = useState("")

  const authNavigation: AuthContextType = {
    route,
    email,
    toSignIn: () => setRoute("signIn"),
    toSignUp: () => setRoute("signUp"),
    toConfirmSignUp: (userEmail: string) => {
      setEmail(userEmail)
      setRoute("confirmSignUp")
    },
    toForgotPassword: () => setRoute("forgotPassword"),
    toConfirmResetPassword: () => setRoute("confirmResetPassword"),
  }

  return (
    <AuthContext.Provider value={authNavigation}>
      {route === "signIn" && <LoginPage />}
      {route === "signUp" && <SignUpPage />}
      {route === "confirmSignUp" && <ConfirmSignUpPage />}
      {route === "forgotPassword" && <ForgotPasswordPage />}
      {route === "confirmResetPassword" && <ConfirmResetPage />}
    </AuthContext.Provider>
  )
}
