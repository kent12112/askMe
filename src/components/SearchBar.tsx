"use client"
import { useQuery } from '@tanstack/react-query'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandItem } from './ui/Command'
import axios from 'axios'
import { Prisma, Subreddit } from '@prisma/client'
import { usePathname, useRouter } from 'next/navigation'
import { Users } from 'lucide-react'
import debounce from 'lodash.debounce'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState<string>('')
  const { data: queryResults = [], refetch, isFetched, isFetching } = useQuery({
    queryFn: async () => {
      if (!input.trim()) return []
      const { data } = await axios.get(`/api/search?q=${input}`)
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType
      })[]
    },
    queryKey: ['search-query', input],
    enabled: false,
  })

  const request = debounce(() => {
    if (input.trim() !== '') {
      refetch()
    }
  }, 300)

  const debounceRequest = useCallback(() => {
    request()
  }, [request])

  const router = useRouter()
  const commandRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useOnClickOutside(commandRef, () => {
    setInput('')
  })

  useEffect(() => {
    setInput('')
  }, [pathname])

  return (
    <Command ref={commandRef} className='relative rounded-lg border max-w-lg z-50 overflow-visible'>
      <CommandInput
        value={input}
        onValueChange={(text) => {
          setInput(text)
          debounceRequest()
        }}
        className='outline-none border-none focus:border-none focus:outline-none ring-0'
        placeholder='Search communities...'
      />

      {input.length > 0 && (
        <CommandList className='absolute bg-white top-full inset-x-0 shadow rounded-b-md'>
          {isFetched && !isFetching && queryResults.length === 0 && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          {Array.isArray(queryResults) && queryResults.length > 0 && (
            <CommandGroup heading="Communities">
              {queryResults.map((subreddit) => (
                <CommandItem
                  onSelect={() => {
                    router.push(`/r/${subreddit.name}`)
                    router.refresh()
                  }}
                  key={subreddit.id}
                  value={subreddit.name}
                >
                  <Users className='mr-2 h-4 w-4' />
                  <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      )}
    </Command>
  )
}

export default SearchBar
