import { h } from 'preact';
import BaseComponent from '../../base-component';
import Logger from '../../logger';
import {
  FieldBlurEvent,
  FieldChangeEvent,
  FieldFocusEvent,
  IFieldRenderer,
  IForeignKeyFieldRenderer,
  IInlinedLinkedStructRenderer,
  IListFieldRenderer,
  ISelectableOption,
  ITableLinkedStructRenderer
} from '../../models/renderers';
import {
  IField,
  IFieldReference,
  IForeignKeyField,
  ILinkedStructField,
  ILinkedStructFieldReference,
  IListField,
  IReferenceField,
  SimpleFieldValue
} from '../../models/schema';
import debounce from '../../utils/debounce';
import BlockHostRenderer from '../block-host-renderer';
import { IFieldHostRendererProps } from './field-host-renderer.props';

type DebouncedChangedValue = (
  field: IField,
  fieldPath: string,
  value: SimpleFieldValue
) => void;

export default class FieldHostRenderer extends BaseComponent<
  IFieldHostRendererProps
> {
  private debouncedChangedValue: DebouncedChangedValue;

  constructor(props: IFieldHostRendererProps) {
    super(props);

    this.debouncedChangedValue = debounce(
      this.changeValue
    ) as DebouncedChangedValue;
  }

  public render() {
    const {
      errors,
      fieldReference,
      fieldValue,
      rendererId,
      rendererOptions,
      touched
    } = this.props;

    const field = fieldReference.field;

    const fieldProps: IFieldRenderer = {
      errors: touched ? errors : [],
      fieldDescription: field.help,
      fieldName: field.name,
      fieldType: field.type,
      label: field.label.short,
      onBlur: this.onBlur,
      onChange: this.onChange,
      onFocus: this.onFocus,
      placeholder: field.placeholder,
      rendererId,
      required: field.required,
      value: fieldValue
    };

    const renderedField = this.renderField(fieldReference, fieldProps);
    const FieldContainerRenderer = rendererOptions.components.fieldContainer;

    return (
      <FieldContainerRenderer
        rendererId={rendererId}
        fieldName={fieldProps.fieldName}
        fieldDescription={fieldProps.fieldDescription}
        errors={fieldProps.errors}
        renderedField={renderedField}
      />
    );
  }

  private changeValue = (
    field: IField,
    fieldPath: string,
    value: SimpleFieldValue
  ) => {
    this.props.changeValue(field, fieldPath, value);
  };

  private onFocus = (_: FieldFocusEvent) => {
    const {
      focusField,
      fieldReference: { field },
      fieldPath
    } = this.props;

    focusField(field, fieldPath);
  };

  private onBlur = (_: FieldBlurEvent) => {
    const {
      blurField,
      fieldReference: { field },
      fieldPath,
      parentPath
    } = this.props;

    blurField(field, fieldPath, parentPath);
  };

  private onChange = (e: FieldChangeEvent) => {
    let value;

    switch (e.target.type) {
      case 'checkbox':
        value = e.target.checked;
        break;
      case 'select-multiple':
        value = [];

        const { options } = e.target;
        for (const option of options) {
          if (option.selected) {
            value.push(option.value);
          }
        }
        break;
      default:
        value = e.target.value;
        break;
    }

    const {
      fieldReference: { field },
      fieldPath
    } = this.props;

    this.debouncedChangedValue(field, fieldPath, value);
  };

  private onAdd = (index: number) => {
    const { changeArrayValue, push, fieldReference, fieldPath } = this.props;

    const itemPath = fieldPath + '.' + index;

    const linkedStructField = fieldReference.field as ILinkedStructField;

    const {
      reference: { struct, block }
    } = linkedStructField;

    const linkedStructFieldReference = fieldReference as ILinkedStructFieldReference;

    changeArrayValue(linkedStructField, fieldPath, itemPath, 'add');

    if (linkedStructFieldReference.hints.layout === 'table') {
      push({
        block: block.name,
        path: itemPath,
        struct: struct.name
      });
    }
  };

  private onEdit = (index: number) => {
    const { push, fieldReference, fieldPath } = this.props;

    const {
      reference: { struct, block }
    } = fieldReference.field as IReferenceField;

    push({
      block: block.name,
      path: `${fieldPath}.${index}`,
      struct: struct.name
    });
  };

  private onRemove = (index: number) => {
    const { changeArrayValue, fieldReference, fieldPath } = this.props;

    const linkedStructField = fieldReference.field as ILinkedStructField;

    changeArrayValue(
      linkedStructField,
      fieldPath,
      `${fieldPath}.${index}`,
      'remove'
    );
  };

  private renderField(
    fieldReference: IFieldReference,
    fieldProps: IFieldRenderer
  ) {
    const {
      fieldPath,
      rendererOptions,
      childErrors,
      collectionReferences,
      parentValue,
      formValue
    } = this.props;
    const { field } = fieldReference;

    switch (field.type) {
      case 'text': {
        const TextFieldRenderer = rendererOptions.components.textField;
        return <TextFieldRenderer {...fieldProps} value={fieldProps.value as string} />;
      }
      case 'keyword': {
        const KeywordFieldRenderer = rendererOptions.components.keywordField;
        return <KeywordFieldRenderer {...fieldProps} />;
      }
      case 'integer': {
        const IntegerFieldRenderer = rendererOptions.components.integerField;
        return <IntegerFieldRenderer {...fieldProps} />;
      }
      case 'estimate': {
        const EsimateFieldRenderer = rendererOptions.components.estimateField;
        return <EsimateFieldRenderer {...fieldProps} />;
      }
      case 'date': {
        const DateFieldRenderer = rendererOptions.components.dateField;
        return <DateFieldRenderer {...fieldProps} />;
      }
      case 'boolean': {
        const BooleanFieldRenderer = rendererOptions.components.booleanField;
        return <BooleanFieldRenderer {...fieldProps} value={fieldProps.value as boolean} />;
      }
      case 'percent': {
        const PercentFieldRenderer = rendererOptions.components.percentField;
        return <PercentFieldRenderer {...fieldProps} />;
      }
      case 'money': {
        const MoneyFieldRenderer = rendererOptions.components.moneyField;
        return <MoneyFieldRenderer {...fieldProps} />;
      }
      case 'foreignKey': {
        const ForeignKeyFieldRenderer =
          rendererOptions.components.foreignKeyField;
        let options: ISelectableOption[];

        const foreignKeyField = field as IForeignKeyField;
        const { struct, labelField } = foreignKeyField.reference;
        const keyField = struct.fields.find((x) => x.keyField);

        if (!collectionReferences || !collectionReferences[struct.name]) {
          Logger.error(
            `A collection reference must be defined for key: ${struct.name}.`
          );
        } else {
          const collectionReference = collectionReferences[struct.name]({
            formValue,
            parentValue
          });

          if (Array.isArray(collectionReference)) {
            options = collectionReference.map((x) => ({
              label: x[labelField.name],
              selected: x[keyField.name] === fieldProps.value,
              value: x[keyField.name]
            }));
          }
        }

        if (!options) {
          options = [];
        }

        if (typeof fieldProps.value === 'undefined') {
          options.unshift({ label: '', value: '', selected: false });
        }

        const foreignKeyFieldProps: IForeignKeyFieldRenderer = {
          ...fieldProps,
          options
        };

        return <ForeignKeyFieldRenderer {...foreignKeyFieldProps} />;
      }
      case 'linkedStruct': {
        const { reference } = field as ILinkedStructField;
        const { hints } = fieldReference as ILinkedStructFieldReference;
        const isTable = hints.layout === 'table';
        const block = hints.block || reference.block;

        const LinkedStructFieldRenderer = isTable
          ? rendererOptions.components.tableLinkedStructField
          : rendererOptions.components.inlineLinkedStructField;

        let values = [];

        if (isTable) {
          if (Array.isArray(fieldProps.value)) {
            values = fieldProps.value.map((value) =>
              block.fields.map(
                ({ field: blockField }) => value[blockField.name]
              )
            );
          }

          const tableLinkedStructFieldProps: ITableLinkedStructRenderer = {
            ...fieldProps,
            headers: block.fields.map((x) => x.field.label.short),
            onAdd: () => this.onAdd((values && values.length) || 0),
            onEdit: this.onEdit,
            onRemove: this.onRemove,
            value: values,
            valueErrorIndicators: childErrors
          };

          return <LinkedStructFieldRenderer {...tableLinkedStructFieldProps} />;
        } else {
          if (Array.isArray(fieldProps.value)) {
            values = fieldProps.value as object[];
          }

          const items = values.map((_, index) => {
            const itemPath = `${fieldPath}.${index}`;

            return (
              <BlockHostRenderer
                key={itemPath}
                struct={reference.struct.name}
                block={block}
                path={itemPath}
              />
            );
          });

          const inlineLinkedStructFieldProps: IInlinedLinkedStructRenderer = {
            ...fieldProps,
            onAdd: () => this.onAdd((values && values.length) || 0),
            onRemove: this.onRemove,
            renderedItems: items
          };

          return (
            <LinkedStructFieldRenderer {...inlineLinkedStructFieldProps} />
          );
        }
      }
      case 'list': {
        const { multiSelect, options: listOptions } = field as IListField;
        const ListFieldRenderer = rendererOptions.components.listField;

        let value;
        if (typeof fieldProps.value === 'undefined') {
          value = [];
        } else {
          value = !Array.isArray(fieldProps.value)
            ? [fieldProps.value]
            : fieldProps.value;
        }

        const options = listOptions.map((option) => ({
          ...option,
          selected: value.findIndex((x) => x === option.value) >= 0
        }));

        if (!multiSelect && typeof fieldProps.value === 'undefined') {
          options.unshift({ label: '', value: '', selected: false });
        }

        const listFieldProps: IListFieldRenderer = {
          ...fieldProps,
          multiSelect,
          options
        };

        return <ListFieldRenderer {...listFieldProps} />;
      }
      case 'derived': {
        const DerivedFieldRenderer = rendererOptions.components.derivedField;
        return <DerivedFieldRenderer {...fieldProps} />;
      }
      default: {
        Logger.error(`Field type ${field.type} is not supported.`);
        return null;
      }
    }
  }
}
