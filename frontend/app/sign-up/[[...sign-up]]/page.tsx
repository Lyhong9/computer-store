import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      suppressHydrationWarning
      className="flex min-h-screen flex-col items-center justify-center p-6 bg-radial-[at_50%_0%] from-indigo-950/40 via-zinc-950 to-zinc-950"
    >
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 mb-3">
            Instant Customer Registration
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Create an Account
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Join TechShop. All new registrations automatically receive the <span className="font-semibold text-indigo-400">Customer</span> role.
          </p>
        </div>

        <SignUp
          appearance={{
            elements: {
              card: "bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl",
              headerTitle: "text-zinc-100",
              headerSubtitle: "text-zinc-400",
              formButtonPrimary:
                "bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30",
              socialButtonsBlockButton:
                "border border-zinc-700 hover:bg-zinc-800 text-zinc-200 transition-colors",
              formFieldLabel: "text-zinc-300",
              formFieldInput:
                "bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500",
              footerActionLink: "text-indigo-400 hover:text-indigo-300",
              identityPreviewText: "text-zinc-300",
              identityPreviewEditButtonIcon: "text-zinc-400",
            },
          }}
        />
      </div>
    </div>
  );
}
