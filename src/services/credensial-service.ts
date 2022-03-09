import { vprotectApiService } from './vprotect-api-service';
import { CredentialModel } from '../model';

class CredentialsService {
  getCredential(guid: string): Promise<CredentialModel> {
    return vprotectApiService.get(`/credential/${guid}`);
  }

  getCredentials(): Promise<CredentialModel[]> {
    return vprotectApiService.get('/credential');
  }

  deleteCredential(guid: string): Promise<void> {
    return vprotectApiService.delete(`/credential/${guid}`);
  }

  createCredential(payload: Omit<CredentialModel, 'guid'>): Promise<void> {
    return vprotectApiService.post('/credential', payload);
  }

  updateCredential(payload: CredentialModel): Promise<void> {
    return vprotectApiService.put(`/credential/${payload.guid}`, payload);
  }
}

export const credentialsService = new CredentialsService();
