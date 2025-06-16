import { useNavigate } from 'react-router-dom'

export default function About() {
  const navigate = useNavigate()

  const features = [
    {
      icon: '🤖',
      title: 'Advanced AI Technology',
      description: 'Our cutting-edge AI algorithms analyze your thesis with the precision of experienced academic reviewers, providing insights that enhance your research quality.'
    },
    {
      icon: '📚',
      title: 'Academic Excellence',
      description: 'Built by academics, for academics. Our platform understands the nuances of academic writing and provides feedback tailored to scholarly standards.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Get comprehensive feedback on your thesis in minutes, not days. Our optimized AI processing ensures quick turnaround without compromising quality.'
    },
    {
      icon: '🎯',
      title: 'Precision Feedback',
      description: 'Receive detailed, actionable feedback on grammar, structure, clarity, methodology, and academic style with specific suggestions for improvement.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your research is protected with enterprise-grade security. We never store or share your academic work, ensuring complete confidentiality.'
    },
    {
      icon: '🌍',
      title: 'Global Impact',
      description: 'Supporting researchers and students worldwide in advancing human knowledge through better academic writing and clearer communication.'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Theses Analyzed' },
    { number: '500+', label: 'Universities' },
    { number: '50+', label: 'Countries' },
    { number: '98%', label: 'Satisfaction Rate' }
  ]

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Chief AI Officer',
      background: 'Former Stanford NLP researcher with 15+ years in academic AI',
      icon: '👩‍🔬'
    },
    {
      name: 'Prof. Michael Rodriguez',
      role: 'Academic Director',
      background: 'Published author of 200+ papers, former Oxford writing center director',
      icon: '👨‍🏫'
    },
    {
      name: 'Dr. Aisha Patel',
      role: 'Product Lead',
      background: 'PhD in Computer Science, passionate about making AI accessible',
      icon: '👩‍💻'
    }
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="logo-container">
            <img 
              src="/logo.png" 
              alt="ThesisGate" 
              className="logo-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="logo" style={{display: 'none'}}>
              TG
            </div>
          </div>
          <h1 className="text-5xl gradient-text mb-6">About ThesisGate</h1>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Empowering the next generation of researchers with AI-powered thesis proofreading 
            that elevates academic writing to new heights of clarity and excellence.
          </p>
          <div className="flex justify-center space-x-6 mt-8">
            <button 
              onClick={() => navigate('/')}
              className="nav-link"
            >
              ← Back to App
            </button>
          </div>
        </div>

        {/* Mission Section */}
        <div className="about-section mb-16">
          <h2 className="text-4xl font-bold gradient-text text-center mb-8">Our Mission</h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              At ThesisGate, we believe that groundbreaking research deserves exceptional presentation. 
              Our mission is to democratize access to high-quality academic writing feedback, 
              ensuring that brilliant ideas are communicated with the clarity and precision they deserve.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              We're bridging the gap between human expertise and AI efficiency, 
              making professional-grade thesis review accessible to researchers worldwide, 
              regardless of their institution's resources or geographic location.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-6 card"
              style={{ animation: `fadeIn 0.6s ease ${index * 0.1}s both` }}
            >
              <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold gradient-text text-center mb-12">Why Choose ThesisGate?</h2>
          <div className="feature-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card"
                style={{ animation: `slideInFromLeft 0.6s ease ${index * 0.1}s both` }}
              >
                <div className="feature-card-icon">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="about-section mb-16">
          <h2 className="text-4xl font-bold gradient-text text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-4">📤</div>
              <h3 className="text-xl font-bold mb-4">1. Upload Your Thesis</h3>
              <p className="text-gray-600">Simply drag and drop your PDF thesis document. Our system supports files up to 50MB with secure, encrypted upload.</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-4">2. AI Analysis</h3>
              <p className="text-gray-600">Our advanced AI examines every aspect of your thesis: grammar, structure, clarity, methodology, and academic style.</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-4">3. Detailed Feedback</h3>
              <p className="text-gray-600">Receive comprehensive, actionable feedback with specific suggestions to improve your thesis quality and impact.</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="about-section mb-16">
          <h2 className="text-4xl font-bold gradient-text text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="text-center card"
                style={{ animation: `fadeIn 0.6s ease ${index * 0.2}s both` }}
              >
                <div className="text-6xl mb-4">{member.icon}</div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-lg font-medium text-blue-600 mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.background}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <div className="about-section mb-16">
          <h2 className="text-4xl font-bold gradient-text text-center mb-8">Our Technology</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              ThesisGate is built on state-of-the-art natural language processing and machine learning technologies. 
              Our AI models are trained on millions of academic papers and have been fine-tuned by expert researchers 
              to understand the nuances of academic writing across multiple disciplines.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <h4 className="text-xl font-bold mb-3">🧠 Advanced NLP</h4>
                <p className="text-gray-600">Cutting-edge natural language processing that understands context, tone, and academic conventions.</p>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-3">⚙️ Continuous Learning</h4>
                <p className="text-gray-600">Our models continuously improve through feedback and new academic literature analysis.</p>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-3">🔐 Privacy First</h4>
                <p className="text-gray-600">End-to-end encryption ensures your research remains confidential and secure.</p>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-3">📈 Scalable Infrastructure</h4>
                <p className="text-gray-600">Cloud-native architecture that scales to meet global demand while maintaining performance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center card">
          <h2 className="text-3xl font-bold gradient-text mb-6">Ready to Elevate Your Research?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of researchers who have improved their academic writing with ThesisGate. 
            Experience the future of thesis proofreading today.
          </p>
          <div className="flex justify-center space-x-6">
            <button 
              onClick={() => navigate('/')}
              className="btn btn-large"
            >
              Get Started Now
            </button>
            <button 
              onClick={() => navigate('/upload')}
              className="nav-link"
            >
              Try Demo Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 