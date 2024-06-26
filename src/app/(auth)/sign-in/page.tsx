import { cn } from '@/lib/utils'
import { FC } from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'
import SignIn from '@/components/SignIn'
import { ChevronLeftIcon } from 'lucide-react'

const page: FC= () => {
  return <div className='absolute inset-0'>
    <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
      <Link href='/' 
      className={cn(buttonVariants({variant: 'ghost'}), 
      'self-start -mt-20')}>
        <ChevronLeftIcon className='mr-2 h-4 w-4'/>Home
        </Link>
        <SignIn/>
    </div>y
  </div>
}

export default page
