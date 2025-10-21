import { AppRouter } from '@/routes';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
      />
    </>
  );
}

export default App;
