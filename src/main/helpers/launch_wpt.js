const path = require('path')
const log = require('electron-log')
const fs = require('fs')
const CustomError = require('../../helpers/custom_error')

module.exports = function launchWpt (wpt, callback) {
  // var started = /\[HTTPS? Server] started/;
  let wptPid = null
  let messages = ''

  return new Promise((resolve, reject) => {
    let timeout = setTimeout(() => {
      child.stdout.removeAllListeners()
      child.stderr.removeAllListeners()
      child.removeAllListeners()
      if (!child.killed) {
        child.kill('SIGKILL')
      }
      if (wptPid) {
        process.kill(wptPid)
      }
      timeout = null
      reject(
        new CustomError(
          500,
          CustomError.CODE.WPT_CANNOT_BE_CREATED,
          'Cannot create Wyndpostools (timeout: 20 sec)'
        )
      )
    }, 1000 * 20)
    // cannot use fork same node version of nw used
    const spawn = require('child_process').spawn

    const options = {
      stdio: ['pipe', 'pipe', 'pipe']
    }

    const isScript =
      path.extname(wpt.path) === '.sh' || path.extname(wpt.path) === '.bat'
    let isJs = path.extname(wpt.path) === '.js'

    const exePath =
      isScript || isJs ? wpt.path : path.join(wpt.path, 'lib', 'main.js')
	isJs =  path.extname(exePath) === '.js'
    const exe = isScript ? wpt.path : 'node'
    const args = isScript
      ? []
      : ['--experimental-worker', '--no-warnings', wpt.path]

    if (!fs.existsSync(exePath)) {
      reject(
        new CustomError(
          400,
          CustomError.CODE.INVALID_$$_PATH,
          'wrong wpt path in config: ' + wpt.path,
          ['WPT']
        )
      )
    }
	if (isScript && path.extname(wpt.path) === '.sh' || isJs) {
		// not working on Windows with .bat ...
		options.stdio.push('ipc')
	}

	if (!isJs) {
		wpt.wait_on_ipc = false
	}

    const child = spawn(exe, args, options)
    if (wpt.wait_on_ipc) {
      child.on('message', message => {
        log.info('wpt.send', message)
        if (typeof message === 'object' && message.pid) {
          wptPid = message.pid
          if (callback) {
            callback('get_wpt_pid_done', wptPid)
          }
        } else if (
          typeof message === 'string' &&
          message.toUpperCase().indexOf('READY') >= 0
        ) {
          if (timeout) {
            clearTimeout(timeout)
            timeout = null
          }
          child.stdout.removeAllListeners()
          child.stderr.removeAllListeners()
          child.removeAllListeners()
          resolve(child)
        }
      })
    }

    if (
      !wpt.wait_on_ipc ||
      (process.env.DEBUG && process.env.DEBUG === 'wpt')
    ) {
      child.stdout.on('data', function (data) {
        if (process.env.DEBUG && process.env.DEBUG === 'wpt') {
          // eslint-disable-next-line no-console
          console.log('WPT ->', data.toString())
        }
		if (messages.length > 0) {
			messages.length = ""
		}
        if (
          !wpt.wait_on_ipc &&
          (data.indexOf('[HTTP Server] started on port') >= 0 ||
            data.indexOf('[HTTPS Server] started on port') >= 0)
        ) {
          if (timeout) {
            clearTimeout(timeout)
            timeout = null
          }
          child.stdout.removeAllListeners()
          child.stderr.removeAllListeners()
          child.removeAllListeners()
          resolve(child)
        }
      })
    }

    child.stderr.on('data', function (data) {
    //   if (messages.length === 0) {
    //     setTimeout(() => {
    //       child.kill('SIGKILL')
    //       if (wptPid) {
    //         try {
    //           process.kill(wptPid)
    //         } catch (err2) {
    //           // console.log(err2)
    //         }
    //       }
    //       child.stdout.removeAllListeners()
    //       child.stderr.removeAllListeners()
    //       child.removeAllListeners()
    //       const err = new CustomError(
    //         400,
    //         CustomError.CODE.WPT_CREATION_FAILED,
    //         wpt.path,
    //         []
    //       )
    //       err.messages = messages
    //       reject(err)
    //     }, 1000)
    //   }
      messages += data.toString()
    })

    child.once('exit', reason => {
      setTimeout(() => {
        child.stdout.removeAllListeners()
        child.stderr.removeAllListeners()
        child.removeAllListeners()
        reject(
          new CustomError(
            500,
            CustomError.CODE.WPT_CANNOT_BE_CREATED,
            messages
              ? messages
              : 'Cannot create Wyndpostools. Exit(' + reason + ')'
          )
        )
      }, 1000)
    })

    child.once('error', err => {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      if (!child.killed) {
        child.kill('SIGKILL')
        child.stdout.removeAllListeners()
        child.stderr.removeAllListeners()
        child.removeAllListeners()
      }
      err.messages = messages
      reject(err)
    })
  })
}
