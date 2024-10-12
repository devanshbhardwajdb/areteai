// app/layout.js
import '@/styles/globals.css';
import ClientWrapper from '@/components/ClientWrapper';
import Footer from '@/components/Footer';
import { cookies } from 'next/headers'; // Import cookies from next/headers
import jwt from 'jsonwebtoken';
import { AuthProvider } from '@/context/AuthContext';


export const metadata = {
  title: "Arete AI",
  description: "Actualize your true potential.",
};

export default function RootLayout({ children }) {

  // Server-side: based on HTTP request cookie only
  // const cookieStore = cookies();
  // const tokenCookie = cookieStore.get('token'); // Get the token cookie

  // let decoded = null; // Initialize decoded to null

  // // Check if the token exists before verifying it
  // if (tokenCookie) {
  //   try {
  //     // Verify the token and decode it
  //     decoded = jwt.verify(tokenCookie.value, process.env.JWT_SECRET);
  //   } catch (err) {
  //     console.error("Token verification failed:", err);
  //     // If verification fails, decoded will remain null
  //   }
  // }

  // initial={{ decoded }}

  return (
    <html lang="en">
      <body className={`font-mont bg_main`}>
        <AuthProvider>
          <ClientWrapper >{children}</ClientWrapper> {/* Pass the token as initial data */}
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
