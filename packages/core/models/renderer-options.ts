import {
  ComponentConstructor,
  FunctionalComponent,
} from '../models/constructors';
import {
  IBlockContainerRenderer,
  IBooleanFieldRenderer,
  IButtonRenderer,
  IFieldContainerRenderer,
  IFieldRenderer,
  IForeignKeyFieldRenderer,
  IInlineLinkedStructRenderer,
  IRadioListFieldRenderer,
  ISelectListFieldRenderer,
  IStampRenderer,
  ITableLinkedStructRenderer,
  ITextFieldRenderer,
} from '../models/renderers';

export interface IRendererOptions {
  formClassName?: string;
  components: {
    stamp:
      | FunctionalComponent<IStampRenderer>
      | ComponentConstructor<IStampRenderer>;
    blockContainer:
      | FunctionalComponent<IBlockContainerRenderer>
      | ComponentConstructor<IBlockContainerRenderer>;
    button:
      | FunctionalComponent<IButtonRenderer>
      | ComponentConstructor<IButtonRenderer>;
    fieldContainer:
      | FunctionalComponent<IFieldContainerRenderer>
      | ComponentConstructor<IFieldContainerRenderer>;
    textField:
      | FunctionalComponent<ITextFieldRenderer>
      | ComponentConstructor<ITextFieldRenderer>;
    keywordField:
      | FunctionalComponent<IFieldRenderer>
      | ComponentConstructor<IFieldRenderer>;
    integerField:
      | FunctionalComponent<IFieldRenderer>
      | ComponentConstructor<IFieldRenderer>;
    estimateField:
      | FunctionalComponent<IFieldRenderer>
      | ComponentConstructor<IFieldRenderer>;
    dateField:
      | FunctionalComponent<IFieldRenderer>
      | ComponentConstructor<IFieldRenderer>;
    booleanField:
      | FunctionalComponent<IBooleanFieldRenderer>
      | ComponentConstructor<IBooleanFieldRenderer>;
    percentField:
      | FunctionalComponent<IFieldRenderer>
      | ComponentConstructor<IFieldRenderer>;
    moneyField:
      | FunctionalComponent<IFieldRenderer>
      | ComponentConstructor<IFieldRenderer>;
    foreignKeyField:
      | FunctionalComponent<IForeignKeyFieldRenderer>
      | ComponentConstructor<IForeignKeyFieldRenderer>;
    inlineLinkedStructField:
      | FunctionalComponent<IInlineLinkedStructRenderer>
      | ComponentConstructor<IInlineLinkedStructRenderer>;
    tableLinkedStructField:
      | FunctionalComponent<ITableLinkedStructRenderer>
      | ComponentConstructor<ITableLinkedStructRenderer>;
    selectListField:
      | FunctionalComponent<ISelectListFieldRenderer>
      | ComponentConstructor<ISelectListFieldRenderer>;
    radioListField:
      | FunctionalComponent<IRadioListFieldRenderer>
      | ComponentConstructor<IRadioListFieldRenderer>;
    derivedField:
      | FunctionalComponent<IFieldRenderer>
      | ComponentConstructor<IFieldRenderer>;
  };
}
