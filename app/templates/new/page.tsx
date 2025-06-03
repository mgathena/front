"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { ArrowLeft, Plus, Save, Send } from 'lucide-react'

type Question = {
  id: string
  type: 'rating' | 'category'
  question: string
  options?: string[]
  scale?: number
}

export default function NewTemplatePage() {
  const [templateName, setTemplateName] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [showNameInput, setShowNameInput] = useState(true)
  const router = useRouter()

  const handleBack = () => {
    if (showNameInput) {
      router.back()
    } else {
      setShowNameInput(true)
    }
  }

  const handleNext = () => {
    if (templateName.trim()) {
      setShowNameInput(false)
    }
  }

  const addQuestion = (type: 'rating' | 'category') => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: '',
      ...(type === 'category' ? { options: [''] } : { scale: 5 })
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, data: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...data } : q
    ))
  }

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            options: [...(q.options || []), ''] 
          } 
        : q
    ))
  }

  const updateOption = (questionId: string, index: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options) {
        const newOptions = [...q.options]
        newOptions[index] = value
        return { ...q, options: newOptions }
      }
      return q
    }))
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const saveDraft = () => {
    // TODO: Implement save draft functionality
    console.log('Saving draft:', { templateName, questions })
  }

  const publishTemplate = () => {
    // TODO: Implement publish functionality
    console.log('Publishing template:', { templateName, questions })
  }

  if (showNameInput) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Create New Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="templateName" className="text-sm font-medium text-gray-700">
                  Template Name
                </label>
                <Input
                  id="templateName"
                  placeholder="Enter template name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="max-w-md"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={!templateName.trim()}
                  className="px-6"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Create Template Form</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={saveDraft}
          >
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Template Name</label>
            <div className="flex items-center gap-2">
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {questions.map((question, index) => (
              <Card key={question.id} className="border border-gray-200">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">
                      {question.type === 'rating' ? 'Rating Question' : 'Category Question'} {index + 1}
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-600"
                      onClick={() => removeQuestion(question.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Question</label>
                    <Input
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                      placeholder="Enter your question"
                    />
                  </div>
                  
                  {question.type === 'rating' ? (
                    <div className="space-y-2">
                      <label className="text-sm text-gray-600">Rating Scale (1-10)</label>
                      <select 
                        value={question.scale}
                        onChange={(e) => updateQuestion(question.id, { scale: parseInt(e.target.value) })}
                        className="w-full p-2 border rounded-md"
                      >
                        {[5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-600">Options</label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-700 text-sm"
                          onClick={() => addOption(question.id)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Option
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {question.options?.map((option, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Input
                              value={option}
                              onChange={(e) => updateOption(question.id, i, e.target.value)}
                              placeholder={`Option ${i + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Question Buttons */}
          <div className="flex gap-4 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 gap-2"
              onClick={() => addQuestion('rating')}
            >
              <Plus className="w-4 h-4" />
              Add Rating Question
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 gap-2"
              onClick={() => addQuestion('category')}
            >
              <Plus className="w-4 h-4" />
              Add Category Question
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end p-4 border-t">
          <Button 
            onClick={publishTemplate}
            className="gap-2"
            disabled={questions.length === 0 || questions.some(q => 
              !q.question || 
              (q.type === 'category' && (!q.options || q.options.some(opt => !opt.trim())))
            )}
          >
            <Send className="w-4 h-4" />
            Publish
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
