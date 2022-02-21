export class CredentialModel {
  guid: string;
  name: string;
  password: string;
  secretKey: string;
  sshKey?: string;
  sshKeyPath: string;
  user: string;
}
