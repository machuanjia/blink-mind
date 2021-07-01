import { FocusMode, KeyType, OpType } from '@blink-mind/core';
import { BaseProps, PropKey } from '@blink-mind/renderer-react';
import { Alert, Button } from 'blueprintjs-core';
import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  width: 380px;
  margin: 10px;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  width: 300px;
  text-decoration: underline;
  cursor: pointer;
`;

const ButtonPlace = styled.div`
  width: 80px;
`;

export type ReferenceTopicThumbnailProps = BaseProps & {
  refKey: KeyType;
  refType: 'reference' | 'referenced' | undefined | null;
  removeHandler?: (event: React.MouseEvent<HTMLElement>) => void;
};
export function ReferenceTopicThumbnail(props: ReferenceTopicThumbnailProps) {
  const { controller, refKey, refType, removeHandler } = props;
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const onClick = e => {
    e.stopPropagation();
    controller.run('operation', {
      ...props,
      opArray: [
        {
          opType: OpType.FOCUS_TOPIC,
          topicKey: refKey,
          focusMode: FocusMode.NORMAL
        },
        {
          opType: OpType.EXPAND_TO,
          topicKey: refKey
        }
      ]
    });
    setTimeout(() => {
      controller.run('moveTopicToCenter', { ...props, topicKey: refKey });
    });
  };

  const onClickRemove = e => {
    setDeleteConfirm(true);
  };

  let content = controller.getValue(PropKey.TOPIC_TITLE, {
    ...props,
    topicKey: refKey
  });
  content = content.length < 97 ? content : content.substr(0, 97) + '...';
  const deleteAlertProps = {
    isOpen: deleteConfirm,
    cancelButtonText: 'cancel',
    onConfirm: e => {
      removeHandler(e);
    },
    onCancel: e => {
      setDeleteConfirm(false);
    },
    onClose: e => {
      setDeleteConfirm(false);
    }
  };
  return (
    <Root>
      <Content onClick={onClick}>{content}</Content>
      <ButtonPlace>
        {refType === 'reference' && (
          <>
            <Button onClick={onClickRemove}>Remove</Button>
            <Alert {...deleteAlertProps}>
              <p>Are you confirm to remove this reference?</p>
            </Alert>
          </>
        )}
      </ButtonPlace>
    </Root>
  );
}
