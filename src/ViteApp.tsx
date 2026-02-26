import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { useTypedSelector } from '@/store/useTypedSelector';
import { selectShow } from '@/store/modal/selectors';
import ModalContainer from '@/components/modal/ModalContainer';
import getPluginApi from '@/integrations/plugin-api';
import routes from '@/utils/routes';
import Routes from '@/components/routes/Routes';
import { selectLoading } from '@/store/loading/selectors';
import { DevNavigation } from '@/components/DevNavigation/DevNavigation';
import { vprotectService } from '@/services/vprotect-service';

export function ViteApp() {
  const modalShow = useTypedSelector(selectShow);
  const loading = useTypedSelector(selectLoading);
  const href = window.location.href;
  const start = href.indexOf(';');
  const path = href.substring(start + 1).replace(/;/g, '/');

  useEffect(() => {
    const initApplication = async () => {
      const config = getPluginApi.configObject();
      const user = await vprotectService.login(
        config.username,
        config.password,
      );
      localStorage.setItem('user', JSON.stringify(user));
    };

    void initApplication();
  }, []);

  return (
    <Router>
      {start > 0 && (
        <Redirect
          to={{
            pathname: '/' + path,
          }}
        />
      )}
      <DevNavigation />
      <div className={'py-4 container-fluid'}>
        <Switch>
          <Routes items={routes} />
        </Switch>
        {modalShow && <ModalContainer />}
        <div className={'loading ' + (loading && 'active')}>
          <div className={'spinner'} />
        </div>
      </div>
    </Router>
  );
}
