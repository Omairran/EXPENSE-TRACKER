import { useState, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import styles from './ImportData.module.css'

function ImportData() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { user } = useContext(AuthContext)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  // Day 19: Wire FastAPI service to push parsed & categorized rows into shared DB
  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setMessage('')
    
    const formData = new FormData()
    formData.append("file", file)
    if (user && user.user_id) {
      formData.append("user_id", user.user_id)
    }

    try {
      const response = await fetch('http://localhost:8001/parse-csv', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      if (response.ok) {
        setMessage(`Success: ${data.message}`)
      } else {
        setMessage(`Error: ${data.detail}`)
      }
    } catch (error) {
      setMessage(`Upload failed: ${error.message}`)
    } finally {
      setLoading(false)
      setFile(null)
    }
  }

  return (
    <div className="page-content">
      
      <div className={styles.uploadContainer}>
        <div className={styles.fileDropArea}>
          <p>Upload a CSV file with your bank transactions</p>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            className={styles.fileInput}
          />
        </div>
        
        {file && <p className={styles.selectedFile}>Selected: {file.name}</p>}
        
        <button 
          className="btn-primary" 
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? 'Processing...' : 'Upload and Auto-Categorize'}
        </button>

        {message && (
          <div className={`${styles.message} ${message.startsWith('Success') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImportData
