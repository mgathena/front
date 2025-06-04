const API_BASE_URL = process.env.DYNAMODB_BACKEND_URL || 'http://localhost:8081';

export interface Question {
  QueId: string;
  QueText: string;
  QueScale: string;
  QueCriteria: 'scale' | 'categorical';
  QueCategories: string[] | string;
}

export interface TemplateQuestion {
  TemplateId: string;
  QueId: string;
  Order: string;
}

export interface CreateTemplateData {
  TemplateId: string;
  TemplateName: string;
}

export interface Survey {
  SurveyId: string;
  Biodata: string;
  Name: string;
  TemplateId: string;
  URL: string;
  Status: 'Completed' | 'In-Progress' | string;
  Date: string;
}

export async function fetchAllSurveys(): Promise<Survey[]> {
  const response = await fetch(`${API_BASE_URL}/api/surveys/list`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch surveys');
  }

  return response.json();
}

export async function fetchCompletedSurveys(): Promise<Survey[]> {
  const response = await fetch(`${API_BASE_URL}/api/surveys/list_completed`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch completed surveys');
  }

  return response.json();
}

export interface SurveyStats {
  Total_Surveys: number;
  Active: number;
  Completed: number;
  Percent_Surveys: string;
  Percent_Active: string;
  Percent_Completed: string;
}

export interface Template {
  TemplateId: string;
  TemplateName: string;
  Status: 'Published' | 'Draft' | string;
  Date: string;
}

export async function fetchSurveyStats(): Promise<SurveyStats> {
  const response = await fetch(`${API_BASE_URL}/api/surveys/stat`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch survey statistics');
  }

  return response.json();
}

export async function fetchAllTemplates(): Promise<Template[]> {
  const response = await fetch(`${API_BASE_URL}/api/templates/list`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }

  return response.json();
}

export async function fetchPublishedTemplates(): Promise<Template[]> {
  const response = await fetch(`${API_BASE_URL}/api/templates/list_published`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch published templates');
  }

  return response.json();
}

export interface TemplateStats {
  Total_Templates: number;
  Drafts: number;
  Published: number;
  Percent_Templates: string;
  Percent_Drafts: string;
  Percent_Published: string;
}

export async function fetchTemplateStats(): Promise<TemplateStats> {
  const response = await fetch(`${API_BASE_URL}/api/templates/stat`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch template statistics');
  }

  return response.json();
}

export async function createTemplate(templateData: CreateTemplateData): Promise<{ TemplateId: string }> {
  const response = await fetch(`${API_BASE_URL}/api/templates/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify(templateData),
  });

  if (!response.ok) {
    throw new Error('Failed to create template');
  }

  return response.json();
}

export async function createQuestion(questionData: Question): Promise<{ QueId: string }> {
  const response = await fetch(`${API_BASE_URL}/api/questions/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify(questionData),
  });

  if (!response.ok) {
    throw new Error('Failed to create question');
  }

  return response.json();
}

export async function addQuestionToTemplate(templateQuestion: TemplateQuestion): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/template-questions/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify(templateQuestion),
  });

  if (!response.ok) {
    throw new Error('Failed to add question to template');
  }
}

export async function updateTemplateStatus(templateId: string, status: 'Draft' | 'Published'): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/templates/${templateId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify({ Status: status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update template status');
  }
}
