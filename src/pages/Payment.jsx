import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Payment() {
  const [selectedPlan, setSelectedPlan] = useState('individual')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const plans = [
    {
      id: 'individual',
      name: 'Individual',
      price: '$19',
      period: 'per thesis',
      features: [
        'AI-powered proofreading',
        'Grammar and clarity analysis', 
        'Structure feedback',
        'PDF download of feedback',
        'Standard processing time'
      ],
      popular: false,
      description: 'Perfect for students working on individual thesis projects'
    },
    {
      id: 'institutional',
      name: 'Institutional',
      price: '$199',
      period: 'per month',
      features: [
        'Everything in Individual',
        'Unlimited thesis submissions',
        'Priority processing',
        'Dedicated support team',
        'Advanced analytics dashboard',
        'Bulk upload capabilities'
      ],
      popular: true,
      description: 'Ideal for universities and research institutions'
    }
  ]

  const handleContinue = async () => {
    setIsLoading(true)
    
    // Mock payment processing
    setTimeout(() => {
      setIsLoading(false)
      navigate('/upload')
    }, 1500)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-6xl">
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
          <h1 className="text-5xl gradient-text mb-6">Choose Your Plan</h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-xl text-gray-600 mb-2">
              Select the perfect plan for your thesis proofreading needs
            </p>
            <p className="text-lg text-gray-500">
              Advanced AI technology to enhance your academic writing
            </p>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="plan-popular">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-5xl font-bold gradient-text">{plan.price}</span>
                  <span className="text-lg text-gray-500 ml-2">{plan.period}</span>
                </div>
              </div>

              <ul className="feature-list">
                {plan.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <div className="feature-icon"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={isLoading}
            className="btn btn-large"
            style={{ minWidth: '200px' }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="spinner"></div>
                Processing...
              </div>
            ) : (
              `Continue with ${plans.find(p => p.id === selectedPlan)?.name} Plan`
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 