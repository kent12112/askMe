'use client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { User } from 'next-auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { userInfo } from 'os'
import { FC } from 'react'
import { DropdownMenuItem, DropdownMenuSeparator } from './ui/Dropdown-menu'
import UserAvatar from './UserAvatar'

interface UserAccountNavProps {
  user: Pick<User, 'name' | 'image' | 'email'>
}

const UserAccountNav: FC<UserAccountNavProps> = ({user}) => {
  return <DropdownMenu>
    <DropdownMenuTrigger>
      <UserAvatar 
      className="h-8 w-8"
      user={{
        name: user.name || null,
        image: user.image || null,
      }}
      />
    </DropdownMenuTrigger>
    <DropdownMenuContent className='bg-white' align='end'>
      <div className='flex items-center justify-start gap-2 p-2'>
        <div className='flex flex-col space-y-1 leading-none'>
          {user.name && <p className='font-medium'>{user.name}</p>}
          {user.email && <p className='w-[200px] truncate text-sm text-zinc-700'>{user.email}</p>}
        </div>
      </div>
      <DropdownMenuSeparator/>
      <DropdownMenuItem asChild>
        <Link href='/'>Feed</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href='/r/create'>create community</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href='/settings'>settings</Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator/>
      <DropdownMenuItem onSelect={(event)=>{
        event.preventDefault()
        signOut({
          callbackUrl: `${window.location.origin}/sign-in`,
        })
      }} className='cursor-pointer'>
        Sign Out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}

export default UserAccountNav