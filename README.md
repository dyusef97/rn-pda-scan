# rn-pda-scan

This package works with Phonemax and Zebra devices that have an integrated barcode scanner, like the Phonemax P1 Pro or Zebra TC-series. This package was fully tested with a Phonemax P1 Pro and Zebra TC20/TC21.

## Usage

To get events from the barcode scanner:

```js
import { RnPdaScan } from 'rn-pda-scan';

// ...

RnPdaScan.on('onEvent', (event) => {
  console.log('Received data', event);
});

RnPdaScan.on('onError', () => {
  console.log('Barcode read failed');
});
```

Using Hooks

```js
import useRnPdaScan from 'rn-pda-scan';

// ...

useRnPdaScan({
  onError: (e: any) => console.log('error', e),
  onEvent: (v: React.SetStateAction<string>) => {
    // console.log('%cApp.tsx line:10 v', 'color: #007acc;', v);
    setResult(v);
  },
});
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

## Inspiration

[react-native-honeywell-scanner](https://github.com/Volst/react-native-honeywell-scanner) & [react-native-pda-scan](https://github.com/XuJin186/react-native-pda-scan)
