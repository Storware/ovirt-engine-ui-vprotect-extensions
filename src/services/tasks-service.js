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

  submitTaskRestoreAndImport(task) {
    return vprotectApiService.post(`/tasks/restore-and-import`, task);
  }

  submitTaskDelete(entityGuid) {
    return vprotectApiService.post('/tasks/delete', { value: entityGuid });
  }
}

export const tasksService = new TasksService();
