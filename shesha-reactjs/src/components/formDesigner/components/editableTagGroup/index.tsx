import React from 'react';
import { IToolboxComponent } from '@/interfaces';
import { FormMarkup } from '@/providers/form/models';
import { HomeOutlined } from '@ant-design/icons';
import ConfigurableFormItem from '../formItem';
import settingsFormJson from './settingsForm.json';
import { EditableTagGroup } from '../../..';
import { validateConfigurableComponentSettings } from '@/providers/form/utils';
import { DataTypes } from '@/interfaces/dataTypes';
import { IEditableTagGroupComponentProps } from './interfaces';
import { migrateCustomFunctions, migratePropertyName, migrateReadOnly } from '@/designer-components/_common-migrations/migrateSettings';
import { migrateVisibility } from '@/designer-components/_common-migrations/migrateVisibility';

const settingsForm = settingsFormJson as FormMarkup;

const EditableTagGroupComponent: IToolboxComponent<IEditableTagGroupComponentProps> = {
  type: 'editableTagGroup',
  name: 'Tags Outlined',
  icon: <HomeOutlined />,
  dataTypeSupported: ({ dataType }) => dataType === DataTypes.array,
  Factory: ({ model }) => {
    return (
      <ConfigurableFormItem model={model}>
        {(value, onChange) => (<EditableTagGroup value={value} defaultValue={model?.defaultValue} onChange={onChange} readOnly={model.readOnly} />)}
      </ConfigurableFormItem>
    );
  },
  settingsFormMarkup: settingsForm,
  migrator: (m) => m
    .add<IEditableTagGroupComponentProps>(0, (prev) => migratePropertyName(migrateCustomFunctions(prev)))
    .add<IEditableTagGroupComponentProps>(1, (prev) => migrateVisibility(prev))
    .add<IEditableTagGroupComponentProps>(2, (prev) => migrateReadOnly(prev))
  ,
  validateSettings: model => validateConfigurableComponentSettings(settingsForm, model),
};

export default EditableTagGroupComponent;
