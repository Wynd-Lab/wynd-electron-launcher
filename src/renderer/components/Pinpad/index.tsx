import React, { useState } from 'react'

import { Col, Row, Modal } from 'antd'
import { Button } from 'react-antd-cssvars'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import { IPinpad, IRootState } from '../../interface'

export interface IPinpadProps {
	code: string
	onSuccess?: () => void
}

const messages = {
	default: 'Enter your PIN Code',
	success: 'Valid PIN Code',
	error: 'Incorrect PIN Code',
}
export interface IPinpadState {
	code: string
	message: string
	disable: boolean
	shake: boolean
}

const Pinpad: React.FunctionComponent<IPinpadProps> = (props) => {
	const [state, setState] = useState<IPinpadState>({
		message: messages.default,
		code: '',
		disable: false,
		shake: false,
	})

	const reset = () => {
		setState({
			message: messages.default,
			code: '',
			disable: false,
			shake: false,
		})
	}

	const conf = useSelector<IRootState, IPinpad>((state) => state.pinpad)

	const onClick = (value: number) => (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault()
		const currentTarget = e.currentTarget
		setTimeout(() => {
			currentTarget.blur()
		}, 150)

		let newCode = state.code + value

		if (state.code.length < props.code.length) {
			newCode = state.code + value
			const message =
				newCode.length < props.code.length
					? messages.default
					: newCode !== props.code
					? messages.error
					: messages.success
			setState({
				code: newCode,
				message: message,
				disable: newCode.length === props.code.length,
				shake: newCode.length === props.code.length && newCode !== props.code,
			})
		}

		if (newCode === props.code) {
			props.onSuccess && props.onSuccess()
			reset()
		}
	}

	const onClear = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault()
		const currentTarget = e.currentTarget
		setTimeout(() => {
			currentTarget.blur()
		}, 150)
		setState({
			code: '',
			message: messages.default,
			disable: false,
			shake: false,
		})
	}

	const messageCls = classNames({
		btn: true,
		'message-container': true,
		error: state.code.length >= props.code.length && state.code !== props.code,
	})

	const inputCls = classNames({
		'input-container': true,
		shake: state.shake,
	})

	return (
		<Modal
			className="pinpad"
			visible={conf.open}
			closable={false}
			footer={null}
			centered={true}
			width="auto"
		>
			<div className={messageCls}>{state.message}</div>

			<div className={inputCls}>
				<input type="password" disabled value={state.code}></input>
			</div>

			<div className="numbers">
				<Row className="pinpad-row">
					<Col>
						<Button
							disabled={state.disable}
							className="pinpad-button"
							size="large"
							shape="circle"
							onClick={onClick(1)}
						>
							1
						</Button>
					</Col>
					<Col>
						<Button
							disabled={state.disable}
							className="pinpad-button"
							size="large"
							shape="circle"
							onClick={onClick(2)}
						>
							2
						</Button>
					</Col>
					<Col>
						<Button
							disabled={state.disable}
							className="pinpad-button"
							size="large"
							shape="circle"
							onClick={onClick(3)}
						>
							3
						</Button>
					</Col>
				</Row>
				<Row className="pinpad-row">
					<Col>
						<Button
							disabled={state.disable}
							className="pinpad-button"
							size="large"
							shape="circle"
							onClick={onClick(4)}
						>
							4
						</Button>
					</Col>
					<Col>
						<Button
							disabled={state.disable}
							className="pinpad-button"
							size="large"
							shape="circle"
							onClick={onClick(5)}
						>
							5
						</Button>
					</Col>
					<Col>
						<Button
							disabled={state.disable}
							className="pinpad-button"
							size="large"
							shape="circle"
							onClick={onClick(6)}
						>
							6
						</Button>
					</Col>
				</Row>
				<Row className="pinpad-row">
					<Col>
						<Button
							disabled={state.disable}
							className="pinpad-button"
							size="large"
							shape="circle"
							onClick={onClick(7)}
						>
							7
						</Button>
					</Col>
					<Col>
						<Button
							disabled={state.disable}
							className="pinpad-button"
							size="large"
							shape="circle"
							onClick={onClick(8)}
						>
							8
						</Button>
					</Col>
					<Col>
						<Button
							disabled={state.disable}
							className="pinpad-button"
							size="large"
							shape="circle"
							onClick={onClick(9)}
						>
							9
						</Button>
					</Col>
				</Row>
				<Row className="pinpad-row">
					<Col>
						<Button
							disabled={state.disable}
							className="pinpad-button"
							size="large"
							shape="circle"
							onClick={onClick(0)}
						>
							0
						</Button>
					</Col>
					<Col>
						<Button
							disabled={state.code.length === 0}
							className="pinpad-button"
							size="large"
							shape="circle"
							onClick={onClear}
						>
							C
						</Button>
					</Col>
				</Row>
			</div>
		</Modal>
	)
}

export default Pinpad
