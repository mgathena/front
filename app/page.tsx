"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  fetchAllSurveys,
  fetchAllTemplates,
  fetchCompletedSurveys,
  fetchPublishedTemplates,
  fetchSurveyStats,
  fetchTemplateStats,
  Survey,
  SurveyStats,
  Template,
  TemplateStats
} from "@/lib/api"
import {
  BarChart3,
  FileText,
  Home,
  Info,
  LayoutTemplate,
  Plus,
  Search,
  TrendingDown,
  TrendingUp
} from "lucide-react"
import { useEffect, useState } from "react"

const getSurveyMetrics = (stats: SurveyStats) => [
  {
    title: "Total Surveys",
    value: stats.Total_Surveys.toString(),
    change: `${stats.Percent_Surveys}%`,
    period: "vs last month",
    trend: parseFloat(stats.Percent_Surveys) >= 0 ? "up" : "down",
  },
  {
    title: "Active Surveys",
    value: stats.Active.toString(),
    change: `${stats.Percent_Active}%`,
    period: "vs last month",
    trend: parseFloat(stats.Percent_Active) >= 0 ? "up" : "down",
  },
  {
    title: "Completed Surveys",
    value: stats.Completed.toString(),
    change: `${stats.Percent_Completed}%`,
    period: "vs last month",
    trend: parseFloat(stats.Percent_Completed) >= 0 ? "up" : "down",
  },
]

const getTemplateMetrics = (stats: TemplateStats) => [
  {
    title: "Total Templates",
    value: stats.Total_Templates.toString(),
    change: `${stats.Percent_Templates}%`,
    period: "vs last month",
    trend: parseFloat(stats.Percent_Templates) >= 0 ? "up" : "down",
  },
  {
    title: "Drafts",
    value: stats.Drafts.toString(),
    change: `${stats.Percent_Drafts}%`,
    period: "vs last month",
    trend: parseFloat(stats.Percent_Drafts) >= 0 ? "up" : "down",
  },
  {
    title: "Published",
    value: stats.Published.toString(),
    change: `${stats.Percent_Published}%`,
    period: "vs last month",
    trend: parseFloat(stats.Percent_Published) >= 0 ? "up" : "down",
  },
]

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<'surveys' | 'templates'>('surveys')
  const [surveyType, setSurveyType] = useState<'all' | 'completed'>('all')
  const [templateType, setTemplateType] = useState<'all' | 'published'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [surveyMetrics, setSurveyMetrics] = useState<ReturnType<typeof getSurveyMetrics>>([])
  const [templateMetrics, setTemplateMetrics] = useState<ReturnType<typeof getTemplateMetrics>>([])
  const [activeAccordion, setActiveAccordion] = useState<string>('surveys')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        if (activeSection === 'surveys') {
          const [surveysData, statsData] = await Promise.all([
            surveyType === 'all' ? fetchAllSurveys() : fetchCompletedSurveys(),
            fetchSurveyStats()
          ])
          setSurveys(surveysData)
          setSurveyMetrics(getSurveyMetrics(statsData))
        } else {
          const [templatesData, templateStats] = await Promise.all([
            templateType === 'all' ? fetchAllTemplates() : fetchPublishedTemplates(),
            fetchTemplateStats()
          ])
          setTemplates(templatesData)
          setTemplateMetrics(getTemplateMetrics(templateStats))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [activeSection, surveyType, templateType])

  const renderTemplatesTable = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">
              {templateType === 'all' ? 'All Templates' : 'Published Templates'}
            </CardTitle>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search templates"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Creation Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : templates.length > 0 ? (
              templates
                .filter(template => 
                  searchTerm === '' || 
                  template.TemplateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  template.TemplateId.toString().includes(searchTerm)
                )
                .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                .map((template) => (
                  <TableRow key={template.TemplateId}>
                    <TableCell className="font-medium">{template.TemplateId}</TableCell>
                    <TableCell className="text-gray-600">{template.TemplateName}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={template.Status === 'Published' ? 'default' : 'secondary'}
                        className={template.Status === 'Published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'}
                      >
                        {template.Status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">{template.CreationDate}</TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  {templateType === 'all' 
                    ? 'No templates found. Create your first template to get started.' 
                    : 'No published templates found.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Rows per page</span>
            <select 
              className="border border-gray-300 rounded px-2 py-1 bg-white"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
            >
              {[5, 10, 20].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: Math.ceil(templates.length / rowsPerPage) }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink 
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(templates.length / rowsPerPage), p + 1))}
                  className={currentPage >= Math.ceil(templates.length / rowsPerPage) ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )

  const renderSurveysTable = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">Active Surveys</CardTitle>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search survey"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Launch Date</TableHead>
              <TableHead>Url</TableHead>
              <TableHead>BioData</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : surveys.length > 0 ? (
              surveys
                .filter(survey => 
                  searchTerm === '' || 
                  survey.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  survey.SurveyId.toString().includes(searchTerm)
                )
                .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                .map((survey) => (
                  <TableRow key={survey.SurveyId}>
                    <TableCell className="font-medium">{survey.SurveyId}</TableCell>
                    <TableCell className="text-gray-600">{survey.Name}</TableCell>
                    <TableCell className="text-gray-600">{survey.LaunchDate}</TableCell>
                    <TableCell>
                      <a href={survey.URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        View Survey
                      </a>
                    </TableCell>
                    <TableCell className="text-gray-600">{survey.Biodata || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={survey.Status === 'Completed' ? 'default' : 'secondary'}
                        className={survey.Status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                      >
                        {survey.Status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  {surveyType === 'all' 
                    ? 'No surveys found. Create your first survey to get started.' 
                    : 'No completed surveys found.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Rows per page</span>
            <select 
              className="border border-gray-300 rounded px-2 py-1 bg-white"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
            >
              {[5, 10, 20].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: Math.ceil(surveys.length / rowsPerPage) }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink 
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(surveys.length / rowsPerPage), p + 1))}
                  className={currentPage >= Math.ceil(surveys.length / rowsPerPage) ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-gray-900">SurvAI</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeSection === 'surveys' ? 'bg-gray-100' : ''}`}
            onClick={() => setActiveSection('surveys')}
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          
          {/* Surveys Section */}
          <Accordion 
            type="single" 
            collapsible 
            className="w-full"
            value={activeAccordion}
            onValueChange={setActiveAccordion}
          >
            <AccordionItem 
              value="surveys" 
              className="border-0"
              onClick={() => setActiveAccordion(activeAccordion === 'surveys' ? '' : 'surveys')}
            >
              <AccordionTrigger className="py-2 px-3 hover:no-underline hover:bg-gray-100 rounded-md [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center">
                  <FileText className="mr-3 h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm font-medium">Surveys</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="space-y-1 pl-7">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start h-8 text-sm ${surveyType === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveSection('surveys')
                      setSurveyType('all')
                    }}
                  >
                    <span>All Surveys</span>
                    {surveyType === 'all' && (
                      <svg className="ml-auto h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start h-8 text-sm ${surveyType === 'completed' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveSection('surveys')
                      setSurveyType('completed')
                    }}
                  >
                    <span>Completed Surveys</span>
                    {surveyType === 'completed' && (
                      <svg className="ml-auto h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          {/* Templates Section */}
          <Accordion 
            type="single" 
            collapsible 
            className="w-full"
            value={activeAccordion}
            onValueChange={setActiveAccordion}
          >
            <AccordionItem 
              value="templates" 
              className="border-0"
              onClick={() => setActiveAccordion(activeAccordion === 'templates' ? '' : 'templates')}
            >
              <AccordionTrigger className="py-2 px-3 hover:no-underline hover:bg-gray-100 rounded-md [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center">
                  <LayoutTemplate className="mr-3 h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm font-medium">Templates</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="space-y-1 pl-7">
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start h-8 text-sm ${templateType === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveSection('templates')
                      setTemplateType('all')
                    }}
                  >
                    <span>All Templates</span>
                    {templateType === 'all' && (
                      <svg className="ml-auto h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className={`w-full justify-start h-8 text-sm ${templateType === 'published' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveSection('templates')
                      setTemplateType('published')
                    }}
                  >
                    <span>Published Templates</span>
                    {templateType === 'published' && (
                      <svg className="ml-auto h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <Button variant="ghost" className="w-full justify-start">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </nav>

        <div className="p-4">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => setActiveSection('templates')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              {activeSection === 'surveys' ? 'Surveys' : 'Templates'}
            </h2>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {activeSection === 'surveys' ? (
              surveyMetrics.map((metric, index) => (
                <Card key={`survey-${index}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {metric.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className="text-xs text-gray-500 flex items-center">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                      )}
                      {metric.change} {metric.period}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              templateMetrics.map((metric, index) => (
                <Card key={`template-${index}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {metric.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <p className="text-xs text-gray-500 flex items-center">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                      )}
                      {metric.change} {metric.period}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {activeSection === 'templates' ? renderTemplatesTable() : renderSurveysTable()}
        </main>
      </div>
    </div>
  )
}

export default Dashboard
