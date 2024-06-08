"use client"

import { useCustomToast } from '@/hooks/use-custom-toast'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { CommentVoteRequest, PostVoteRequest } from '@/lib/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { VoteType, CommentVote } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { FC, useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'

interface CommentVotesProps {
    commentId: string
    initialVotesAmt: number
    initialVote?: Pick<CommentVote, 'type'> | null
}

const  CommentVotes: FC< CommentVotesProps> = ({
    commentId,
    initialVotesAmt,
    initialVote,
}) => {
  const { loginToast } = useCustomToast()
  const [VotesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)


  const {mutate: vote} = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType,
      }
      await axios.patch('/api/subreddit/post/comment/vote', payload)
    },
    onError:(err, voteType) =>{
      if(voteType==='UP') setVotesAmt((prev)=>prev-1)
      else setVotesAmt((prev)=>prev+1)

      //
      setCurrentVote(prevVote)

      if(err instanceof AxiosError){
        if(err.response?.status === 401){
          return loginToast()
        }
      }
      return toast({
        title: "something went wrong",
        description: "Your vote was not registered, please try again.",
        variant: 'destructive',
      })
    },
    onMutate: (type) =>{
      if(currentVote?.type === type){
        setCurrentVote(undefined)
        if(type === "UP") setVotesAmt((prev)=>prev-1)
        else if(type === "DOWN") setVotesAmt((prev)=>prev+1)
      }else{
        setCurrentVote({type})
        if(type==="UP") setVotesAmt((prev)=> prev + (currentVote ? 2:1))
        else if(type==="DOWN") setVotesAmt((prev)=> prev - (currentVote ? 2 : 1))
      }
    }
  })


  return <div className='flex gap-1'>
    <Button onClick={()=> vote('UP')} size='sm' variant='ghost' aria-label='upvote'>
      <ArrowBigUp className={cn('h-w w-5 text-zinc-700', {
        'text-emerald-500 fill-emerald-500': currentVote?.type === 'UP'
      })}/>
    </Button>

    <p className='text-center py-2 font-medium text-sm text-zinc-900'>
      {VotesAmt}
    </p>

    <Button onClick={()=> vote('DOWN')} size='sm' variant='ghost' aria-label='downvote'>
      <ArrowBigDown className={cn('h-w w-5 text-zinc-700', {
        'text-red-500 fill-red-500': currentVote?.type === 'DOWN'
      })}/>
    </Button>

  </div>

}

export default CommentVotes