import { Store } from 'redux';
import io from 'socket.io-client'
import { IAppAction, IRootState } from '../interface';
import { TAppActionTypeKeys, wptConnectedAction, wptDisConnectedAction } from '../store/actions';
import { ICustomWindow } from './window';
declare let window: ICustomWindow;

export default function connectToWpt(wpt_url: string, store: Store<IRootState, IAppAction<TAppActionTypeKeys>>) {
	return new Promise<[any, any, any]>((resolve, reject) => {
		const socket = io(wpt_url, {
		});
		window['socket'] = socket
		let timeout: NodeJS.Timeout | null = setTimeout(() => {
			reject(new Error("Cannot connect to Wyndpostools"))
		}, 1000 * 10)

		socket.on('connect', () => {
			if (timeout) {
				clearTimeout(timeout)
				timeout = null
			}
			store.dispatch(wptConnectedAction())
		})

		socket.on('disconnect', () => {
			if (timeout) {
				clearTimeout(timeout)
				timeout = null
			}
			store.dispatch(wptDisConnectedAction())
		})
		socket.once('error', (err: Error) => {
			if (timeout) {
				clearTimeout(timeout)
				timeout = null
			}
			reject(err)
		})
		socket.once('infos', function (infos: any) {
			socket.emit('plugins');
			socket.once('plugins', function (plugins: any) {
				if (timeout) {
					clearTimeout(timeout)
					timeout = null
				}
				resolve([socket, infos, plugins])
			});

		});
		socket.emit('infos')

	})


}
