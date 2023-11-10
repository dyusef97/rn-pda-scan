import { useEffect, useState } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';

const LINKING_ERROR =
  `The package 'rn-pda-scan' doesn't seem to be linked. Make sure: \n\n` +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

export const RnPdaScan = NativeModules.RnPdaScan
  ? NativeModules.RnPdaScan
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

/**
 * Listen for available events
 * @param  {String} eventName Name of event one of onEvent, onError
 * @param  {Function} handler Event handler
 */
const allowedEvents = ['onEvent', 'onError'];

RnPdaScan.on = (eventName: string, handler: any) => {
  if (!allowedEvents.includes(eventName)) {
    throw new Error(`Event name ${eventName} is not a supported event.`);
  }

  let eventEmitter = new NativeEventEmitter(RnPdaScan);
  eventEmitter.addListener(eventName, handler);
};

/**
 * Stop listening for event
 * @param  {String} eventName Name of event one of onEvent, onError
 * @param  {Function} handler Event handler
 */
RnPdaScan.off = (eventName: string, handler: any) => {
  if (!allowedEvents.includes(eventName)) {
    throw new Error(`Event name ${eventName} is not a supported event.`);
  }

  let eventEmitter = new NativeEventEmitter(RnPdaScan);
  eventEmitter.removeListener(eventName, handler);
};

let triggerEnum: { always: any; change: any };

(function (triggerEnum) {
  triggerEnum['always'] = 'always';
  triggerEnum['change'] = 'change';
})((triggerEnum = exports.triggerEnum || (exports.triggerEnum = {})));

const useRnPdaScan = function (_a: { onError: any; onEvent: any; trigger?: any }) {
  let onError = _a.onError,
    onEvent = _a.onEvent,
    _b = _a.trigger,
    trigger = _b === void 0 ? triggerEnum.always : _b;
  let _c = useState(''),
    code = _c[0],
    setCode = _c[1];
  let _d = useState(undefined),
    error = _d[0],
    setError = _d[1];

  useEffect(
    function () {
      let eventEmitter = new NativeEventEmitter(RnPdaScan);
      let eventHandle = eventEmitter.addListener('onEvent', function (event: { code: any }) {
        if (trigger === triggerEnum.always) {
          setCode(event.code);
          onEvent && onEvent(event.code);
        }
        if (trigger === triggerEnum.change && event.code != code) {
          setCode(event.code);
          onEvent && onEvent(event.code);
        }
      });
      return function () {
        eventHandle.remove();
      };
    },
    [onEvent, RnPdaScan]
  );

  useEffect(
    function () {
      let eventEmitter = new NativeEventEmitter(RnPdaScan);
      let eventHandle = eventEmitter.addListener('onError', function (event: any) {
        setError(event);
        onError && onError(event);
      });
      return function () {
        eventHandle.remove();
      };
    },
    [onError, RnPdaScan]
  );

  return {
    code: code,
    error: error,
  };
};

export default useRnPdaScan;
