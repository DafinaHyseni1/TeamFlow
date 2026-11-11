import { useState } from 'react';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');

  const [profile, setProfile] = useState({
    name: 'Dafina Hyseni',
    email: 'dafina@example.com',
    role: 'Workspace Admin',
    bio: 'Managing projects and collaborating with the team.',
  });

  const [workspace, setWorkspace] = useState({
    name: 'TeamFlow Workspace',
    description: 'Our team workspace for managing projects and tasks.',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    taskUpdates: true,
    projectUpdates: false,
    teamActivity: true,
  });

  const tabs = ['Profile', 'Workspace', 'Notifications', 'Security'];

  const updateProfile = (field: string, value: string) => {
    setProfile((previous) => ({ ...previous, [field]: value }));
  };

  const updateWorkspace = (field: string, value: string) => {
    setWorkspace((previous) => ({ ...previous, [field]: value }));
  };

  const toggleNotification = (field: keyof typeof notifications) => {
    setNotifications((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  return (
    <section className="dashboard-content">
      <div className="welcome-section">
        <div>
          <p className="date-label">WORKSPACE / SETTINGS</p>
          <h1>Settings</h1>
          <p className="welcome-description">
            Manage your account, workspace, and preferences.
          </p>
        </div>
      </div>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <h3>Preferences</h3>

          {tabs.map((tab) => (
            <button
              key={tab}
              className={`settings-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <span>
                {tab === 'Profile' ? '♙' :
                 tab === 'Workspace' ? '▦' :
                 tab === 'Notifications' ? '♧' : '⚙'}
              </span>
              {tab}
            </button>
          ))}
        </aside>

        <div className="settings-content">
          {activeTab === 'Profile' && (
            <section className="settings-panel">
              <div className="settings-panel-heading">
                <div>
                  <h2>Profile Information</h2>
                  <p>Update your personal account information.</p>
                </div>
                <div className="settings-avatar">DH</div>
              </div>

              <div className="settings-form">
                <label>
                  Full Name
                  <input
                    value={profile.name}
                    onChange={(event) => updateProfile('name', event.target.value)}
                  />
                </label>

                <label>
                  Email Address
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(event) => updateProfile('email', event.target.value)}
                  />
                </label>

                <label>
                  Role
                  <input value={profile.role} disabled />
                </label>

                <label>
                  About
                  <textarea
                    value={profile.bio}
                    onChange={(event) => updateProfile('bio', event.target.value)}
                    rows={4}
                  />
                </label>
              </div>

              <div className="settings-actions">
                <button className="save-button">Save Changes</button>
              </div>
            </section>
          )}

          {activeTab === 'Workspace' && (
            <section className="settings-panel">
              <div className="settings-panel-heading">
                <div>
                  <h2>Workspace Settings</h2>
                  <p>Manage your workspace details and information.</p>
                </div>
              </div>

              <div className="settings-form">
                <label>
                  Workspace Name
                  <input
                    value={workspace.name}
                    onChange={(event) => updateWorkspace('name', event.target.value)}
                  />
                </label>

                <label>
                  Workspace Description
                  <textarea
                    value={workspace.description}
                    onChange={(event) => updateWorkspace('description', event.target.value)}
                    rows={4}
                  />
                </label>
              </div>

              <div className="settings-actions">
                <button className="save-button">Save Changes</button>
              </div>
            </section>
          )}

          {activeTab === 'Notifications' && (
            <section className="settings-panel">
              <div className="settings-panel-heading">
                <div>
                  <h2>Notification Preferences</h2>
                  <p>Choose which updates you want to receive.</p>
                </div>
              </div>

              <div className="notification-settings">
                {[
                  {
                    key: 'email' as const,
                    title: 'Email Notifications',
                    description: 'Receive important updates through email.',
                  },
                  {
                    key: 'taskUpdates' as const,
                    title: 'Task Updates',
                    description: 'Get notified when tasks are updated.',
                  },
                  {
                    key: 'projectUpdates' as const,
                    title: 'Project Updates',
                    description: 'Stay informed about project progress.',
                  },
                  {
                    key: 'teamActivity' as const,
                    title: 'Team Activity',
                    description: 'Receive updates about team activity.',
                  },
                ].map((item) => (
                  <div className="notification-option" key={item.key}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>

                    <button
                      className={`toggle-switch ${notifications[item.key] ? 'enabled' : ''}`}
                      onClick={() => toggleNotification(item.key)}
                      aria-label={`Toggle ${item.title}`}
                      aria-pressed={notifications[item.key]}
                    >
                      <span />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'Security' && (
            <section className="settings-panel">
              <div className="settings-panel-heading">
                <div>
                  <h2>Security Settings</h2>
                  <p>Manage your account security and access.</p>
                </div>
              </div>

              <div className="security-option">
                <div>
                  <h3>Password</h3>
                  <p>Keep your account secure with a strong password.</p>
                </div>
                <button className="secondary-button" disabled>
                  Coming Soon
                </button>
              </div>

              <div className="security-option">
                <div>
                  <h3>Two-Factor Authentication</h3>
                  <p>Add another layer of protection to your account.</p>
                </div>
                <span className="coming-soon-label">Coming Soon</span>
              </div>

              <div className="security-option">
                <div>
                  <h3>Active Sessions</h3>
                  <p>Review devices connected to your account.</p>
                </div>
                <span className="coming-soon-label">Coming Soon</span>
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}

export default SettingsPage;
