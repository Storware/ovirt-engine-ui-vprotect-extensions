import { APP_VERSION } from '@/const/appVersion';
import { TIMEZONE_UTC, TIMEZONES } from '@/model/time/timezones';
import getCookie from '@/utils/getCookie';
import isNotOpenstackBuild from '@/utils/isNotOpenstackBuild';
import { hypervisorsService } from '@/services/hypervisors-service';
import { vprotectService } from '@/services/vprotect-service';

export function useInfoBar() {
  const cookieTimezone = getCookie('django_timezone');

  const fullTimeZoneName =
    TIMEZONES.find(({ utc }) =>
      utc.some((utc_) => cookieTimezone?.replace(/['"]+/g, '') === utc_),
    )?.text || TIMEZONE_UTC.text;

  const synchronizeInventory = () => {
    void hypervisorsService
      .getAllHypervisorManagers()
      .then((hypervisorManagers) => {
        void vprotectService.submitTaskSync({
          hypervisorManagers: hypervisorManagers
            .filter((el) => el.type.name === 'RHV')
            .map((el) => ({ guid: el.guid })),
        });
      });
  };

  return {
    fullTimeZoneName,
    pluginVersion: APP_VERSION,
    synchronizeInventory,
    isNotOpenstackBuild,
  };
}
