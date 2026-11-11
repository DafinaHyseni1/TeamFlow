import type { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: number) => void;
}

function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"?`
    );

    if (confirmed) {
      onDelete(project.id);
    }
  };

  return (
    <article className="project-card">
      <div className="project-card-top">
        <div className={`project-icon ${project.color}`}>
          {project.name.charAt(0)}
        </div>

        <button
          className="more-button"
          onClick={handleDelete}
          aria-label={`Delete ${project.name}`}
          title="Delete project"
        >
          ×
        </button>
      </div>

      <span className="project-category">{project.category}</span>
      <h3>{project.name}</h3>

      <div className="progress-info">
        <span>Progress</span>
        <strong>{project.progress}%</strong>
      </div>

      <div className="progress-track">
        <div
          className={`progress-fill ${project.color}`}
          style={{ width: `${project.progress}%` }}
        />
      </div>

      <span className="task-count">
        {project.completedTasks}/{project.totalTasks} tasks
      </span>
    </article>
  );
}

export default ProjectCard;
