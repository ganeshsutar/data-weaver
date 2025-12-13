import { Authenticator } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import {
  RouterProvider,
  createBrowserRouter,
  Outlet,
} from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { ThemeProvider } from "@/components/ThemeProvider"
import { HomePage } from "@/pages/HomePage"
import { AnalysisPage } from "@/pages/AnalysisPage"

interface AuthenticatedLayoutProps {
  user?: {
    username?: string
    signInDetails?: { loginId?: string }
  }
  signOut?: () => void
}

function AuthenticatedLayout({ user, signOut }: AuthenticatedLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          username: user?.username,
          email: user?.signInDetails?.loginId,
        }}
        onSignOut={signOut}
      />
      <Outlet />
    </SidebarProvider>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Authenticator>
        {({ user, signOut }) => {
          const router = createBrowserRouter([
            {
              path: "/",
              element: (
                <AuthenticatedLayout user={user} signOut={signOut} />
              ),
              children: [
                {
                  index: true,
                  element: <HomePage />,
                },
                {
                  path: ":analysisId",
                  element: <AnalysisPage />,
                },
              ],
            },
          ])

          return <RouterProvider router={router} />
        }}
      </Authenticator>
    </ThemeProvider>
  )
}

export default App
