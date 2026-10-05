'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface ComparisonContextType {
  selectedSlugs: string[]
  addGame: (slug: string) => boolean
  removeGame: (slug: string) => void
  clearComparison: () => void
  isInComparison: (slug: string) => boolean
  isSelected: (slug: string) => boolean
  toggleGame: (slug: string) => void
  maxAllowed: number
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

const STORAGE_KEY = 'gamerank_compare_list'
const MAX_GAMES = 4

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([])
  const [initialized, setInitialized] = useState(false)

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setSelectedSlugs(parsed.slice(0, MAX_GAMES))
        }
      }
    } catch (e) {
      console.error('Failed to load comparison list:', e)
    } finally {
      setInitialized(true)
    }
  }, [])

  // Sync to localStorage
  useEffect(() => {
    if (!initialized) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedSlugs))
    } catch (e) {
      console.error('Failed to save comparison list:', e)
    }
  }, [selectedSlugs, initialized])

  const addGame = (slug: string): boolean => {
    const s = slug.toLowerCase().trim()
    if (selectedSlugs.includes(s)) return false
    if (selectedSlugs.length >= MAX_GAMES) return false

    setSelectedSlugs((prev) => [...prev, s])
    return true
  }

  const removeGame = (slug: string) => {
    const s = slug.toLowerCase().trim()
    setSelectedSlugs((prev) => prev.filter((item) => item !== s))
  }

  const clearComparison = () => {
    setSelectedSlugs([])
  }

  const toggleGame = (slug: string) => {
    const s = slug.toLowerCase().trim()
    if (selectedSlugs.includes(s)) {
      removeGame(s)
    } else {
      addGame(s)
    }
  }

  const isInComparison = (slug: string): boolean => {
    return selectedSlugs.includes(slug.toLowerCase().trim())
  }

  return (
    <ComparisonContext.Provider
      value={{
        selectedSlugs,
        addGame,
        removeGame,
        clearComparison,
        isInComparison,
        isSelected: isInComparison,
        toggleGame,
        maxAllowed: MAX_GAMES,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider')
  }
  return context
}
