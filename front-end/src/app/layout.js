export const metadata = {
  title: 'TrailBlaze', // The title for the webpage
  description: 'Generated by TrailBlaze', // Description for SEO and metadata
}

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
