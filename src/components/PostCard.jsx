import React from 'react'
import appwriteService from "../appwrite/config"
import {Link} from 'react-router-dom'

function PostCard({$id, title, featuredImage ,userName}) {
    
  return (
    <Link to={`/post/${$id}`} className="group block">
      <article
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
        <div className="mb-4">
          <span
            className="
              inline-block px-3 py-1 mb-3
              text-xs font-medium uppercase tracking-wider
              bg-white text-black rounded-full
            "
          >
            {userName || 'Author'}
          </span>

          <h2
            className="
              text-xl font-bold text-white
              leading-snug line-clamp-2
              group-hover:text-gray-300
              transition-colors duration-200
            "
          >
            {title}
          </h2>
        </div>

        {/* Description (optional static for now) */}
        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          A thoughtfully written article designed for focused reading
          and meaningful ideas.
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span
            className="
              px-4 py-2 text-sm
              bg-white text-black rounded-lg
              transition-colors duration-200
              group-hover:bg-gray-200
            "
          >
            Read More
          </span>

          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Read</span>
          </div>
        </div>
      </article>
    </Link>
  )
}


export default PostCard