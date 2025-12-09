import './App.css'
// Import React's useState hook for managing component state
import { useState } from 'react'
// Import API functions and types for hero operations
import { createHero, listHeroes, deleteHero } from './api/hero'
import type { HeroPublic } from './client'

/**
 * Main App component that provides a hero management interface.
 * Features:
 * - Left panel: Form to create new heroes
 * - Right panel: List view of all heroes
 */
function App() {
  // Form state: individual input fields for hero creation
  const [name, setName] = useState('')
  const [age, setAge] = useState<string>('')
  const [secretName, setSecretName] = useState('')

  const [heroId, setHeroId] = useState('')
  
  // Data state: array of heroes retrieved from the backend
  const [heroes, setHeroes] = useState<HeroPublic[]>([])
  
  // UI state: feedback and loading indicators
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  /**
   * Handles hero creation form submission.
   * Validates inputs, sends create request, and refreshes the hero list.
   * 
   * @param e - Form submission event
   */
  async function handleCreate(e: React.FormEvent) {
    // Prevent default form submission behavior (page reload)
    e.preventDefault()
    
    // Clear any previous messages
    setError(null); setSuccessMsg(null)
    
    // Validate required fields
    if (!name.trim() || !secretName.trim()) {
      setError('Name and Secret Name are required.')
      return
    }
    
    setLoading(true)
    
    try {
      // Send create request with trimmed values
      const hero = await createHero({
        name: name.trim(),
        secret_name: secretName.trim(),
        age: age ? Number(age) : null,  // Convert age to number or null if empty
      })

      setSuccessMsg(`Created hero #${hero.id}`)
      
      // Clear form inputs
      setName(''); setAge(''); setSecretName('')
      
      const list = await listHeroes();
      setHeroes(list)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handles loading all heroes from the backend.
   * Fetches the complete list and updates the UI.
   */
  async function handleLoad() {
    setError(null); setSuccessMsg(null)
    
    setLoading(true)
    
    try {
      // Fetch all heroes from the API
      const list = await listHeroes()
      setHeroes(list)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(e: React.FormEvent) {
    // Prevent default form submission behavior (page reload)
    e.preventDefault()
    
    // Clear any previous messages
    setError(null); setSuccessMsg(null)

    setLoading(true)
    
    // Validate required fields
    if (!heroId.trim()) {
      setError('Hero ID is required.')
      return
    }
    
    setLoading(true)
    
    try {
      // Send create request with trimmed values
      await deleteHero(Number(heroId))

      setSuccessMsg(`Deleted hero #${heroId}`)
      
      // Clear form inputs
      setHeroId('')
      
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="hero-admin-container">
      <h1 className="hero-admin-title">Hero Admin</h1>
    
      <div className="hero-admin-layout">
        
        {/* LEFT PANEL: Hero Creation Form */}
        <div className="hero-create-section">
          <h2>Create hero</h2>
          <form onSubmit={handleCreate} className="hero-form">

            <label>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Hero name" />
            </label>
            
            <label>
              Age
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
            </label>
            
            <label>
              Secret Name
              <input value={secretName} onChange={(e) => setSecretName(e.target.value)} placeholder="Secret identity" />
            </label>
            
            <button type="submit" disabled={loading}>Create Hero</button>
          </form>
         
          
          {/* Display error message if there was a problem creating the hero */}
          {error && <p className="hero-error">{error}</p>}
          
          {/* Display success message after successfully creating a hero */}
          {successMsg && <p className="hero-success">{successMsg}</p>}
        </div>

        <div>
          <h2>Delete hero</h2>
          <form onSubmit={handleDelete} className="hero-form">

            <label>
              Hero ID
              <input value={heroId} onChange={(e) => setHeroId(e.target.value)} placeholder="Hero ID" />
            </label>
            
            <button type="submit" disabled={loading}>Delete Hero</button>
          </form>
        </div>

        {/* RIGHT PANEL: Hero List */}
        <div className="hero-list-section">
          <h2>Heroes</h2>
          
          {/* Load button and loading indicator */}
          <div className="hero-load-section">
            <button onClick={handleLoad} disabled={loading}>Load All Heroes</button>
            {loading && <span className="hero-loading-text">Loading...</span>}
          </div>
          
          {/* List of heroes */}
          <ul className="hero-list">
            {heroes.map(h => (
              <li key={h.id} className="hero-list-item">
                <strong>{h.name}</strong>
                <small>#{h.id}</small>
                {h.age !== null && <div>Age: {h.age}</div>}
              </li>
            ))}
            
            {/* Show message when no heroes are loaded */}
            {heroes.length === 0 && <li className="hero-list-empty">No heroes loaded.</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
