import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import useRnPdaScan from 'rn-pda-scan';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  useRnPdaScan({
    onError: (e: any) => console.log('error', e),
    onEvent: (v: React.SetStateAction<number | undefined>) => {
      // console.log('%cApp.tsx line:10 v', 'color: #007acc;', v);
      setResult(v);
    },
  });

  // React.useEffect(() => {
  //   RnPdaScan.on('onEvent', (event: any) => {
  //     console.log('Received data', event);
  //     setResult(event.code);
  //   });

  //   return RnPdaScan.off('onEvent');
  // }, [RnPdaScan]);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
