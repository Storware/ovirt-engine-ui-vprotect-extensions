import { vprotectApiService } from './vprotect-api-service';
import getCookie from 'utils/getCookie';
import isNotOpenstackBuild from 'utils/isNotOpenstackBuild';

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

  async submitTaskRestoreAndImport(task) {
    return vprotectApiService.post('/tasks/restore-and-import', task);
  }

  submitTaskDelete(entityGuid) {
    return vprotectApiService.post('/tasks/delete', { value: entityGuid });
  }
}

export const tasksService = new TasksService();
