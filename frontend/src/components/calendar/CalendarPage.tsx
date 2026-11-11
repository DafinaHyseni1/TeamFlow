import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Task, Project } from '../../types';

interface CalendarPageProps {
  tasks: Task[];
  projects: Project[];
  onCreateTask: (newTask: Task) => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

function CalendarPage({
  tasks,
  projects,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [taskName, setTaskName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('Medium');
  const [status, setStatus] = useState<Task['status']>('To Do');
  const [dueDate, setDueDate] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const calendarDays = Array.from(
    { length: firstDay + daysInMonth },
    (_, index) => index < firstDay ? null : index - firstDay + 1
  );

  const formatDate = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const getTasksForDay = (day: number) =>
    tasks.filter((task) => task.dueDate === formatDate(day));

  const upcomingTasks = [...tasks]
    .filter(
      (task) =>
        task.status !== 'Completed' &&
        new Date(`${task.dueDate}T00:00:00`) >=
          new Date(today.getFullYear(), today.getMonth(), today.getDate())
    )
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const changeMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const openCreateForm = (date: string) => {
    setSelectedTask(null);
    setTaskName('');
    setProjectId('');
    setPriority('Medium');
    setStatus('To Do');
    setDueDate(date);
    setShowForm(true);
  };

  const openEditForm = (task: Task) => {
    setSelectedTask(task);
    setTaskName(task.name);
    setProjectId(String(task.projectId));
    setPriority(task.priority);
    setStatus(task.status);
    setDueDate(task.dueDate);
    setShowForm(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const selectedProject = projects.find(
      (project) => project.id === Number(projectId)
    );

    if (!taskName.trim() || !selectedProject || !dueDate) return;

    if (selectedTask) {
      onUpdateTask({
        ...selectedTask,
        name: taskName.trim(),
        projectId: selectedProject.id,
        project: selectedProject.name,
        priority,
        status,
        dueDate,
      });
    } else {
const newTask: Task = {
  id: 0,
  name: taskName.trim(),
  projectId: selectedProject.id,
  project: selectedProject.name,
  priority,
  status,
  dueDate,
};

      onCreateTask(newTask);
    }

    setShowForm(false);
    setSelectedTask(null);
    setTaskName('');
    setProjectId('');
  };

  const handleDelete = (task: Task) => {
    onDeleteTask(task.id);
    setShowForm(false);
    setSelectedTask(null);
  };

  return (
    <section className="dashboard-content">
      <div className="welcome-section">
        <div>
          <p className="date-label">WORKSPACE / CALENDAR</p>
          <h1>Calendar</h1>
          <p className="welcome-description">
            Manage deadlines and keep your projects on schedule.
          </p>
        </div>
      </div>

      <div className="calendar-layout">
        <section className="calendar-main">
          <div className="calendar-toolbar">
            <div>
              <h2>{monthName}</h2>
              <p>Monthly overview</p>
            </div>

            <div className="calendar-navigation">
              <button onClick={() => changeMonth(-1)}>‹</button>

              <button
                className="today-button"
                onClick={() =>
                  setCurrentDate(
                    new Date(today.getFullYear(), today.getMonth(), 1)
                  )
                }
              >
                Today
              </button>

              <button onClick={() => changeMonth(1)}>›</button>
            </div>
          </div>

          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div className="calendar-weekday" key={day}>
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              const dayTasks = day ? getTasksForDay(day) : [];

              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

              return (
                <div
                  className="calendar-day"
                  key={index}
                  onClick={() => day && openCreateForm(formatDate(day))}
                  style={{ cursor: day ? 'pointer' : 'default' }}
                >
                  {day && (
                    <>
                      <span
                        className={`calendar-date ${
                          isToday ? 'today-date' : ''
                        }`}
                      >
                        {day}
                      </span>

                      <div className="calendar-events">
                        {dayTasks.map((task) => (
                          <button
                            key={task.id}
                            type="button"
                            className={`calendar-event ${task.priority.toLowerCase()}`}
                            title="Click to edit task"
                            onClick={(event) => {
                              event.stopPropagation();
                              openEditForm(task);
                            }}
                          >
                            {task.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <aside className="calendar-sidebar">
          <div className="upcoming-header">
            <div>
              <h2>Upcoming Deadlines</h2>
              <p>Stay ahead of your work.</p>
            </div>

            <span className="deadline-count">
              {upcomingTasks.length}
            </span>
          </div>

          <div className="upcoming-list">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <article
                  className="upcoming-task"
                  key={task.id}
                  onClick={() => openEditForm(task)}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className={`deadline-indicator ${task.priority.toLowerCase()}`}
                  />

                  <div className="upcoming-task-content">
                    <h3>{task.name}</h3>
                    <p>{task.project}</p>

                    <div className="upcoming-task-footer">
                      <span>
                        {new Date(
                          `${task.dueDate}T00:00:00`
                        ).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>

                      <span
                        className={`priority ${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="empty-calendar">
                No upcoming deadlines.
              </p>
            )}
          </div>
        </aside>
      </div>

      {showForm && (
        <section className="section">
          <form className="project-form" onSubmit={handleSubmit}>
            <h2>{selectedTask ? 'Edit Task' : 'New Task'}</h2>

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

              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                required
              />
            </div>

            <div className="project-form-footer">
              {selectedTask && (
                <button
                  type="button"
                  className="task-delete-button"
                  onClick={() => handleDelete(selectedTask)}
                >
                  Delete Task
                </button>
              )}

              <button
                type="button"
                className="form-cancel-button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedTask(null);
                }}
              >
                Cancel
              </button>

              <button type="submit" className="form-submit-button">
                {selectedTask ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </form>
        </section>
      )}
    </section>
  );
}

export default CalendarPage;
