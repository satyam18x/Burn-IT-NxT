import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GoogleProvider from '@/components/GoogleProvider';

export const metadata = {
  title: 'Burn IT Out Fitness',
  description: 'Personalized fitness programs designed for real women with real goals.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GoogleProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flexGrow: 1 }}>
              {children}
            </main>
            <Footer />
          </div>
        </GoogleProvider>
      </body>
    </html>
  );
}
