import { OpType } from '@blink-mind/core';
import { Classes, Position, Tooltip } from '@blueprintjs/core';
import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import { BaseWidget, Btn, ZIndex } from '../../../../components/common';
import {
  EventKey,
  getRelativeVector,
  Icon,
  IconName,
  RefKey,
  topicRefKey
} from '../../../../utils';

const log = debug('node:view-port-viewer');

const ViewerRoot = styled(ZIndex)`
  position: absolute;
  background: white;
  right: 30px;
  bottom: 20px;
  border-radius: 2px;
  display: flex;
  flex-direction: row;
  user-select: none;
`;

const Item_ = styled(Btn)`
  margin: 10px;
`;

const ZoomFactorSpan = styled.span`
  display: inline-block;
  width: 80px;
  height: 18px;
`;

const Item = props => {
  return (
    <>
    {/* <Tooltip
    //   content={props.tooltip}
    //   position={Position.TOP}
    //   className={Classes.ICON}
    // > */}
    <div title={props.tooltip}>
      <Item_ onClick={props.onClick} tabIndex={-1}>
        {props.children}
      </Item_>
    </div>  
    {/* </Tooltip> */}
    </>
  );
};

export class ViewPortViewer extends BaseWidget {
  constructor(props) {
    super(props);
  }

  componentDidMount(): void {
    const props = this.props;
    const { controller } = props;
    controller.run('addZoomFactorChangeEventListener', {
      ...props,
      listener: this.zoomFactorChange
    });
  }

  componentWillUnmount(): void {
    const props = this.props;
    const { controller } = props;
    controller.run('removeZoomFactorChangeEventListener', {
      ...props,
      listener: this.zoomFactorChange
    });
  }

  zoomFactorChange = zoomFactor => {
    log('zoomFactorChange', zoomFactor);
    this.setState({ zoomFactor });
  };

  onClickResetZoom = e => {
    const props = this.props;
    const { controller } = props;
    controller.run('setZoomFactor', {
      ...props,
      zoomFactor: 1
    });
  };

  onClickAddZoom = e => {
    const props = this.props;
    const { controller } = props;
    const zoomFactor = controller.run('getZoomFactor', props);
    controller.run('setZoomFactor', {
      ...props,
      zoomFactor: zoomFactor + 0.1
    });
  };

  onClickMinusZoom = e => {
    const props = this.props;
    const { controller } = props;
    const zoomFactor = controller.run('getZoomFactor', props);
    controller.run('setZoomFactor', {
      ...props,
      zoomFactor: zoomFactor - 0.1
    });
  };

  onClickCollapseAll = e => {
    const props = this.props;
    const { controller } = props;
    controller.run('addEventListener', {
      ...props,
      key: EventKey.CENTER_ROOT_TOPIC,
      listener: this.centerRootTopic,
      once: true
    });
    controller.run('operation', {
      ...props,
      opType: OpType.COLLAPSE_ALL
    });
  };

  onClickExpandAll = e => {
    const props = this.props;
    const { controller } = props;
    controller.run('addEventListener', {
      ...props,
      key: EventKey.CENTER_ROOT_TOPIC,
      listener: this.centerRootTopic,
      once: true
    });
    controller.run('operation', {
      ...props,
      opType: OpType.EXPAND_ALL
    });
  };

  centerRootTopic = () => {
    const { model, controller } = this.props;
    controller.run('moveTopicToCenter', {
      ...this.props,
      topicKey: model.editorRootTopicKey
    });
  };

  render() {
    log('render');
    const props = this.props;
    const { controller, zIndex } = props;
    const zoomFactor = controller.run('getZoomFactor', props);
    let defaultToolbarAside = {
        collapseAll: {
          icon: Icon(IconName.COLLAPSE_ALL),
          title: 'collapse all',
        },
        expandAll: { icon: Icon(IconName.EXPAND_ALL), title: 'expand all' },
        center: { icon: Icon(IconName.CENTER), title: 'center root topic' },
        zoomIn: { icon: Icon(IconName.MINUS), title: 'zoom in' },
        resetZoom: { icon: <></> , title: 'reset zoom' },
        zoomOut: { icon: Icon(IconName.PLUS), title: 'zoom out' },
    }
    let toolbarAside = defaultToolbarAside
  try {
     toolbarAside = controller.run('renderToolBarAside', props)
  } catch (error) {
    toolbarAside = defaultToolbarAside
  }
    return (
      <ViewerRoot zIndex={zIndex}>
        <Item onClick={this.onClickCollapseAll} tooltip={toolbarAside.collapseAll.title}>
          {toolbarAside.collapseAll.icon}
        </Item>
        <Item onClick={this.onClickExpandAll} tooltip={toolbarAside.expandAll.title}>
          {toolbarAside.expandAll.icon}
        </Item>
        <Item onClick={this.centerRootTopic} tooltip={toolbarAside.center.title}>
          {toolbarAside.center.icon}
        </Item>
        <Item onClick={this.onClickMinusZoom} tooltip={toolbarAside.zoomIn.title}>
          {toolbarAside.zoomIn.icon}
        </Item>
        <Item onClick={this.onClickResetZoom} tooltip={toolbarAside.resetZoom.title}>
           {`${Math.floor(
            zoomFactor * 100
          )}%`}
        </Item>
        <Item onClick={this.onClickAddZoom} tooltip={toolbarAside.zoomOut.title}>
          {toolbarAside.zoomOut.icon}
        </Item>
      </ViewerRoot>
    );
  }
}
