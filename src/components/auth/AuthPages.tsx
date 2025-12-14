import { useAuthenticator } from "@aws-amplify/ui-react"
import { LoginPage } from "./LoginPage"
import { SignUpPage } from "./SignUpPage"
import { ConfirmSignUpPage } from "./ConfirmSignUpPage"
import { ForgotPasswordPage } from "./ForgotPasswordPage"
import { ConfirmResetPage } from "./ConfirmResetPage"

export function AuthPages() {
  const { route } = useAuthenticator()

  switch (route) {
    case "signIn":
      return <LoginPage />
    case "signUp":
      return <SignUpPage />
    case "confirmSignUp":
      return <ConfirmSignUpPage />
    case "forgotPassword":
      return <ForgotPasswordPage />
    case "confirmResetPassword":
      return <ConfirmResetPage />
    default:
      return <LoginPage />
  }
}
