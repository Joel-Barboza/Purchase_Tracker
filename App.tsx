import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { DbProvider } from './src/context/DbContext';
import { NavigationContainer } from '@react-navigation/native';
import ImageProcessingStack from './src/routes/ImageProcessingStack';

function App() {

  return (
    <DbProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <ImageProcessingStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </DbProvider>
  );
}



export default App;
