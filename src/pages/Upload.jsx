import { useState, useRef } from 'react'

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [analysisError, setAnalysisError] = useState(null)
  const [analysisStats, setAnalysisStats] = useState(null)
  const fileInputRef = useRef(null)

  const API_BASE_URL = 'http://localhost:3001/api'

  const handleFileSelect = async (file) => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
      setFeedback(null)
      setAnalysisError(null)
      setAnalysisStats(null)
      await analyzeThesis(file)
    } else {
      alert('Please select a PDF file')
    }
  }

  const analyzeThesis = async (file) => {
    setIsAnalyzing(true)
    
    try {
      const formData = new FormData()
      formData.append('thesis', file)

      console.log('🚀 Sending file to backend:', file.name)

      const response = await fetch(`${API_BASE_URL}/upload-thesis`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('📡 Received response from backend:', result)

      // Force check for the analysis structure
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response format: not an object')
      }

      if (!result.analysis) {
        console.error('❌ Missing analysis object in response:', result)
        throw new Error('Invalid response format: missing analysis data')
      }

      console.log('🔍 Analysis object found:', result.analysis)

      // Parse the analysis results into organized feedback sections
      const feedbackItems = []
      
      // Add overall summary as hero section
      if (result.analysis.summary) {
        feedbackItems.push({
          type: 'summary',
          title: 'Overall Assessment',
          message: result.analysis.summary,
          icon: '📋',
          section: 'Summary'
        })
        console.log('✅ Added summary to feedback:', result.analysis.summary)
      }

      // Process detailed analysis items
      if (result.analysis.detailedAnalysis && Array.isArray(result.analysis.detailedAnalysis)) {
        result.analysis.detailedAnalysis.forEach((analysis, index) => {
          let type = 'success'
          let icon = '✅'
          
          if (analysis.includes('error') || analysis.includes('Error') || analysis.includes('incorrect')) {
            type = 'error'
            icon = '❌'
          } else if (analysis.includes('warning') || analysis.includes('improve') || analysis.includes('consider')) {
            type = 'warning'
            icon = '⚠️'
          } else if (analysis.includes('Backend') || analysis.includes('connection') || analysis.includes('server')) {
            type = 'info'
            icon = '🔗'
          }

          feedbackItems.push({
            type: type,
            title: `Analysis Point ${index + 1}`,
            message: analysis,
            icon: icon,
            section: 'Detailed Analysis'
          })
        })
        console.log(`✅ Added ${result.analysis.detailedAnalysis.length} detailed analysis items`)
      }

      // Add recommendations as separate section
      if (result.recommendations && Array.isArray(result.recommendations)) {
        result.recommendations.forEach((rec, index) => {
          feedbackItems.push({
            type: 'recommendation',
            title: `Recommendation ${index + 1}`,
            message: rec,
            icon: '💡',
            section: 'Next Steps'
          })
        })
        console.log(`✅ Added ${result.recommendations.length} recommendations`)
      }

      console.log('🎯 Total feedback items created:', feedbackItems.length)
      console.log('📋 Feedback items structure:', feedbackItems)

      // Ensure we have feedback items before setting state
      if (feedbackItems.length === 0) {
        throw new Error('No feedback items were created from the response')
      }

      setFeedback(feedbackItems)
      setAnalysisStats({
        filename: result.filename || file.name,
        fileSize: result.fileSize || file.size,
        wordCount: result.analysis?.statistics?.wordCount || 0,
        pageCount: result.analysis?.statistics?.pageCount || 0,
        chunksAnalyzed: result.chunksAnalyzed || 0,
        totalChunks: result.totalChunks || 0,
        analysisDate: result.analysis?.statistics?.analysisDate || new Date().toISOString()
      })

      console.log('✅ Analysis processing complete, UI should update now')
      console.log('✅ Feedback state set to:', feedbackItems)

    } catch (error) {
      console.error('❌ Analysis error:', error)
      setAnalysisError(error.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  const downloadReport = () => {
    if (!feedback || !analysisStats) return

    const report = {
      filename: analysisStats.filename,
      analysisDate: analysisStats.analysisDate,
      statistics: analysisStats,
      feedback: feedback
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `thesis-analysis-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="logo-container">
            <img 
              src="/logo.png" 
              alt="ThesisGate" 
              className="logo-image"
              onError={(e) => {
                // Fallback to text logo if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="logo" style={{display: 'none'}}>
              TG
            </div>
          </div>
          <h1 className="text-5xl gradient-text mb-6">Upload Your Thesis</h1>
          <p className="text-xl text-gray-600 mb-2">
            Get AI-powered feedback on your academic writing
          </p>
          <p className="text-lg text-gray-500">
            Upload your PDF and receive detailed analysis within minutes
          </p>
        </div>

        {/* Backend Status */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500">
            Backend API: <span className="text-blue-600 font-mono">http://localhost:3001</span>
          </p>
          <p className="text-xs text-gray-400">
            Make sure the backend server is running for real analysis
          </p>
        </div>

        {/* File Upload Area */}
        <div className="mb-12">
          <div
            className={`file-upload ${isDragOver ? 'drag-over' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept=".pdf"
              style={{ display: 'none' }}
            />
            
            <div className="file-icon">📄</div>
            
            {selectedFile ? (
              <div>
                <h3 className="text-2xl font-semibold mb-2">File Selected</h3>
                <p className="text-lg text-gray-600 mb-4">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-semibold mb-4">
                  Drag and drop your thesis PDF here
                </h3>
                <p className="text-lg text-gray-600 mb-4">
                  or click to browse files
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF files up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Section */}
        {isAnalyzing && (
          <div className="card text-center mb-12">
            <div className="mb-6">
              <div className="spinner" style={{
                width: '3rem',
                height: '3rem',
                margin: '0 auto 1rem',
                borderWidth: '4px'
              }}></div>
              <h3 className="text-2xl font-semibold mb-2">Analyzing Your Thesis</h3>
              <p className="text-lg text-gray-600">
                Our AI is carefully reviewing your document with OpenAI GPT-4...
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">✓ Document uploaded to server</div>
              <div className="text-sm text-gray-500">✓ PDF text extraction in progress</div>
              <div className="text-sm text-gray-500">⟳ Running comprehensive AI analysis...</div>
              <div className="text-sm text-gray-400">This may take 30-60 seconds</div>
            </div>
          </div>
        )}

        {/* Success notification */}
        {feedback && feedback.length > 0 && !isAnalyzing && (
          <div className="card bg-blue-50 border-blue-200 text-center mb-8">
            <h3 className="text-2xl font-bold text-blue-800 mb-2">
              🎉 SUCCESS: Analysis Complete!
            </h3>
            <p className="text-blue-600 text-lg mb-2">
              Your analysis results are now displayed below on this webpage.
            </p>
            <p className="text-blue-500 text-sm">
              📝 Note: This is NOT the raw JSON you see in browser dev tools - these are formatted, user-friendly results!
            </p>
          </div>
        )}

        {/* Error Display */}
        {analysisError && (
          <div className="card border-red-200 bg-red-50 mb-12">
            <div className="text-center">
              <div className="text-4xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">Analysis Failed</h3>
              <p className="text-red-600 mb-4">{analysisError}</p>
              <div className="text-sm text-red-500">
                <p>Common issues:</p>
                <ul className="list-disc list-inside mt-2 text-left max-w-md mx-auto">
                  <li>Backend server not running (start with <code>npm run dev</code> in server folder)</li>
                  <li>OpenAI API key not configured</li>
                  <li>PDF file contains only images (needs readable text)</li>
                  <li>File too large (&gt;10MB)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Statistics */}
        {analysisStats && (
          <div className="card bg-blue-50 border-blue-200 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-blue-800">Analysis Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Pages:</span>
                <span className="font-semibold ml-2">{analysisStats.pageCount}</span>
              </div>
              <div>
                <span className="text-gray-600">Words:</span>
                <span className="font-semibold ml-2">{analysisStats.wordCount?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Analyzed:</span>
                <span className="font-semibold ml-2">{analysisStats.chunksAnalyzed}/{analysisStats.totalChunks} sections</span>
              </div>
              <div>
                <span className="text-gray-600">Size:</span>
                <span className="font-semibold ml-2">{(analysisStats.fileSize / 1024 / 1024).toFixed(1)}MB</span>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        {!selectedFile && !feedback && (
          <div className="space-y-8">
            {/* Hero section */}
            <div className="card text-center mb-12">
              <div className="mb-8">
                <h1 className="text-5xl font-bold mb-4 gradient-text">
                  Analyze Your Thesis
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Upload your thesis document for comprehensive AI-powered analysis and feedback
                </p>
              </div>

              {/* Test Button for Debugging */}
              <div className="mb-6">
                <button 
                  onClick={() => {
                    console.log('🧪 Creating test feedback data...')
                    setFeedback([
                      {
                        section: 'Summary',
                        type: 'summary',
                        icon: '✅',
                        title: 'Test Overall Assessment',
                        message: 'This is a test message to verify the analysis display is working correctly.'
                      },
                      {
                        section: 'Detailed Analysis',
                        type: 'success',
                        icon: '🎯',
                        title: 'Test Analysis Point',
                        message: 'This is a test detailed analysis point to check formatting.'
                      },
                      {
                        section: 'Next Steps',
                        type: 'recommendation',
                        icon: '💡',
                        title: 'Test Recommendation',
                        message: 'This is a test recommendation to verify the next steps section.'
                      }
                    ])
                  }}
                  style={{
                    background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '16px'
                  }}
                >
                  🧪 Test Analysis Display
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Results */}
        {feedback && feedback.length > 0 && (
          <div className="space-y-8">
            {/* Debug info */}
            <div style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#166534',
                marginBottom: '8px'
              }}>
                🎯 DEBUG: Analysis Results Loaded Successfully!
              </h2>
              <p style={{
                color: '#16a34a',
                margin: 0
              }}>
                Found {feedback.length} analysis items. The formatted results are displayed below (not just JSON!).
              </p>
            </div>

            {/* Raw feedback debug */}
            <div style={{
              backgroundColor: '#fefce8',
              border: '1px solid #fde047',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#a16207',
                marginBottom: '8px'
              }}>🐛 Raw Feedback Debug</h3>
              <div style={{
                fontSize: '0.875rem',
                color: '#a16207',
                textAlign: 'left'
              }}>
                <p><strong>Total items:</strong> {feedback.length}</p>
                <p><strong>Items by section:</strong></p>
                <ul style={{ listStyle: 'disc', listStylePosition: 'inside', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {feedback.map((item, i) => (
                    <li key={i} style={{ wordBreak: 'break-words' }}>
                      <strong>Item {i + 1}:</strong> section="{item.section || 'UNDEFINED'}", type="{item.type || 'UNDEFINED'}", title="{item.title || 'UNDEFINED'}"
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: '16px' }}>
                  <p><strong>Section counts:</strong></p>
                  <ul style={{ listStyle: 'disc', listStylePosition: 'inside' }}>
                    <li>Summary: {feedback.filter(item => item.section === 'Summary').length}</li>
                    <li>Detailed Analysis: {feedback.filter(item => item.section === 'Detailed Analysis').length}</li>
                    <li>Next Steps: {feedback.filter(item => item.section === 'Next Steps').length}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '16px'
              }}>
                🎉 Analysis Complete!
              </h2>
              <p style={{
                fontSize: '1.25rem',
                color: '#4b5563',
                marginBottom: '8px'
              }}>
                Your thesis has been successfully analyzed
              </p>
              <p style={{
                fontSize: '1.125rem',
                color: '#6b7280',
                margin: 0
              }}>
                Review the comprehensive feedback below (this is NOT raw JSON - it's formatted analysis!)
              </p>
            </div>

            {/* Group feedback by section */}
            {['Summary', 'Detailed Analysis', 'Next Steps'].map(sectionName => {
              const sectionItems = feedback.filter(item => item.section === sectionName)
              console.log(`🔍 Section "${sectionName}": found ${sectionItems.length} items`, sectionItems)
              
              if (sectionItems.length === 0) {
                console.log(`⚠️ No items found for section "${sectionName}"`)
                return null
              }

              console.log(`✅ Rendering section "${sectionName}" with ${sectionItems.length} items`)

              return (
                <div key={sectionName} style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '24px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '24px'
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      marginRight: '16px'
                    }}>
                      {sectionName === 'Summary' && '📋'}
                      {sectionName === 'Detailed Analysis' && '🔍'}
                      {sectionName === 'Next Steps' && '💡'}
                    </div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      margin: 0
                    }}>{sectionName}</h3>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {sectionItems.map((item, index) => (
                      <div
                        key={`${sectionName}-${index}`}
                        style={{
                          backgroundColor: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '16px'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px'
                        }}>
                          <div style={{
                            fontSize: '1.25rem',
                            flexShrink: 0
                          }}>{item.icon}</div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{
                              fontSize: '1.125rem',
                              fontWeight: '600',
                              color: '#374151',
                              margin: '0 0 8px 0'
                            }}>{item.title}</h4>
                            <div style={{
                              fontSize: '1rem',
                              lineHeight: '1.5',
                              color: '#4b5563'
                            }}>
                              {item.message}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Action Buttons */}
            <div className="card text-center">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">What's Next?</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="btn btn-large" onClick={downloadReport}>
                    📄 Download Full Report
                  </button>
                  <button 
                    className="btn btn-outline" 
                    onClick={() => {
                      setSelectedFile(null)
                      setFeedback(null)
                      setAnalysisStats(null)
                      setAnalysisError(null)
                    }}
                  >
                    📎 Analyze Another Document
                  </button>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>✨ Analysis powered by OpenAI GPT-4</p>
                  <p>🔒 Your document is processed securely and not stored</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Debug section - only shows if we have feedback but it's not displaying */}
        {feedback && feedback.length === 0 && (
          <div className="card bg-yellow-50 border-yellow-200 text-center">
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">🐛 Debug: Empty Feedback Array</h3>
            <p className="text-yellow-600">
              The analysis response was received but the feedback array is empty. Check console for details.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 