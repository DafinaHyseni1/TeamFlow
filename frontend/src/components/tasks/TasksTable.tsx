import type { Task } from '../../types';

interface TasksTableProps {
  tasks: Task[];
  onUpdateStatus: (taskId: number, status: Task['status']) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (task: Task) => void;
}

function TasksTable({
  tasks,
  onUpdateStatus,
  onDeleteTask,
  onEditTask,
}: TasksTableProps) {
  return (
    <div className="tasks-table">
      <div className="task-row task-header">
        <span>Task name</span>
        <span>Project</span>
        <span>Priority</span>
        <span>Status</span>
        <span>Actions</span>
      </div>

      {tasks.map((task) => (
        <div className="task-row" key={task.id}>
          <strong>{task.name}</strong>

          <span>{task.project}</span>

          <span className={`priority ${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>

          <select
            className={`status ${task.status.toLowerCase().replace(' ', '-')}`}
            value={task.status}
            onChange={(event) =>
              onUpdateStatus(
                task.id,
                event.target.value as Task['status']
              )
            }
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <div className="task-actions">
            <button
              className="task-edit-button"
              onClick={() => onEditTask(task)}
              title="Edit task"
            >
              Edit
            </button>

            <button
              className="task-delete-button"
              onClick={() => onDeleteTask(task.id)}
              title="Delete task"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TasksTable;
