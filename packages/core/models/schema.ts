export const DEFAULT_FIELD_WIDTH = 12;
export type StampSize = 1 | 2 | 3 | 4 | 5 | 6;

export type FieldConditionFunc = (fieldParent: any, form: any) => boolean;
export type BlockConditionFunc = (form: any) => boolean;

export type FieldType =
  | 'text'
  | 'keyword'
  | 'integer'
  | 'estimate'
  | 'date'
  | 'boolean'
  | 'percent'
  | 'money'
  | 'foreignKey'
  | 'linkedStruct'
  | 'list'
  | 'derived'
  | 'stamp';

export interface ILabel {
  short: string;
  medium: string;
  long: string;
}

export interface IStruct {
  name: string;
  label?: ILabel;
  collectionLabel?: ILabel;
  fields: IField[];
  blocks: IBlock[];
}

export interface IField {
  name: string;
  label: ILabel;
  keyField: boolean;
  type: FieldType;
  required: boolean;
  unique: boolean;
  help?: string;
  initialValue?: any;
  missingValue?: any;
  placeholder?: string;
  hints: {
    width: number;
  };
}

export interface ITextField extends IField {
  type: 'text';
  initialValue?: string;
  missingValue?: string;
  minLength?: number;
  maxLength?: number;
}

export interface IIntegerField extends IField {
  type: 'integer';
  initialValue?: number;
  missingValue?: number;
  min?: number;
  max?: number;
}

export type ListValues = string | number;

export interface IListField extends IField {
  type: 'list';
  initialValue?: ListValues | ListValues[];
  missingValue?: ListValues | ListValues[];
  multiSelect: boolean;
  options: IOption[];
}

export interface IOption {
  label: string;
  value: string | number;
}

type ReferenceValues = ListValues | object;

export interface IReferenceField extends IField {
  type: 'linkedStruct' | 'foreignKey';
  initialValue?: ReferenceValues | ReferenceValues[];
  missingValue?: ReferenceValues | ReferenceValues[];
  reference: {
    struct: IStruct;
    block: IBlock;
  };
}

export interface ILinkedStructField extends IReferenceField {
  type: 'linkedStruct';
  initialValue?: object[];
  missingValue?: object[];
  minInstances?: number;
  maxInstances?: number;
}

export interface IForeignKeyField extends IReferenceField {
  type: 'foreignKey';
  initialValue?: ListValues;
  missingValue?: ListValues;
}

export interface IBlock {
  name: string;
  label?: ILabel;
  condition: BlockConditionFunc;
  items: Array<
    IBlockReference | IFieldReference | ILinkedStructFieldReference | IStamp
  >;
  fields: Array<IFieldReference | ILinkedStructFieldReference>;
  hints: {
    layout: 'vertical' | 'horizontal';
  };
}

export interface IBlockReference {
  block: IBlock;
}

export interface IFieldReference {
  field: IField;
  condition: FieldConditionFunc;
  hints: {
    width?: number;
  };
}

export interface IStamp {
  text: string;
  size: StampSize;
  blockInstance: number;
  condition: FieldConditionFunc;
}

export interface ILinkedStructFieldReference extends IFieldReference {
  hints: {
    width?: number;
    layout: 'inline' | 'table';
    block?: IBlock;
  };
}
