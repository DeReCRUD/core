import { connect } from 'redux-zero/preact';
import { ComponentConstructor } from '../../models/constructors';
import { IStoreState } from '../../store';
import BlockHostRenderer from './block-host-renderer.component';
import {
  IBlockHostRendererConnectProps,
  IBlockHostRendererProps
} from './block-host-renderer.props';

const mapToProps = ({
  formId,
  value,
  rendererOptions
}: IStoreState): Partial<IBlockHostRendererProps> => ({
  formId,
  formValue: value,
  rendererOptions
});

export default connect(mapToProps)(BlockHostRenderer) as ComponentConstructor<
  IBlockHostRendererConnectProps
>;
