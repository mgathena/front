"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchAllSurveys, fetchCompletedSurveys, Survey } from "@/lib/api"
import { BarChart3, ChevronDown, FileText, Home, Info, Plus, Search, TrendingDown, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

const metrics = [
  {
    title: "Created Templates",
    value: "254",
    change: "+20%",
    period: "vs last month",
    trend: "up",
  },
  {
    title: "Published Templates",
    value: "100",
    change: "-20%",
    period: "vs last month",
    trend: "down",
  },
  {
    title: "Active Surveys",
    value: "15",
    change: "-20%",
    period: "vs last day",
    trend: "down",
  },
  {
    title: "Completed Surveys",
    value: "10",
    change: "+20%",
    period: "vs last week",
    trend: "up",
  },
]

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [surveyType, setSurveyType] = useState<'all' | 'completed'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setIsLoading(true)
        const data = surveyType === 'all' 
          ? await fetchAllSurveys() 
          : await fetchCompletedSurveys()
        setSurveys(data)
      } catch (error) {
        console.error('Error fetching surveys:', error)
        // You might want to show an error toast here
      } finally {
        setIsLoading(false)
      }
    }

    fetchSurveys()
  }, [surveyType])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-gray-900">SurvAI</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start bg-gray-100">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between hover:bg-gray-100">
                <div className="flex items-center">
                  <FileText className="mr-3 h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">Surveys</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 py-1 rounded-md shadow-lg" align="start" sideOffset={4}>
              <DropdownMenuItem 
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                onClick={() => setSurveyType('all')}
              >
                <span>All Surveys</span>
                {surveyType === 'all' && (
                  <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                onClick={() => setSurveyType('completed')}
              >
                <span>Completed Surveys</span>
                {surveyType === 'completed' && (
                  <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" className="w-full justify-start">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </nav>

        <div className="p-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
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
            <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                  <div className="flex items-center text-xs">
                    {metric.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                    )}
                    <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>{metric.change}</span>
                    <span className="text-gray-500 ml-1">{metric.period}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Active Surveys Section */}
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

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Rows per page</span>
                  <select 
                    className="border border-gray-300 rounded px-2 py-1 bg-white"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={5}>5</option>
                  </select>
                </div>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(p => Math.max(1, p - 1));
                        }}
                        className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        aria-disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {Array.from({ 
                      length: Math.ceil(surveys.length / rowsPerPage) 
                    }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i + 1);
                          }}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(p => Math.min(Math.ceil(surveys.length / rowsPerPage), p + 1));
                        }}
                        className={currentPage >= Math.ceil(surveys.length / rowsPerPage) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        aria-disabled={currentPage >= Math.ceil(surveys.length / rowsPerPage)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
