

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import CameraScreen from './src/components/screens/CameraScreen';
import { DbProvider } from './src/context/DbContext';

function App() {

  return (
    <DbProvider>
      <SafeAreaProvider>
        <CameraScreen />
      </SafeAreaProvider>
    </DbProvider>
  );
}



export default App;
