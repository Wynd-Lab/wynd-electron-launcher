import React from 'react'

import log from 'electron-log'

import { Button } from 'react-antd-cssvars'
import { IButtonProps } from 'react-antd-cssvars/dist/components/Button'

export interface IButtonWithLog extends IButtonProps {
  action?: string;
}

const ButtonWithLog: React.FunctionComponent<IButtonWithLog> = (props) => {
  const innerOnClick = (e: React.MouseEvent<HTMLElement>) => {
    let action: string | undefined
    if (
      (action =
        (e.currentTarget.dataset && e.currentTarget.dataset.action) ||
        props.action)
    ) {
      log.debug('[WINDOW CONTAINER] Click', action)
    }
    props.onClick && props.onClick(e)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onClick, ...otherProps } = props
  return (
    <Button {...otherProps} onClick={innerOnClick}>
      {props.children}
    </Button>
  )
}

export default ButtonWithLog
