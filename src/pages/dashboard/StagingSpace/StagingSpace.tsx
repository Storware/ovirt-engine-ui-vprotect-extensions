import { StagingSpaceUI } from './StagingSpaceUI';
import { useStagingSpace } from './useStagingSpace';

export function StagingSpace() {
  const { stagingSpace } = useStagingSpace();

  return <StagingSpaceUI stagingSpace={stagingSpace} />;
}
