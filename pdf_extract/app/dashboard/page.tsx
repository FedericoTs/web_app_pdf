'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { RefreshCcw } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample data generators
const generateDailyData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
    processed: Math.floor(Math.random() * 50),
    successful: Math.floor(Math.random() * 40),
  }))
}

const generateTypeData = () => {
  return [
    { name: 'Invoices', count: Math.floor(Math.random() * 100) },
    { name: 'Receipts', count: Math.floor(Math.random() * 100) },
    { name: 'Contracts', count: Math.floor(Math.random() * 100) },
    { name: 'Reports', count: Math.floor(Math.random() * 100) },
  ]
}

const generateProviderData = () => {
  return [
    { name: 'Amazon AWS', value: Math.floor(Math.random() * 1000) },
    { name: 'Google Cloud', value: Math.floor(Math.random() * 1000) },
    { name: 'Microsoft Azure', value: Math.floor(Math.random() * 1000) },
    { name: 'DigitalOcean', value: Math.floor(Math.random() * 1000) },
  ]
}

const generateMonthlyPayments = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    amount: Math.floor(Math.random() * 10000),
  }))
}

// Modern soft color palette
const COLORS = {
  primary: '#8b5cf6', // Soft Purple
  secondary: '#ec4899', // Pink
  success: '#34d399', // Soft Green
  warning: '#fbbf24', // Soft Yellow
  error: '#f87171', // Soft Red
  gray: '#9ca3af', // Soft Gray
  background: '#f8fafc', // Light Gray Background
}

const PIE_COLORS = [
  '#8b5cf6', // Soft Purple
  '#ec4899', // Pink
  '#34d399', // Soft Green
  '#fbbf24', // Soft Yellow
]

// Gradient definitions
const GRADIENTS = {
  purple: {
    id: 'purpleGradient',
    colors: ['#8b5cf6', '#a78bfa']
  },
  green: {
    id: 'greenGradient',
    colors: ['#34d399', '#6ee7b7']
  },
  pink: {
    id: 'pinkGradient',
    colors: ['#ec4899', '#f472b6']
  }
}

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export default function DashboardPage() {
  const [dailyData, setDailyData] = useState<any[]>([])
  const [typeData, setTypeData] = useState<any[]>([])
  const [providerData, setProviderData] = useState<any[]>([])
  const [monthlyPayments, setMonthlyPayments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initialize data on client-side only
  useEffect(() => {
    setDailyData(generateDailyData())
    setTypeData(generateTypeData())
    setProviderData(generateProviderData())
    setMonthlyPayments(generateMonthlyPayments())
    setIsLoading(false)
  }, [])

  // Simulate data refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setDailyData(generateDailyData())
      setTypeData(generateTypeData())
      setProviderData(generateProviderData())
      setMonthlyPayments(generateMonthlyPayments())
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setDailyData(generateDailyData())
    setTypeData(generateTypeData())
    setProviderData(generateProviderData())
    setMonthlyPayments(generateMonthlyPayments())
  }

  const totalAmount = providerData.reduce((sum, item) => sum + item.value, 0)

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your PDF processing activity.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh Data
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Documents</h3>
          </div>
          <div className="text-2xl font-bold">
            {typeData.reduce((sum, item) => sum + item.count, 0)}
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Processed Today</h3>
          </div>
          <div className="text-2xl font-bold">
            {dailyData[dailyData.length - 1]?.processed || 0}
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Success Rate</h3>
          </div>
          <div className="text-2xl font-bold">
            {dailyData[dailyData.length - 1]?.processed ? 
              Math.round((dailyData[dailyData.length - 1].successful / dailyData[dailyData.length - 1].processed) * 100) 
              : 0}%
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Cost</h3>
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(totalAmount)}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Daily Processing Chart */}
        <div className="col-span-4 rounded-xl border bg-white text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Daily Processing</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData} margin={{ top: 30, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id={GRADIENTS.purple.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GRADIENTS.purple.colors[0]} stopOpacity={1}/>
                      <stop offset="100%" stopColor={GRADIENTS.purple.colors[1]} stopOpacity={1}/>
                    </linearGradient>
                    <linearGradient id={GRADIENTS.green.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GRADIENTS.green.colors[0]} stopOpacity={1}/>
                      <stop offset="100%" stopColor={GRADIENTS.green.colors[1]} stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: COLORS.gray, fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: COLORS.gray, fontSize: 12 }}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend 
                    verticalAlign="top"
                    height={36}
                    iconSize={8}
                    wrapperStyle={{
                      fontSize: '12px',
                      paddingTop: '5px',
                    }}
                  />
                  <Bar 
                    dataKey="processed" 
                    name="Processed" 
                    fill={`url(#${GRADIENTS.purple.id})`}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                  <Bar 
                    dataKey="successful" 
                    name="Successful" 
                    fill={`url(#${GRADIENTS.green.id})`}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Document Types Chart */}
        <div className="col-span-3 rounded-xl border bg-white text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Document Types</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {typeData.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend 
                    verticalAlign="top"
                    height={36}
                    iconSize={8}
                    wrapperStyle={{
                      fontSize: '12px',
                      paddingTop: '5px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Monthly Payments Chart */}
        <div className="col-span-4 rounded-xl border bg-white text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Monthly Payments</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyPayments} margin={{ top: 30, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id={GRADIENTS.pink.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GRADIENTS.pink.colors[0]} stopOpacity={0.8}/>
                      <stop offset="100%" stopColor={GRADIENTS.pink.colors[1]} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: COLORS.gray, fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: COLORS.gray, fontSize: 12 }}
                    dx={-10}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value) => [`$${value}`, 'Amount']}
                  />
                  <Legend 
                    verticalAlign="top"
                    height={36}
                    iconSize={8}
                    wrapperStyle={{
                      fontSize: '12px',
                      paddingTop: '5px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke={GRADIENTS.pink.colors[0]}
                    strokeWidth={3}
                    dot={false}
                    fill={`url(#${GRADIENTS.pink.id})`}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Provider Distribution Chart */}
        <div className="col-span-3 rounded-xl border bg-white text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Provider Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={providerData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {providerData.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value) => [`$${value}`, 'Amount']}
                  />
                  <Legend 
                    verticalAlign="top"
                    height={36}
                    iconSize={8}
                    wrapperStyle={{
                      fontSize: '12px',
                      paddingTop: '5px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
