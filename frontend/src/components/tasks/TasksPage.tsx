import { useState } from 'react';
import type { Project, Task } from '../../types';
import TasksTable from './TasksTable';

interface TasksPageProps {
  tasks: Task[];
  projects: Project[];
  onCreateTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onUpdateTaskStatus: (
    taskId: number,
    status: Task['status']
  ) => void;
  onDeleteTask: (taskId: number) => void;
}

function TasksPage({
  tasks,
  projects,
  onCreateTask,
  onUpdateTask,
  onUpdateTaskStatus,
  onDeleteTask,
}: TasksPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskName, setTaskName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('Medium');
  const [status, setStatus] = useState<Task['status']>('To Do');
  const [dueDate, setDueDate] = useState('');

  const resetForm = () => {
    setTaskName('');
    setProjectId('');
    setPriority('Medium');
    setStatus('To Do');
    setDueDate('');
    setEditingTask(null);
    setShowForm(false);
  };

  const handleCreateTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const selectedProject = projects.find(
      (project) => project.id === Number(projectId)
    );

    if (!taskName.trim() || !selectedProject || !dueDate) return;

    const newTask: Task = {
      id: 0,
      name: taskName.trim(),
      projectId: selectedProject.id,
      project: selectedProject.name,
      priority,
      status: 'To Do',
      dueDate,
    };

    onCreateTask(newTask);
    resetForm();
  };

  const handleUpdateTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingTask) return;

    const selectedProject = projects.find(
      (project) => project.id === Number(projectId)
    );

    if (!taskName.trim() || !selectedProject || !dueDate) return;

    const updatedTask: Task = {
      ...editingTask,
      name: taskName.trim(),
      projectId: selectedProject.id,
      project: selectedProject.name,
      priority,
      status,
      dueDate,
    };

    onUpdateTask(updatedTask);
    resetForm();
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setTaskName(task.name);
    setProjectId(String(task.projectId));
    setPriority(task.priority);
    setStatus(task.status);
    setDueDate(task.dueDate);
    setShowForm(true);
  };

  return (
    <section className="dashboard-content">
      <div className="welcome-section">
        <div>
          <p className="date-label">WORKSPACE</p>
          <h1>My Tasks</h1>
          <p className="welcome-description">
            Keep track of your tasks and stay on top of your work.
          </p>
        </div>

        <button
          className="create-button"
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              resetForm();
              setShowForm(true);
            }
          }}
        >
          + Create New Task
        </button>
      </div>

      {showForm && (
        <section className="section">
          <form
            className="project-form"
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          >
            <h2>{editingTask ? 'Edit Task' : 'Create a New Task'}</h2>

            <div className="project-form-fields">
              <input
                type="text"
                placeholder="Task name"
                value={taskName}
                onChange={(event) => setTaskName(event.target.value)}
                required
              />

              <select
                value={projectId}
                onChange={(event) => setProjectId(event.target.value)}
                required
              >
                <option value="">Select project</option>

                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as Task['priority'])
                }
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>

              {editingTask && (
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as Task['status'])
                  }
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              )}

              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                required
              />
            </div>

            <div className="project-form-footer">
              <button
                type="button"
                className="form-cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button type="submit" className="form-submit-button">
                {editingTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="section">
        <div className="section-heading">
          <div>
            <h2>All Tasks</h2>
            <p>{tasks.length} tasks in your workspace.</p>
          </div>
        </div>

        <TasksTable
          tasks={tasks}
          onUpdateStatus={onUpdateTaskStatus}
          onDeleteTask={onDeleteTask}
          onEditTask={handleEditClick}
        />
      </section>
    </section>
  );
}

export default TasksPage;
