import { connect } from 'redux-zero/preact';
import { combineActions } from 'redux-zero/utils';
import { ComponentConstructor } from '../models/constructors';
import navigationActions from '../navigation.actions';
import { IStoreState } from '../store';
import formActions from './form.actions';
import Form from './form.component';
import { IFormProps } from './form.props';

const mapToProps = ({
  block,
  navStack,
  rendererOptions,
  buttonOptions,
  onCancel,
  schema,
  struct,
  structs,
  submitting,
  type
}: IStoreState): Partial<IFormProps> => ({
  block,
  buttonOptions,
  navStack,
  onCancel,
  rendererOptions,
  schema,
  struct,
  structs,
  submitting,
  type
});

export default connect(
  mapToProps,
  combineActions(navigationActions, formActions)
)(Form) as ComponentConstructor<{}>;
