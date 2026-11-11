import { useState } from 'react';
import type { Project } from '../../types';
import ProjectCard from './ProjectCard';

interface ProjectsPageProps {
  projects: Project[];
  onCreateProject: (project: Project) => void;
  onDeleteProject: (projectId: number) => void;
}

function ProjectsPage({
  projects,
  onCreateProject,
  onDeleteProject,
}: ProjectsPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Development');
  const [description, setDescription] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newProject: Project = {
      id: Date.now(),
      name,
      category,
      description,
      progress: 0,
      color: 'blue',
      totalTasks: 0,
      completedTasks: 0,
    };

    onCreateProject(newProject);

    setName('');
    setCategory('Development');
    setDescription('');
    setShowForm(false);
  };

  return (
    <section className="dashboard-content">
      <div className="welcome-section">
        <div>
          <p className="date-label">WORKSPACE</p>
          <h1>All Projects</h1>
          <p className="welcome-description">
            Manage and track all your team's projects in one place.
          </p>
        </div>

        <button
          className="create-button"
          onClick={() => setShowForm(true)}
        >
          + Create New Project
        </button>
      </div>

      {showForm && (
        <section className="project-form-container">
          <form className="project-form" onSubmit={handleSubmit}>
            <div className="project-form-heading">
              <div>
                <span className="form-eyebrow">NEW WORKSPACE PROJECT</span>
                <h2>Create a New Project</h2>
                <p>Set up your project details and get your team started.</p>
              </div>

              <button
                type="button"
                className="form-close-button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <div className="project-form-fields">
              <label>
                Project Name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Website Redesign"
                  required
                />
              </label>

              <label>
                Category
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option>Development</option>
                  <option>Design</option>
                  <option>Marketing</option>
                  <option>Research</option>
                </select>
              </label>

              <label className="project-description-field">
                Description
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What is this project about?"
                  rows={4}
                  required
                />
              </label>
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
                Create Project <span>→</span>
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="section">
        <div className="section-heading">
          <div>
            <h2>Your Projects</h2>
            <p>{projects.length} projects in your workspace.</p>
          </div>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={onDeleteProject}
            />
          ))}
        </div>
      </section>
    </section>
  );
}

export default ProjectsPage;
