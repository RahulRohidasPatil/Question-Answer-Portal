import Header from '../components/Header';
import '../styles/globals.css';
import ContextProvider from '../ContextProvider';

function MyApp({ Component, pageProps }) {
  return <ContextProvider>
    <Header />
    <Component {...pageProps} />
  </ContextProvider>
}

export default MyApp
