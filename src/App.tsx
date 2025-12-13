import { Authenticator } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Dashboard } from "@/pages/Dashboard"

function App() {
  return (
    <div className="dark">
      <Authenticator>
        {({ user, signOut }) => (
          <SidebarProvider>
            <AppSidebar
              user={{
                username: user?.username,
                email: user?.signInDetails?.loginId,
              }}
            />
            <Dashboard />
            {/* Hidden signOut button - can be used in sidebar later */}
            <button
              onClick={signOut}
              className="hidden"
              aria-hidden="true"
            >
              Sign Out
            </button>
          </SidebarProvider>
        )}
      </Authenticator>
    </div>
  )
}

export default App
