import { VoteType } from "@prisma/client"

export type CachedPost = {
  id: stringtitle
  title: string
  authorUsername: string
  content: string
  currentVote: VoteType | null
  createdAt: Date
}