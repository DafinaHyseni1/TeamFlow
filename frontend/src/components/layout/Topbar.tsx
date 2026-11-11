interface TopbarProps {
  activePage: string;
  userName: string;
}

function Topbar({ activePage, userName }: TopbarProps) {
  const initials = userName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="topbar">
      <div className="breadcrumb">
        Workspace / {activePage}
      </div>

      <div className="topbar-right">
        <button
          className="notification-button"
          aria-label="Notifications"
        >
          ♧
        </button>

        <div className="header-avatar">
          {initials || 'U'}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
