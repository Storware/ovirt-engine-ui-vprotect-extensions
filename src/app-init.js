import {vprotectService} from './components/vprotect/services/vprotect-service'

const username = 'admin'
const password = 'vPr0tect'

class AppInit {
  run = async () => {
    const user = await vprotectService.login(username, password)
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export default new AppInit()
