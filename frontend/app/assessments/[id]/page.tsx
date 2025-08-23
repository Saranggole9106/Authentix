'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Award } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Confetti from 'react-confetti'

interface Question {
  _id: string
  questionText: string
  questionType: 'multiple-choice' | 'coding' | 'essay'
  options?: { text: string }[]
  points: number
  difficulty: string
}

interface Assessment {
  _id: string
  skillName: string
  title: string
  description: string
  skillLevel: string
  duration: number
  passingScore: number
  totalPoints: number
  questions: Question[]
}

const AssessmentPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, user, token } = useAuth()
  const assessmentId = params.id as string

  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: any }>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/assessments')
      return
    }
    fetchAssessment()
  }, [assessmentId, isAuthenticated])

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && assessment && !isCompleted) {
      handleSubmit()
    }
  }, [timeLeft, isCompleted, assessment])

  const fetchAssessment = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/assessments/${assessmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const assessmentData = response.data.data.assessment
      setAssessment(assessmentData)
      setTimeLeft(assessmentData.duration * 60) // Convert minutes to seconds
    } catch (error) {
      console.error('Error fetching assessment:', error)
      toast.error('Failed to load assessment')
      router.push('/assessments')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNext = () => {
    if (currentQuestion < (assessment?.questions.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!assessment) return

    setIsSubmitting(true)
    try {
      const submissionData = {
        assessmentId: assessment._id,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer,
          timeSpent: 30 // Placeholder
        })),
        timeSpent: (assessment.duration * 60) - timeLeft
      }

      const response = await axios.post(`${API_BASE_URL}/assessments/submit`, submissionData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const result = response.data.data.submission
      setResults(result)
      setIsCompleted(true)

      if (result.passed) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
        toast.success('Congratulations! You passed the assessment!')
      } else {
        toast.error('Assessment not passed. Keep practicing!')
      }
    } catch (error) {
      console.error('Error submitting assessment:', error)
      toast.error('Failed to submit assessment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    if (!assessment) return 0
    return ((currentQuestion + 1) / assessment.questions.length) * 100
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assessment...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="card p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Assessment Not Found</h2>
            <p className="text-gray-600 mb-4">The assessment you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/assessments')}
              className="btn-primary"
            >
              Back to Assessments
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isCompleted && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Header />
        {showConfetti && <Confetti />}
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            className="card p-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              results.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {results.passed ? (
                <CheckCircle className="w-10 h-10 text-green-600" />
              ) : (
                <AlertCircle className="w-10 h-10 text-red-600" />
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {results.passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              {results.passed 
                ? 'You have successfully passed the assessment!' 
                : 'You didn\'t pass this time, but don\'t give up!'}
            </p>

            {/* Results Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {results.totalScore}%
                </div>
                <div className="text-gray-600">Final Score</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {results.pointsEarned}/{results.totalPoints}
                </div>
                <div className="text-gray-600">Points Earned</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {assessment.passingScore}%
                </div>
                <div className="text-gray-600">Required Score</div>
              </div>
            </div>

            {/* AI Feedback */}
            {results.aiEvaluation && (
              <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-blue-900 mb-4">AI Evaluation</h3>
                
                {results.aiEvaluation.strengths?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-green-800 mb-2">Strengths:</h4>
                    <ul className="list-disc list-inside text-green-700 space-y-1">
                      {results.aiEvaluation.strengths.map((strength: string, index: number) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.aiEvaluation.weaknesses?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-red-800 mb-2">Areas for Improvement:</h4>
                    <ul className="list-disc list-inside text-red-700 space-y-1">
                      {results.aiEvaluation.weaknesses.map((weakness: string, index: number) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.aiEvaluation.recommendations?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-blue-800 mb-2">Recommendations:</h4>
                    <ul className="list-disc list-inside text-blue-700 space-y-1">
                      {results.aiEvaluation.recommendations.map((rec: string, index: number) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.aiEvaluation.overallFeedback && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Overall Feedback:</h4>
                    <p className="text-gray-700">{results.aiEvaluation.overallFeedback}</p>
                  </div>
                )}
              </div>
            )}

            {/* Badge Eligibility */}
            {results.badgeEligible && (
              <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg p-6 text-white mb-8">
                <Award className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Badge Eligible!</h3>
                <p className="opacity-90">
                  You're eligible to receive a Soulbound Token badge for this skill. 
                  It will be minted to your wallet shortly.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-primary"
              >
                View Dashboard
              </button>
              <button
                onClick={() => router.push('/assessments')}
                className="btn-secondary"
              >
                Take Another Assessment
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  const currentQ = assessment.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
              <p className="text-gray-600">{assessment.skillName} - {assessment.skillLevel}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-red-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {assessment.questions.length}</span>
            <span>{Math.round(getProgressPercentage())}% Complete</span>
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            className="card p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="badge bg-blue-100 text-blue-800">
                  {currentQ.difficulty} • {currentQ.points} points
                </span>
                <span className="text-sm text-gray-500">
                  {currentQ.questionType.replace('-', ' ')}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentQ.questionText}
              </h2>
            </div>

            {/* Answer Input */}
            <div className="mb-8">
              {currentQ.questionType === 'multiple-choice' && currentQ.options && (
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        answers[currentQ._id] === option.text
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQ._id}`}
                        value={option.text}
                        checked={answers[currentQ._id] === option.text}
                        onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
                        className="mr-3 text-blue-600"
                      />
                      <span className="text-gray-900 font-medium">{option.text}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQ.questionType === 'coding' && (
                <textarea
                  value={answers[currentQ._id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
                  placeholder="Write your code here..."
                  className="w-full h-48 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-900 text-green-400 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}

              {currentQ.questionType === 'essay' && (
                <textarea
                  value={answers[currentQ._id] || ''}
                  onChange={(e) => handleAnswerChange(currentQ._id, e.target.value)}
                  placeholder="Write your answer here..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentQuestion === assessment.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Submit Assessment</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="btn-primary flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AssessmentPage
