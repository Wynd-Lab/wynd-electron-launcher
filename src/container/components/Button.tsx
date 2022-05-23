import React from 'react'

import { Button } from 'react-antd-cssvars'
import { IButtonProps } from 'react-antd-cssvars/dist/components/Button'
import { ICustomWindow } from '../../helpers/interface'

export interface IButtonWithLog extends IButtonProps {
  action?: string;
}

declare let window: ICustomWindow

const ButtonWithLog: React.FunctionComponent<IButtonWithLog> = (props) => {
  const innerOnClick = (e: React.MouseEvent<HTMLElement>) => {
    let action: string | undefined
    if (
      (action =
        (e.currentTarget.dataset && e.currentTarget.dataset.action) ||
        props.action)
    ) {
      window.log.info('[WINDOW CONTAINER] Click', action)
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
