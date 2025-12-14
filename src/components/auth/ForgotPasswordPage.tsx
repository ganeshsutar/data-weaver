import { useState, FormEvent } from "react"
import { resetPassword, confirmResetPassword } from "aws-amplify/auth"
import { useAuthNavigation } from "./AuthPages"
import { Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

function ConfirmResetWithEmail({
  email,
  toSignIn,
}: {
  email: string
  toSignIn: () => void
}) {
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      })
      toSignIn()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Password reset failed"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Database className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold">Cultural Pulse</span>
          </div>
          <CardTitle className="text-2xl">Set new password</CardTitle>
          <CardDescription>
            Enter the code from your email and your new password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                autoComplete="one-time-code"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset password"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Back to{" "}
            <button
              type="button"
              onClick={() => toSignIn()}
              className="text-foreground hover:underline"
            >
              Sign in
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export function ForgotPasswordPage() {
  const { toSignIn } = useAuthNavigation()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await resetPassword({ username: email })
      setCodeSent(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send reset code"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (codeSent) {
    return <ConfirmResetWithEmail email={email} toSignIn={toSignIn} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Database className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold">Cultural Pulse</span>
          </div>
          <CardTitle className="text-2xl">Reset password</CardTitle>
          <CardDescription>
            Enter your email and we'll send you a reset code
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              variant="secondary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send reset code"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => toSignIn()}
              className="text-foreground hover:underline"
            >
              Sign in
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
