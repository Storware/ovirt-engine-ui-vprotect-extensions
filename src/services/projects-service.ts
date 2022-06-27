import { vprotectApiService } from './vprotect-api-service';

export class ProjectsService {
  getAllProjects(params?) {
    return vprotectApiService.get('/projects', { params });
  }
}

export const projectsService = new ProjectsService();
