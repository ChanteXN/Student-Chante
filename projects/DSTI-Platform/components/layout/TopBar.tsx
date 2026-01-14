interface TopBarProps {
  title?: string;
  user?: {
    name: string;
    email: string;
  };
  actions?: React.ReactNode;
}

export function TopBar({ title, user, actions }: TopBarProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="px-8 py-4 flex items-center justify-between">
        <div>
          {title && <h1 className="text-xl font-semibold text-gray-900">{title}</h1>}
        </div>
        <div className="flex items-center gap-4">
          {actions}
          {user && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
