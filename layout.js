import './globals.css';

export const metadata = {
  title: 'Image → Video AI',
  description: 'Generate a short video from one image and a text prompt.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
