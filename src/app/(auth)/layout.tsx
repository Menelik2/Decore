export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Auth pages use their own full-screen layout (no main nav/footer chrome needed in the form area)
  return <>{children}</>
}
