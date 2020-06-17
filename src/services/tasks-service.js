import { vprotectApiService } from './vprotect-api-service';

class TasksService {
  submitTaskMount(task) {
    return vprotectApiService.post('/tasks/mount', task);
  }

  submitTaskUnmount(task) {
    return vprotectApiService.post('/tasks/unmount', task);
  }

  submitTaskRestoreAndMount(task) {
    return vprotectApiService.post('/tasks/restore-and-mount', task);
  }
}

export const tasksService = new TasksService();
