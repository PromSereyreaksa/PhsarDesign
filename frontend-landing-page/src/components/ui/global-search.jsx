"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, User, Users, X, Loader2 } from "lucide-react"
import { Input } from "./input"
import { Button } from "./button"
import { Card, CardContent } from "./card"
import { Badge } from "./badge"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { artistsAPI, clientsAPI } from "../../services/api"

export function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState({ artists: [], clients: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) {
      setQuery("")
      setResults({ artists: [], clients: [] })
      setError(null)
    }
  }, [isOpen])

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query.trim())
      } else {
        setResults({ artists: [], clients: [] })
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const performSearch = async (searchQuery) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const [artistsResponse, clientsResponse] = await Promise.allSettled([
        artistsAPI.search({ search: searchQuery, limit: 5 }),
        clientsAPI.getByName(searchQuery)
      ])

      const artists = artistsResponse.status === 'fulfilled' 
        ? artistsResponse.value.data.artists || artistsResponse.value.data || []
        : []
        
      const clients = clientsResponse.status === 'fulfilled'
        ? clientsResponse.value.data.clients || clientsResponse.value.data || []
        : []

      setResults({ artists, clients })
    } catch (error) {
      console.error('Search error:', error)
      setError('Failed to search. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResultClick = (type, item) => {
    const slug = item.slug || generateSlug(item.name)
    if (type === 'artist') {
      navigate(`/artist/${slug}`)
    } else if (type === 'client') {
      navigate(`/client/${slug}`)
    }
    onClose()
  }

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-20">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center p-4 border-b border-white/10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for artists or clients..."
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10 pr-4"
              autoFocus
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="ml-2 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search Results */}
        <div className="p-4 overflow-y-auto max-h-96">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {query.trim().length < 2 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Type at least 2 characters to search</p>
            </div>
          )}

          {query.trim().length >= 2 && !isLoading && results.artists.length === 0 && results.clients.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No results found for "{query}"</p>
              <p className="text-gray-500 text-sm mt-1">Try different keywords or check spelling</p>
            </div>
          )}

          {/* Artists Results */}
          {results.artists.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-medium mb-3 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Artists ({results.artists.length})
              </h3>
              <div className="space-y-2">
                {results.artists.map((artist) => (
                  <Card
                    key={artist.artistId || artist.id}
                    className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/10 hover:border-[#A95BAB]/30 transition-colors cursor-pointer"
                    onClick={() => handleResultClick('artist', artist)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={artist.avatarUrl} alt={artist.name} />
                          <AvatarFallback className="bg-[#A95BAB]/20 text-[#A95BAB]">
                            {artist.name?.charAt(0) || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{artist.name}</h4>
                          <p className="text-gray-400 text-sm">{artist.bio || 'Artist'}</p>
                          {artist.skills && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {artist.skills.split(',').slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="outline" className="border-white/20 text-gray-300 text-xs">
                                  {skill.trim()}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Artist
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Clients Results */}
          {results.clients.length > 0 && (
            <div>
              <h3 className="text-white font-medium mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Clients ({results.clients.length})
              </h3>
              <div className="space-y-2">
                {results.clients.map((client) => (
                  <Card
                    key={client.clientId || client.id}
                    className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/10 hover:border-[#A95BAB]/30 transition-colors cursor-pointer"
                    onClick={() => handleResultClick('client', client)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={client.avatarUrl} alt={client.name} />
                          <AvatarFallback className="bg-blue-500/20 text-blue-400">
                            {client.name?.charAt(0) || 'C'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{client.name}</h4>
                          <p className="text-gray-400 text-sm">
                            {client.organization || 'Independent Client'}
                          </p>
                          {client.location && (
                            <p className="text-gray-500 text-xs">{client.location}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            Client
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-3">
          <p className="text-gray-500 text-xs text-center">
            Press <kbd className="bg-white/10 px-1 rounded">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  )
}