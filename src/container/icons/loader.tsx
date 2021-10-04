import React from 'react'

import { Spin, SpinProps } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }}/>

export default (props?: SpinProps) => <Spin indicator={antIcon} {...props}/>
