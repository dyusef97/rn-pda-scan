import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { RnPdaScan } from 'rn-pda-scan';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    RnPdaScan.on('onEvent', (event: any) => {
      console.log('Received data', event);
      setResult(event.code);
    });

    return RnPdaScan.off('onEvent');
  }, [RnPdaScan]);

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
