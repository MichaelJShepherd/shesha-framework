import ButtonGroupSettingsModal from '../buttonGroupSettingsModal';
import ConfigurableFormItem from '../../../formItem';
import React from 'react';
import { buttonsSettingsForm } from './settings';
import { GroupOutlined } from '@ant-design/icons';
import { IButtonsProps as IButtonsComponentProps } from './interfaces';
import { IToolboxComponent } from '@/interfaces';

const ButtonsComponent: IToolboxComponent<IButtonsComponentProps> = {
  type: 'buttons',
  name: 'Buttons',
  icon: <GroupOutlined />,
  isHidden: true,
  Factory: ({ model }) => {
    return (
      <ConfigurableFormItem model={model}>
        <ButtonGroupSettingsModal title="Configure Buttons" readOnly={model.readOnly}/>
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: buttonsSettingsForm,
};

export default ButtonsComponent;
