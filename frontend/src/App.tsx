
import { useState, useEffect } from 'react';
import './App.css';

import type { Project, Task, TeamMember } from './types';

import { apiRequest } from './services/api';

import StatsCard from './components/dashboard/StatsCard';
import ProjectCard from './components/projects/ProjectCard';
import TasksTable from './components/tasks/TasksTable';

import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

import ProjectsPage from './components/projects/ProjectsPage';
import TasksPage from './components/tasks/TasksPage';
import TeamPage from './components/team/TeamPage';
import CalendarPage from './components/calendar/CalendarPage';
import SettingsPage from './components/settings/SettingsPage';
import AuthPage from './components/auth/AuthPage';
import AIAssistant from './components/ai/AIAssistant';

interface User {
  id: number;
  full_name: string;
  email: string;
}

interface ApiProject {
  id: number;
  name: string;
  category: string;
  description: string;
  progress: number;
  color: 'purple' | 'blue' | 'orange';
  total_tasks: number;
  completed_tasks: number;
}

interface ApiTask {
  id: number;
  name: string;
  project_id: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Completed';
  due_date: string | null;
}

interface ApiTeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}

function mapApiProject(project: ApiProject): Project {
  return {
    id: project.id,
    name: project.name,
    category: project.category,
    description: project.description ?? '',
    progress: project.progress,
    color: project.color,
    totalTasks: project.total_tasks,
    completedTasks: project.completed_tasks,
  };
}

function mapApiTeamMember(
  member: ApiTeamMember
): TeamMember {
  return {
    id: member.id,
    name: member.name,
    email: member.email,
    role: member.role,
    avatar: member.avatar ?? '',
  };
}

function mapApiTask(
  task: ApiTask,
  projectList: Project[]
): Task {
  const selectedProject = projectList.find(
    (project) => project.id === task.project_id
  );

  return {
    id: task.id,
    name: task.name,
    projectId: task.project_id,
    project: selectedProject?.name ?? 'Unknown Project',
    priority: task.priority,
    status: task.status,
    dueDate: task.due_date ?? '',
  };
}

function App() {
  const [activePage, setActivePage] = useState('Dashboard');

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('teamflow-token');
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('teamflow-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (
    accessToken: string,
    loggedInUser: User
  ) => {
    localStorage.setItem('teamflow-token', accessToken);
    localStorage.setItem('teamflow-user', JSON.stringify(loggedInUser));

    setToken(accessToken);
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('teamflow-token');
    localStorage.removeItem('teamflow-user');

    setToken(null);
    setUser(null);
  };

  const [projects, setProjects] = useState<Project[]>([]);

  const [taskList, setTaskList] = useState<Task[]>([]);

  const projectsWithTaskStats = projects.map((project) => {
    const projectTasks = taskList.filter(
      (task) => task.projectId === project.id
    );

    const totalTasks = projectTasks.length;

    const completedTasks = projectTasks.filter(
      (task) => task.status === 'Completed'
    ).length;

    const inProgressTasks = projectTasks.filter(
      (task) => task.status === 'In Progress'
    ).length;

    const progress =
      totalTasks === 0
        ? 0
        : Math.round(
            ((completedTasks + inProgressTasks * 0.5) / totalTasks) * 100
          );

    return {
      ...project,
      totalTasks,
      completedTasks,
      progress,
    };
  });

  const [members, setMembers] = useState<TeamMember[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const fetchWorkspaceData = async () => {
      try {
        const [projectData, taskData, memberData] = await Promise.all([
          apiRequest('/projects', {}, token),
          apiRequest('/tasks', {}, token),
          apiRequest('/team-members', {}, token),
        ]);

        if (cancelled) return;

        const mappedProjects = (projectData as ApiProject[]).map(
          mapApiProject
        );

        const mappedTasks = (taskData as ApiTask[]).map(
          (task) => mapApiTask(task, mappedProjects)
        );

        const mappedMembers = (memberData as ApiTeamMember[]).map(
          mapApiTeamMember
        );

        setProjects(mappedProjects);
        setTaskList(mappedTasks);
        setMembers(mappedMembers);
      } catch (error) {
        console.error('Failed to load workspace data:', error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    setIsLoading(true);
    fetchWorkspaceData();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleCreateProject = async (newProject: Project) => {
    if (!token) return;

    try {
      const createdProject = await apiRequest(
        '/projects',
        {
          method: 'POST',
          body: JSON.stringify({
            name: newProject.name,
            category: newProject.category,
            description: newProject.description,
            progress: newProject.progress,
            color: newProject.color,
            total_tasks: newProject.totalTasks,
            completed_tasks: newProject.completedTasks,
          }),
        },
        token
      );

      setProjects((previousProjects) => [
        ...previousProjects,
        mapApiProject(createdProject as ApiProject),
      ]);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to create project.'
      );
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!token) return;

    try {
      await apiRequest(
        `/projects/${projectId}`,
        {
          method: 'DELETE',
        },
        token
      );

      setProjects((previousProjects) =>
        previousProjects.filter(
          (project) => project.id !== projectId
        )
      );
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete project.'
      );
    }
  };

  const handleCreateTask = async (newTask: Task) => {
    if (!token) return;

    try {
      const createdTask = await apiRequest(
        '/tasks',
        {
          method: 'POST',
          body: JSON.stringify({
            name: newTask.name,
            project_id: newTask.projectId,
            priority: newTask.priority,
            status: newTask.status,
            due_date: newTask.dueDate || null,
          }),
        },
        token
      );

      setTaskList((previousTasks) => [
        ...previousTasks,
        mapApiTask(createdTask as ApiTask, projects),
      ]);
    } catch (error) {
      console.error('Failed to create task:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to create task.'
      );
    }
  };

  const handleUpdateTaskStatus = async (
    taskId: number,
    status: Task['status']
  ) => {
    if (!token) return;

    const existingTask = taskList.find(
      (task) => task.id === taskId
    );

    if (!existingTask) return;

    try {
      await apiRequest(
        `/tasks/${taskId}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            name: existingTask.name,
            project_id: existingTask.projectId,
            priority: existingTask.priority,
            status,
            due_date: existingTask.dueDate || null,
          }),
        },
        token
      );

      setTaskList((previousTasks) =>
        previousTasks.map((task) =>
          task.id === taskId ? { ...task, status } : task
        )
      );
    } catch (error) {
      console.error('Failed to update task status:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to update task status.'
      );
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    if (!token) return;

    try {
      await apiRequest(
        `/tasks/${updatedTask.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            name: updatedTask.name,
            project_id: updatedTask.projectId,
            priority: updatedTask.priority,
            status: updatedTask.status,
            due_date: updatedTask.dueDate || null,
          }),
        },
        token
      );

      setTaskList((previousTasks) =>
        previousTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error('Failed to update task:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to update task.'
      );
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    );

    if (!confirmed || !token) return;

    try {
      await apiRequest(
        `/tasks/${taskId}`,
        {
          method: 'DELETE',
        },
        token
      );

      setTaskList((previousTasks) =>
        previousTasks.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete task.'
      );
    }
  };

  const handleCreateMember = async (newMember: TeamMember) => {
    if (!token) return;

    try {
      const createdMember = await apiRequest(
        '/team-members',
        {
          method: 'POST',
          body: JSON.stringify({
            name: newMember.name,
            email: newMember.email,
            role: newMember.role,
            avatar: newMember.avatar,
          }),
        },
        token
      );

      setMembers((previousMembers) => [
        ...previousMembers,
        mapApiTeamMember(createdMember as ApiTeamMember),
      ]);
    } catch (error) {
      console.error('Failed to create team member:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to create team member.'
      );
    }
  };

  const handleUpdateMember = async (updatedMember: TeamMember) => {
    if (!token) return;

    try {
      const updatedData = await apiRequest(
        `/team-members/${updatedMember.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            name: updatedMember.name,
            email: updatedMember.email,
            role: updatedMember.role,
            avatar: updatedMember.avatar,
          }),
        },
        token
      );

      const mappedMember = mapApiTeamMember(
        updatedData as ApiTeamMember
      );

      setMembers((previousMembers) =>
        previousMembers.map((member) =>
          member.id === mappedMember.id ? mappedMember : member
        )
      );
    } catch (error) {
      console.error('Failed to update team member:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to update team member.'
      );
    }
  };

  const handleDeleteMember = async (memberId: number) => {
    if (!token) return;

    try {
      await apiRequest(
        `/team-members/${memberId}`,
        {
          method: 'DELETE',
        },
        token
      );

      setMembers((previousMembers) =>
        previousMembers.filter((member) => member.id !== memberId)
      );
    } catch (error) {
      console.error('Failed to delete team member:', error);
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to delete team member.'
      );
    }
  };

  if (!token) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
        userName={user?.full_name ?? 'User'}
      />

      <main className="main-content">
        <Topbar
          activePage={activePage}
          userName={user?.full_name ?? 'User'}
        />

        {activePage === 'Projects' ? (
          <ProjectsPage
            projects={projectsWithTaskStats}
            onCreateProject={handleCreateProject}
            onDeleteProject={handleDeleteProject}
          />
        ) : activePage === 'My Tasks' ? (
          <TasksPage
            tasks={taskList}
            projects={projects}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onDeleteTask={handleDeleteTask}
          />
        ) : activePage === 'Team' ? (
          <TeamPage
            teamMembers={members}
            onCreateMember={handleCreateMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
          />
        ) : activePage === 'Calendar' ? (
          <CalendarPage
            tasks={taskList}
            projects={projects}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        ) : activePage === 'AI Assistant' ? (
          <AIAssistant
            projects={projectsWithTaskStats}
            token={token}
            onCreateTask={handleCreateTask}
          />
        ) : activePage === 'Settings' ? (
          <SettingsPage />
        ) : isLoading ? (
          <section className="dashboard-content">
            <p>Loading your workspace...</p>
          </section>
        ) : (
          <section className="dashboard-content">
            <div className="welcome-section">
              <div>
                <p className="date-label">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  }).toUpperCase()}
                </p>
                <h1>
                  Good afternoon, {user?.full_name ?? 'User'} 👋
                </h1>
                <p className="welcome-description">
                  Here's what's happening with your workspace today.
                </p>
              </div>

              <button
                className="create-button"
                onClick={() => setActivePage('Projects')}
              >
                + Create New Project
              </button>
            </div>

            <section className="stats-grid">
              <StatsCard
                title="Total Projects"
                value={String(projects.length)}
                description="Across your workspace"
              />

              <StatsCard
                title="Active Tasks"
                value={String(
                  taskList.filter(
                    (task) => task.status === 'In Progress'
                  ).length
                )}
                description="Currently in progress"
              />

              <StatsCard
                title="Completed Tasks"
                value={String(
                  taskList.filter(
                    (task) => task.status === 'Completed'
                  ).length
                )}
                description="Successfully completed"
              />

              <StatsCard
                title="Team Members"
                value={String(members.length)}
                description="Working together"
              />
            </section>

            <section className="section">
              <div className="section-heading">
                <div>
                  <h2>Recent Projects</h2>
                  <p>Keep track of your team's progress.</p>
                </div>

                <button
                  className="text-button"
                  onClick={() => setActivePage('Projects')}
                >
                  View all →
                </button>
              </div>

              <div className="projects-grid">
                {projectsWithTaskStats.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onDelete={handleDeleteProject}
                  />
                ))}
              </div>
            </section>

            <section className="section">
              <div className="section-heading">
                <div>
                  <h2>Recent Tasks</h2>
                  <p>Stay updated with your latest tasks.</p>
                </div>

                <button
                  className="text-button"
                  onClick={() => setActivePage('My Tasks')}
                >
                  View all →
                </button>
              </div>

              <TasksTable
                tasks={taskList}
                onUpdateStatus={handleUpdateTaskStatus}
                onDeleteTask={handleDeleteTask}
                onEditTask={(task) => {
                  setActivePage('My Tasks');
                }}
              />
            </section>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
