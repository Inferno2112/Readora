import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


function PostCard({ $id, title, featuredImage, $userName }) {

  return (
    <Link to={`/post/${$id}`} className="group block">
      <Card
        className="
          w-full h-full p-6 rounded-xl
          bg-black border border-zinc-800
          shadow-xl
          transition-all duration-300
          hover:scale-105 hover:border-white
        "
      >
        {/* Image */}
        <div className="relative overflow-hidden rounded-lg mb-6">
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="
              object-cover object-center
              w-full h-48
              transition-transform duration-300
              group-hover:scale-110
            "
          />
          <div
            className="
              absolute inset-0
              bg-gradient-to-t from-black/70 to-transparent
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
            "
          />
        </div>

        {/* Badge + Title */}

        <Badge
          className="
              w-fit
            "
        >
          {$userName || 'Author'}
        </Badge>

        <CardHeader>
          <h2 className="text-2xl font-semibold text-white line-clamp-1">
            {title}
          </h2>
        </CardHeader>


        {/* Description (optional static for now) */}
        <CardContent>
          <p className="text-sm text-zinc-400">
            Thoughtfully written content for focused reading.
          </p>
        </CardContent>

        {/* Footer */}

        <CardFooter className="flex justify-between">
          <span className="text-sm font-medium text-white">
            Read article →
          </span>
        </CardFooter>

      </Card>
    </Link>
  )
}


export default PostCard