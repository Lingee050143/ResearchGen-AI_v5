// ================================================================
// ResearchGen AI — localStorage Storage Service
// ================================================================
import { Project, IdeaInput, ResearchRun } from './types';

const PROJECTS_KEY = 'researchgen_projects';

export function getProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(PROJECTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function getProject(id: string): Project | null {
  const projects = getProjects();
  return projects.find((p) => p.id === id) || null;
}

export function createProject(name: string): Project {
  const project: Project = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastStep: 1,
    idea: null,
    research: null,
  };
  const projects = getProjects();
  projects.unshift(project);
  saveProjects(projects);
  return project;
}

export function updateProject(id: string, updates: Partial<Project>): void {
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return;
  projects[idx] = { ...projects[idx], ...updates, updatedAt: new Date().toISOString() };
  saveProjects(projects);
}

export function saveIdeaInput(projectId: string, idea: IdeaInput): void {
  updateProject(projectId, { idea });
}

export function saveResearchRun(projectId: string, research: ResearchRun): void {
  updateProject(projectId, { research });
}

export function saveLastStep(projectId: string, step: number): void {
  updateProject(projectId, { lastStep: step });
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter((p) => p.id !== id);
  saveProjects(projects);
}
