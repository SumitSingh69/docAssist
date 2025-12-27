export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-8 px-6">
        <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>
        {children}
      </div>
    </div>
  );
}
