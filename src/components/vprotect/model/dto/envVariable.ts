import {NameAndGuid} from './nameAndGuid';

export class EnvVariable {
    application: {
        name: string,
        guid: string
    }
    name: string;
    value: string;
    userFriendlyHint: string;
    hiddenInUI: boolean;
    guid: string;
    appCmdExecConfigParam: NameAndGuid;
}
