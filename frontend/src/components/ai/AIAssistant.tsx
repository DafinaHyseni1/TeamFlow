
import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { apiRequest } from '../../services/api';
import type { Project, Task } from '../../types';

interface AIAssistantProps {
  projects: Project[];
  token: string;
  onCreateTask: (task: Task) => Promise<void>;
}

interface SuggestedTask {
  name: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Completed';
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function AIAssistant({
  projects = [],
  token,
  onCreateTask,
}: AIAssistantProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedProject, setSelectedProject] = useState('');
  const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatorMessage, setGeneratorMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    'Give me an overview of my projects',
    'Which tasks need my attention?',
    'How many tasks have I completed?',
    'Summarize my team',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) return;

    if (!token) {
      setError('Please log in again to use the AI Assistant.');
      return;
    }

    setMessages((previous) => [
      ...previous,
      { role: 'user', content: trimmedMessage },
    ]);

    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      const response = await apiRequest(
        `/ai/chat?message=${encodeURIComponent(trimmedMessage)}`,
        { method: 'POST' },
        token
      );

      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content: response.response,
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTasks = async () => {
    if (!selectedProject || isGenerating) return;

    setIsGenerating(true);
    setGeneratorMessage('');
    setError('');
    setSuggestedTasks([]);
    setSelectedTasks([]);

    try {
      const response = await apiRequest(
        `/ai/generate-tasks?project_id=${selectedProject}`,
        { method: 'POST' },
        token
      );

      const generatedTasks: SuggestedTask[] = response.suggested_tasks;

      setSuggestedTasks(generatedTasks);
      setSelectedTasks(generatedTasks.map((task) => task.name));

      setGeneratorMessage(
        `Generated ${generatedTasks.length} task suggestions successfully.`
      );
    } catch (err) {
      setGeneratorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to generate tasks.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleTask = (taskName: string) => {
    setSelectedTasks((previous) =>
      previous.includes(taskName)
        ? previous.filter((name) => name !== taskName)
        : [...previous, taskName]
    );
  };

  const handleSaveTasks = async () => {
    const project = projects.find(
      (item) => item.id === Number(selectedProject)
    );

    if (!project || selectedTasks.length === 0 || isSaving) return;

    setIsSaving(true);
    setGeneratorMessage('');

    try {
      const tasksToSave = suggestedTasks.filter((task) =>
        selectedTasks.includes(task.name)
      );

      for (const task of tasksToSave) {
        await onCreateTask({
          id: 0,
          name: task.name,
          projectId: project.id,
          project: project.name,
          priority: task.priority,
          status: task.status,
          dueDate: '',
        });
      }

      setGeneratorMessage(
        `Successfully added ${tasksToSave.length} tasks to ${project.name}.`
      );

      setSuggestedTasks([]);
      setSelectedTasks([]);
      setSelectedProject('');
    } catch (err) {
      setGeneratorMessage(
        err instanceof Error
          ? err.message
          : 'Something went wrong while saving tasks.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="dashboard-content ai-page">

      {/* PAGE HEADER */}
      <div className="ai-page-header">
        <div>
          <div className="ai-breadcrumb">
            WORKSPACE <span>/</span> AI ASSISTANT
          </div>

          <h1>AI Assistant</h1>

          <p>
            Your intelligent workspace companion. Plan projects,
            generate tasks, and get insights from your workspace.
          </p>
        </div>

        <div className="ai-status">
          <span className="ai-status-dot"></span>
          AI Workspace Active
        </div>
      </div>

      {/* MAIN AI WORKSPACE */}
      <div className="ai-workspace-grid">

        {/* TASK GENERATOR */}
        <section className="ai-panel ai-generator-panel">

          <div className="ai-panel-header">
            <div className="ai-panel-icon generator-icon">
              ✧
            </div>

            <div>
              <h2>AI Task Generator</h2>
              <p>Turn your project ideas into actionable tasks.</p>
            </div>
          </div>

          <div className="ai-generator-body">

            <label className="ai-field-label" htmlFor="ai-project">
              SELECT PROJECT
            </label>

            <select
              id="ai-project"
              className="ai-project-select"
              value={selectedProject}
              onChange={(event) => setSelectedProject(event.target.value)}
              disabled={isGenerating || isSaving}
            >
              <option value="">Choose a project...</option>

              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="ai-generate-button"
              onClick={handleGenerateTasks}
              disabled={!selectedProject || isGenerating || isSaving}
            >
              {isGenerating ? (
                <>
                  <span className="ai-spinner"></span>
                  Generating tasks...
                </>
              ) : (
                <>
                  <span>✧</span>
                  Generate Tasks
                </>
              )}
            </button>

            <div className="ai-generator-divider"></div>

            {suggestedTasks.length > 0 ? (
              <div className="ai-task-suggestions">

                <div className="ai-task-heading">
                  <div>
                    <h3>Suggested Tasks</h3>
                    <p>Choose which tasks to add to your project.</p>
                  </div>

                  <span className="ai-task-count">
                    {suggestedTasks.length}
                  </span>
                </div>

                <div className="ai-task-list">
                  {suggestedTasks.map((task) => (
                    <label
                      key={task.name}
                      className={`ai-task-option ${
                        selectedTasks.includes(task.name) ? 'selected' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.name)}
                        onChange={() => handleToggleTask(task.name)}
                        disabled={isSaving}
                      />

                      <span className="ai-custom-checkbox"></span>

                      <span className="ai-task-name">
                        {task.name}
                      </span>

                      <span
                        className={`ai-task-priority ${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  className="ai-save-button"
                  onClick={handleSaveTasks}
                  disabled={selectedTasks.length === 0 || isSaving}
                >
                  {isSaving
                    ? 'Saving tasks...'
                    : `Add ${selectedTasks.length} Selected Tasks`}
                </button>
              </div>
            ) : (
              <div className="ai-generator-empty">
                <div className="ai-empty-icon">✧</div>
                <h3>Ready to plan your project?</h3>
                <p>
                  Select a project above and let AI suggest
                  tasks to help organize your workflow.
                </p>
              </div>
            )}

            {generatorMessage && (
              <p className="ai-generator-message">
                {generatorMessage}
              </p>
            )}
          </div>
        </section>

        {/* AI CHAT */}
        <section className="ai-panel ai-chat-panel">

          <div className="ai-panel-header ai-chat-header">
            <div className="ai-panel-icon chat-icon">
              ✧
            </div>

            <div>
              <h2>AI Workspace Chat</h2>
              <p>Ask questions about your workspace.</p>
            </div>

            <span className="ai-chat-online">
              Online
            </span>
          </div>

          <div className="ai-chat-content">

            {messages.length === 0 ? (
              <div className="ai-chat-empty">
                <div className="ai-chat-empty-icon">
                  ✧
                </div>

                <h3>How can I help you today?</h3>

                <p>
                  Ask me about your projects, tasks, deadlines,
                  or team productivity.
                </p>

                <div className="ai-chat-suggestions">
                  <span className="ai-suggestions-label">
                    TRY ASKING
                  </span>

                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setMessage(suggestion)}
                    >
                      <span>↗</span>
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="ai-messages">
                {messages.map((chatMessage, index) => (
                  <div
                    key={index}
                    className={`ai-message ${chatMessage.role}`}
                  >
                    {chatMessage.role === 'assistant' && (
                      <div className="ai-chat-avatar">✧</div>
                    )}

                    <div className="ai-message-content">
                      {chatMessage.role === 'assistant' && (
                        <span className="ai-message-label">
                          AI Assistant
                        </span>
                      )}

                      <p>{chatMessage.content}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="ai-message assistant">
                    <div className="ai-chat-avatar">✧</div>

                    <div className="ai-message-content">
                      <span className="ai-message-label">
                        AI Assistant
                      </span>

                      <div className="ai-typing">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

          </div>

          {error && (
            <p className="ai-error">{error}</p>
          )}

          <form className="ai-chat-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ask anything about your workspace..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              aria-label="Send message"
            >
              ↑
            </button>
          </form>

          <p className="ai-disclaimer">
            AI Assistant · Connected to your TeamFlow workspace
          </p>

        </section>
      </div>
    </section>
  );
}

export default AIAssistant;
