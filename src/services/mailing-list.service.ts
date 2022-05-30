import { vprotectApiService } from './vprotect-api-service';

class MailingListService {

  getMailingLists() {
    return vprotectApiService.get('/mailing-lists');
  }

  getMailingList(guid: string) {
    return vprotectApiService.get(`/mailing-lists/${guid}`);
  }

  createMailingList(mailing) {
    return vprotectApiService.post('/mailing-lists', mailing);
  }

  updateMailingList(guid: string, mailing) {
    return vprotectApiService.put(`/mailing-lists/${guid}`, mailing);
  }

  deleteMailingList(guid: string) {
    return vprotectApiService.delete(`/mailing-lists/${guid}`);
  }

}

export const mailingService = new MailingListService();
