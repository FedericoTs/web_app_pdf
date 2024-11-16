'use client'

import { useState } from "react"
import { Upload, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Field {
  id: string
  name: string
  type: 'single' | 'multiple'
}

interface Group {
  id: string
  name: string
  fields: Field[]
  groups: Group[]
}

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [groups, setGroups] = useState<Group[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
    } else {
      alert('Please select a PDF file')
    }
  }

  const addGroup = (parentGroup?: Group) => {
    const newGroup: Group = {
      id: Math.random().toString(36).substring(7),
      name: `Group ${groups.length + 1}`,
      fields: [],
      groups: []
    }

    if (parentGroup) {
      setGroups(prevGroups => {
        const updateGroupRecursively = (groups: Group[]): Group[] => {
          return groups.map(group => {
            if (group.id === parentGroup.id) {
              return { ...group, groups: [...group.groups, newGroup] }
            }
            return { ...group, groups: updateGroupRecursively(group.groups) }
          })
        }
        return updateGroupRecursively(prevGroups)
      })
    } else {
      setGroups(prevGroups => [...prevGroups, newGroup])
    }
  }

  const addField = (group: Group) => {
    const newField: Field = {
      id: Math.random().toString(36).substring(7),
      name: `Field ${group.fields.length + 1}`,
      type: 'single'
    }

    setGroups(prevGroups => {
      const updateGroupRecursively = (groups: Group[]): Group[] => {
        return groups.map(g => {
          if (g.id === group.id) {
            return { ...g, fields: [...g.fields, newField] }
          }
          return { ...g, groups: updateGroupRecursively(g.groups) }
        })
      }
      return updateGroupRecursively(prevGroups)
    })
  }

  const updateField = (groupId: string, fieldId: string, updates: Partial<Field>) => {
    setGroups(prevGroups => {
      const updateGroupRecursively = (groups: Group[]): Group[] => {
        return groups.map(group => {
          if (group.id === groupId) {
            return {
              ...group,
              fields: group.fields.map(field =>
                field.id === fieldId ? { ...field, ...updates } : field
              )
            }
          }
          return { ...group, groups: updateGroupRecursively(group.groups) }
        })
      }
      return updateGroupRecursively(prevGroups)
    })
  }

  const removeField = (groupId: string, fieldId: string) => {
    setGroups(prevGroups => {
      const updateGroupRecursively = (groups: Group[]): Group[] => {
        return groups.map(group => {
          if (group.id === groupId) {
            return {
              ...group,
              fields: group.fields.filter(field => field.id !== fieldId)
            }
          }
          return { ...group, groups: updateGroupRecursively(group.groups) }
        })
      }
      return updateGroupRecursively(prevGroups)
    })
  }

  const removeGroup = (groupId: string) => {
    setGroups(prevGroups => {
      const removeGroupRecursively = (groups: Group[]): Group[] => {
        return groups.filter(group => {
          if (group.id === groupId) return false
          group.groups = removeGroupRecursively(group.groups)
          return true
        })
      }
      return removeGroupRecursively(prevGroups)
    })
  }

  const handleStartExtraction = () => {
    if (!selectedFile) {
      alert('Please select a PDF file first')
      return
    }
    console.log('Starting extraction with configuration:', { file: selectedFile, groups })
    // TODO: Implement extraction logic
  }

  const renderGroup = (group: Group, level = 0) => (
    <div key={group.id} className={`ml-${level * 4} mb-4 p-4 border rounded-lg`}>
      <div className="flex items-center justify-between mb-2">
        <Input
          value={group.name}
          onChange={(e) => {
            setGroups(prevGroups => {
              const updateGroupRecursively = (groups: Group[]): Group[] => {
                return groups.map(g => {
                  if (g.id === group.id) {
                    return { ...g, name: e.target.value }
                  }
                  return { ...g, groups: updateGroupRecursively(g.groups) }
                })
              }
              return updateGroupRecursively(prevGroups)
            })
          }}
          className="max-w-xs"
        />
        <Button variant="destructive" size="sm" onClick={() => removeGroup(group.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {group.fields.map(field => (
          <div key={field.id} className="flex items-center gap-2">
            <Input
              value={field.name}
              onChange={(e) => updateField(group.id, field.id, { name: e.target.value })}
              placeholder="Field name"
              className="max-w-xs"
            />
            <Select
              value={field.type}
              onValueChange={(value: 'single' | 'multiple') => 
                updateField(group.id, field.id, { type: value })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="multiple">Multiple</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="destructive" size="sm" onClick={() => removeField(group.id, field.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-4 space-x-2">
        <Button variant="outline" size="sm" onClick={() => addField(group)}>
          <Plus className="h-4 w-4 mr-1" /> Add Field
        </Button>
        <Button variant="outline" size="sm" onClick={() => addGroup(group)}>
          <Plus className="h-4 w-4 mr-1" /> Add Group
        </Button>
      </div>

      {group.groups.map(subGroup => renderGroup(subGroup, level + 1))}
    </div>
  )

  return (
    <div className="container mx-auto p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload PDF Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="mb-2 text-muted-foreground">
              {selectedFile ? selectedFile.name : 'Select a PDF file to upload'}
            </p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <Button asChild>
              <label htmlFor="file-input">Select File</label>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configure Data Extraction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {groups.map(group => renderGroup(group))}
            
            {groups.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No extraction groups defined yet. Add a group to get started.
              </p>
            )}

            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => addGroup()}>
                <Plus className="h-4 w-4 mr-1" /> Add Group
              </Button>
              
              <Button 
                onClick={handleStartExtraction}
                disabled={!selectedFile || groups.length === 0}
              >
                Start Extraction
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}