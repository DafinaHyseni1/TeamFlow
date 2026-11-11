import { useState } from 'react';
import type { TeamMember } from '../../types';

interface TeamPageProps {
  teamMembers: TeamMember[];
  onCreateMember: (member: TeamMember) => void;
  onUpdateMember: (member: TeamMember) => void;
  onDeleteMember: (memberId: number) => void;
}

function TeamPage({
  teamMembers,
  onCreateMember,
  onUpdateMember,
  onDeleteMember,
}: TeamPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Developer');

  const filteredMembers = teamMembers.filter((member) =>
    `${member.name} ${member.email} ${member.role}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const adminCount = teamMembers.filter((member) =>
    member.role.toLowerCase().includes('admin')
  ).length;

  const developerCount = teamMembers.filter((member) =>
    member.role.toLowerCase().includes('developer')
  ).length;

  const designerCount = teamMembers.filter((member) =>
    member.role.toLowerCase().includes('designer')
  ).length;

  const openCreateForm = () => {
    setEditingMember(null);
    setName('');
    setEmail('');
    setRole('Developer');
    setShowForm(true);
  };

  const openEditForm = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setEmail(member.email);
    setRole(member.role);
    setShowForm(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim()) return;

    if (editingMember) {
      onUpdateMember({
        ...editingMember,
        name: name.trim(),
        email: email.trim(),
        role,
        avatar: name.trim()
          .split(' ')
          .map((part) => part[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
      });
    } else {
      const newMember: TeamMember = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        role,
        avatar: name.trim()
          .split(' ')
          .map((part) => part[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
      };

      onCreateMember(newMember);
    }

    setShowForm(false);
    setEditingMember(null);
  };

  const handleDelete = (member: TeamMember) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${member.name}?`
    );

    if (!confirmed) return;

    onDeleteMember(member.id);
  };

  return (
    <section className="dashboard-content">
      <div className="welcome-section">
        <div>
          <p className="date-label">WORKSPACE / TEAM</p>
          <h1>Team Members</h1>
          <p className="welcome-description">
            Manage your people, roles, and workspace collaboration.
          </p>
        </div>

        <button className="create-button" onClick={openCreateForm}>
          + Invite Member
        </button>
      </div>

      <section className="team-stats">
        <div className="team-stat-card">
          <div className="team-stat-icon purple-icon">♧</div>
          <div>
            <span>Total Members</span>
            <h2>{teamMembers.length}</h2>
            <p>People in your workspace</p>
          </div>
        </div>

        <div className="team-stat-card">
          <div className="team-stat-icon blue-icon">♙</div>
          <div>
            <span>Workspace Admins</span>
            <h2>{adminCount}</h2>
            <p>Managing the workspace</p>
          </div>
        </div>

        <div className="team-stat-card">
          <div className="team-stat-icon orange-icon">⌘</div>
          <div>
            <span>Developers</span>
            <h2>{developerCount}</h2>
            <p>Technical team members</p>
          </div>
        </div>

        <div className="team-stat-card">
          <div className="team-stat-icon green-icon">✎</div>
          <div>
            <span>Designers</span>
            <h2>{designerCount}</h2>
            <p>Creative team members</p>
          </div>
        </div>
      </section>

      <section className="team-directory">
        <div className="team-directory-header">
          <div>
            <h2>All Members</h2>
            <p>Everyone working in your workspace.</p>
          </div>

          <span className="member-count">
            {filteredMembers.length} members
          </span>
        </div>

        <div className="team-toolbar">
          <div className="team-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search members by name, email, or role..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        <div className="team-grid">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <article className="team-member-card" key={member.id}>
                <div className="member-card-top">
                  <div className="member-avatar">
                    {member.avatar}
                  </div>

                  <button
                    className="more-button"
                    aria-label={`Edit ${member.name}`}
                    onClick={() => openEditForm(member)}
                  >
                    ···
                  </button>
                </div>

                <div className="member-details">
                  <h3>{member.name}</h3>

                  <span className="member-role">
                    {member.role}
                  </span>

                  <p>{member.email}</p>
                </div>

                <div className="member-card-footer">
                  <span className="member-active-dot" />
                  <span>Workspace member</span>
                </div>

                <div className="member-actions">
                  <button onClick={() => openEditForm(member)}>
                    Edit
                  </button>

                  <button
                    className="task-delete-button"
                    onClick={() => handleDelete(member)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="team-empty-state">
              <h3>No members found</h3>
              <p>
                Try searching with a different name, email, or role.
              </p>
            </div>
          )}
        </div>
      </section>

      {showForm && (
        <section className="section">
          <form className="project-form" onSubmit={handleSubmit}>
            <h2>{editingMember ? 'Edit Member' : 'Invite Member'}</h2>

            <div className="project-form-fields">
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
              >
                <option value="Admin">Admin</option>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Member">Member</option>
              </select>
            </div>

            <div className="project-form-footer">
              <button
                type="button"
                className="form-cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button type="submit" className="form-submit-button">
                {editingMember ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </form>
        </section>
      )}
    </section>
  );
}

export default TeamPage;
