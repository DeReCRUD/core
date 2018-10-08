import { default as createReduxZeroStore } from 'redux-zero';
import { connect } from 'redux-zero/devtools';
import { applyMiddleware } from 'redux-zero/middleware';
import {
  FieldChangeNotification,
  FieldChangeNotificationType,
  FieldParentChangeNotification,
  FormSubmission,
  FormType,
  ICollectionReferences
} from './form/form.props';
import { IButtonOptions } from './models/button-options';
import { IChildErrors, IErrors } from './models/errors';
import { Formatters } from './models/formatters';
import { IRendererOptions } from './models/renderer-options';
import { IStruct, SimpleFieldValue } from './models/schema';
import { DeReCrudOptions } from './options';
import createFieldParent from './utils/create-field-parent';
import generateChildErrors from './utils/generate-child-errors';
import parseButtonOptions from './utils/parse-button-options';
import SchemaParser from './utils/schema-parser';

let FORM_COUNTER = 0;

export interface IStore {
  middleware(): void;
  setState(state: Partial<IStoreState>): void;
  subscribe(cb: () => any): any;
  getState(): IStoreState;
  reset(): void;
}

export interface INavState {
  path: string;
  struct: string;
  block: string;
}

export interface IStoreState {
  formId: number;
  schema: any;
  type: FormType;
  structs: IStruct[];
  struct: string;
  block: string;
  initialValue: object;
  value: object;
  navStack: INavState[];
  focused: { [path: string]: SimpleFieldValue };
  touched: { [path: string]: boolean };
  readOnly: { [path: string]: boolean };
  busy: { [path: string]: boolean };
  errors: IErrors;
  childErrors: IChildErrors;
  externalErrors: IErrors;
  externalChildErrors: IChildErrors;
  formatters: Formatters;
  rendererOptions: IRendererOptions;
  buttonOptions: IButtonOptions;
  collectionReferences?: ICollectionReferences;
  submitting?: boolean;
  onSubmit?: FormSubmission;
  onCancel?: () => void;
  onFieldChange?: FieldChangeNotification;
  onFieldChangeInputTimeout?: number;
  onFieldChangeType?: FieldChangeNotificationType;
  onFieldParentChange?: FieldParentChangeNotification;
}

const logger = (store) => (next) => (action) => {
  if (process.env.ENABLE_LOGGING) {
    // tslint:disable-next-line:no-console
    console.log('current state:', store.getState());
  }

  return next(action);
};

export function createStore(
  schema: any,
  struct: string,
  type?: FormType,
  block?: string,
  formatters?: Formatters,
  rendererOptions?: IRendererOptions,
  buttonOptions?: IButtonOptions,
  collectionReferences?: ICollectionReferences,
  initialErrors?: IErrors,
  initialValue?: object,
  onSubmit?: FormSubmission,
  onCancel?: () => void,
  onFieldChange?: FieldChangeNotification,
  onFieldChangeInputTimeout?: number,
  onFieldChangeType?: FieldChangeNotificationType,
  onFieldParentChange?: FieldParentChangeNotification
): IStore {
  const structs = SchemaParser.parse(schema);

  const optionDefaults = DeReCrudOptions.getDefaults();
  formatters = formatters || optionDefaults.formatters || {};

  const structReference = structs.find((x) => x.name === struct);
  initialValue = createFieldParent(
    structReference.fields,
    initialValue,
    formatters
  );

  if (!type) {
    const keyFields = structReference.fields.filter((x) => x.keyField);

    const allKeyFieldsSet =
      keyFields.length > 0 &&
      keyFields.every(
        (keyField) => typeof initialValue[keyField.name] !== 'undefined'
      );

    type = allKeyFieldsSet ? 'update' : 'create';
  }

  const state: IStoreState = {
    block: block || 'default',
    busy: {},
    buttonOptions: parseButtonOptions(
      buttonOptions,
      optionDefaults.buttonOptions
    ),
    childErrors: {},
    collectionReferences,
    errors: {},
    externalChildErrors: generateChildErrors(initialErrors),
    externalErrors: initialErrors || {},
    focused: {},
    formId: ++FORM_COUNTER,
    formatters,
    initialValue,
    navStack: [],
    onCancel,
    onFieldChange,
    onFieldChangeInputTimeout,
    onFieldChangeType: onFieldChangeType || 'blur',
    onFieldParentChange,
    onSubmit,
    readOnly: {},
    rendererOptions: rendererOptions || optionDefaults.rendererOptions,
    schema,
    struct,
    structs,
    touched: {},
    type,
    value: initialValue
  };

  const middlewares = [logger, connect ? connect(state) : null].filter(
    (x) => x
  );

  return createReduxZeroStore(state, applyMiddleware(...middlewares)) as IStore;
}
