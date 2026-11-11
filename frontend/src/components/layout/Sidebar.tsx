
interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onLogout: () => void;
  userName: string;
}

function Sidebar({
  activePage,
  setActivePage,
  onLogout,
  userName,
}: SidebarProps) {
  const navigation = [
    { name: 'Dashboard', icon: '◫' },
    { name: 'Projects', icon: '▦' },
    { name: 'My Tasks', icon: '☑' },
    { name: 'Team', icon: '♧' },
      { name: 'AI Assistant', icon: '✧' },
    { name: 'Calendar', icon: '▣' },
    { name: 'Settings', icon: '⚙' },
  ];

  const initials = userName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">T</div>
        <span>TeamFlow</span>
      </div>

      <div className="workspace-label">WORKSPACE</div>

      <nav className="navigation">
        {navigation.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${
              activePage === item.name ? 'active' : ''
            }`}
            onClick={() => setActivePage(item.name)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.name}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="profile-avatar">
          {initials || 'U'}
        </div>

        <div>
          <strong>{userName}</strong>
          <span>Workspace Admin</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        style={{
          width: '100%',
          padding: '12px',
          marginTop: '15px',
          background: '#f3f4f8',
          border: 'none',
          borderRadius: '8px',
          color: '#555b70',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        ↪ Log Out
      </button>
    </aside>
  );
}

export default Sidebar;
