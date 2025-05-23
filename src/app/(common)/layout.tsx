import React from 'react'
import Header from '@/components/layout/header'; // Import Header
import Footer from '@/components/layout/footer'; // Import Footer

const CommonLayout: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <div className='flex-grow flex flex-col min-h-screen overflow-y-auto'>
      <Header />
        <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  )
}

export default CommonLayout