

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import CameraScreen from './src/components/screens/CameraScreen';

function App() {

  return (
    <SafeAreaProvider>
      <CameraScreen />
    </SafeAreaProvider>
  );
}



export default App;
