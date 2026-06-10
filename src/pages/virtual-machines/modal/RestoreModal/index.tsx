import React from 'react';
import { RestoreModalContent } from './RestoreModalContent';
import { RestoreModalProvider } from './RestoreModalProvider';
import { VirtualEnvironment } from 'types/virtual-environment';

const RestoreModalWrapper = ({
  virtualEnvironment,
}: {
  virtualEnvironment: VirtualEnvironment;
}) => (
  <RestoreModalProvider virtualEnvironment={virtualEnvironment}>
    <RestoreModalContent />
  </RestoreModalProvider>
);

export { RestoreModalWrapper as RestoreModal };
