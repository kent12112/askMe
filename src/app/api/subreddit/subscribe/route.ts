import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { Dna } from "lucide-react";
import { z } from "zod";

export async function POST(req: Request){
  try {
    const session = await getAuthSession()
    if(!session?.user){
      return new Response('unauthorized', {status: 401})
    }

    const body = await req.json()

    const {subredditId} = SubredditSubscriptionValidator.parse(body)

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId: subredditId, 
        userId: session.user.id
      }
    })

    if(subscriptionExists){
      return new Response('You are already subscribed to this subreddit.', {
        status: 400,
      })
    }

    await db.subscription.create({
      data: {
        subredditId,
        userId: session.user.id
      }
    })

    return new Response(subredditId)
  } catch (error) {
    if(error instanceof z.ZodError){
      return new Response(error.message, {status: 422})
  }
  return new Response("could not subscribe, please try again later", {
    status: 500,
  })
}
}