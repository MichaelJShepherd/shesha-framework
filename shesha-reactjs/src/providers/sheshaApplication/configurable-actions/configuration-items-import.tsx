import ConfigurationItemsImport, { IImportInterface } from '@/components/configurationFramework/itemsImport';
import React, {
  FC,
  MutableRefObject,
  useRef,
  useState
  } from 'react';
import { Button, message, notification } from 'antd';
import { ICommonModalProps } from '../../dynamicModal/models';
import { IErrorInfo } from '@/interfaces/errorInfo';
import { ImportOutlined } from '@ant-design/icons';
import { nanoid } from '@/utils/uuid';
import { SheshaActionOwners } from '../../configurableActionsDispatcher/models';
import { useAppConfiguratorState, useDynamicModals } from '@/providers';
import { useConfigurableAction } from '@/providers/configurableActionsDispatcher';
import { ValidationErrors } from '@/components';

const actionsOwner = 'Configuration Framework';

interface IConfigurationItemsExportFooterProps {
  hideModal: () => void;
  importerRef: MutableRefObject<IImportInterface>;
}

const displayNotificationError = (message: string, error: IErrorInfo) => {
  notification.error({
      message: message,
      icon: null,
      description: <ValidationErrors error={error} renderMode="raw" defaultMessage={null} />,
  });
};

export const ConfigurationItemsExportFooter: FC<IConfigurationItemsExportFooterProps> = (props) => {
  const [inProgress, setInProgress] = useState(false);
  const { hideModal, importerRef: exporterRef } = props;

  const onImport = () => {
    setInProgress(true);

    exporterRef.current.importExecuter().then(() => {
      message.info('Items imported successfully');
      hideModal();
    }).catch((e) => {
      console.log('catch in footer');
      displayNotificationError('Failed to import package', e);
      setInProgress(false);
    });
  };

  return (
    <>
      <Button type='default' onClick={hideModal}>Cancel</Button>
      <Button type='primary' icon={<ImportOutlined />} onClick={onImport} loading={inProgress}>Import</Button>
    </>
  );
};

export const useConfigurationItemsImportAction = () => {
  const { createModal, removeModal } = useDynamicModals();
  const appConfigState = useAppConfiguratorState();
  const exporterRef = useRef<IImportInterface>();

  useConfigurableAction({
    name: 'Import items',
    owner: actionsOwner,
    ownerUid: SheshaActionOwners.ConfigurationFramework,
    hasArguments: false,
    executer: (actionArgs) => {
      const modalId = nanoid();

      return new Promise((resolve, _reject) => {

        const hideModal = () => {
          removeModal(modalId);
        };

        const onImported = () => {
          console.log('onImported');
          removeModal(modalId);
          resolve(true);
        };

        const modalProps: ICommonModalProps = {
          ...actionArgs,
          id: modalId,
          title: "Import Configuration Items",
          isVisible: true,
          showModalFooter: false,
          content: <ConfigurationItemsImport onImported={onImported} importRef={exporterRef} />,
          footer: <ConfigurationItemsExportFooter hideModal={hideModal} importerRef={exporterRef} />
        };
        createModal({ ...modalProps, isVisible: true });
      });
    },
  }, [appConfigState]);
};