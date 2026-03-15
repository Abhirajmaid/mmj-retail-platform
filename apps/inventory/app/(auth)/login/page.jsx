export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[hsl(223,84%,20%)] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">MMJ Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to continue</p>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="you@mmjewellers.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-[hsl(223,84%,25%)] text-white rounded-lg py-2.5 text-sm font-semibold hover:opacity-90">
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
}
