'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Field {
  id: string;
  name: string;
  type: 'text' | 'number' | 'group';
  description: string;
  fields?: Field[];
}

interface SchemaDefinitionProps {
  schema: Field[];
  onChange: (schema: Field[]) => void;
}

let nextId = 1;
const generateId = () => `field_${nextId++}`;

const addIds = (fields: Omit<Field, 'id'>[]): Field[] => {
  return fields.map(field => ({
    ...field,
    id: generateId(),
    fields: field.fields ? addIds(field.fields) : undefined
  }));
};

// Template schemas for common document types
const templateSchemas = {
  invoice: addIds([
    {
      name: 'invoice_number',
      type: 'text',
      description: 'Invoice number or reference'
    },
    {
      name: 'date',
      type: 'text',
      description: 'Invoice date'
    },
    {
      name: 'total_amount',
      type: 'number',
      description: 'Total invoice amount'
    },
    {
      name: 'items',
      type: 'group',
      description: 'List of items in the invoice',
      fields: [
        {
          name: 'description',
          type: 'text',
          description: 'Item description'
        },
        {
          name: 'quantity',
          type: 'number',
          description: 'Quantity of items'
        },
        {
          name: 'unit_price',
          type: 'number',
          description: 'Price per unit'
        },
        {
          name: 'amount',
          type: 'number',
          description: 'Total amount for this item'
        }
      ]
    }
  ]),
  receipt: addIds([
    {
      name: 'merchant',
      type: 'text',
      description: 'Name of the merchant'
    },
    {
      name: 'date',
      type: 'text',
      description: 'Receipt date'
    },
    {
      name: 'total',
      type: 'number',
      description: 'Total amount'
    },
    {
      name: 'items',
      type: 'group',
      description: 'List of purchased items',
      fields: [
        {
          name: 'item',
          type: 'text',
          description: 'Item name'
        },
        {
          name: 'price',
          type: 'number',
          description: 'Item price'
        }
      ]
    }
  ])
};

const initialSchema = addIds([
  {
    name: 'company',
    type: 'text',
    description: 'name of company'
  },
  {
    name: 'address',
    type: 'text',
    description: 'address of company'
  },
  {
    name: 'total_sum',
    type: 'number',
    description: 'total amount we purchased'
  },
  {
    name: 'items',
    type: 'group',
    description: 'list of items purchased',
    fields: [
      {
        name: 'item',
        type: 'text',
        description: 'name of item'
      },
      {
        name: 'unit_price',
        type: 'number',
        description: 'unit price of item'
      },
      {
        name: 'quantity',
        type: 'number',
        description: 'quantity we purchased'
      },
      {
        name: 'sum',
        type: 'number',
        description: 'total amount we purchased'
      }
    ]
  }
]);

export default function SchemaDefinition({ schema, onChange }: SchemaDefinitionProps) {
  const [localSchema, setLocalSchema] = useState<Field[]>(schema);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

  useEffect(() => {
    setLocalSchema(schema);
  }, [schema]);

  const updateFieldInSchema = (fieldId: string, updates: Partial<Field>) => {
    const updateInFields = (fields: Field[]): Field[] => {
      return fields.map(field => {
        if (field.id === fieldId) {
          return { ...field, ...updates };
        }
        if (field.fields) {
          return {
            ...field,
            fields: updateInFields(field.fields)
          };
        }
        return field;
      });
    };

    const newSchema = updateInFields(localSchema);
    setLocalSchema(newSchema);
    onChange(newSchema);
  };

  const addSubField = (parentId: string) => {
    const updateInFields = (fields: Field[]): Field[] => {
      return fields.map(field => {
        if (field.id === parentId) {
          const newField: Field = {
            id: generateId(),
            name: `field_${(field.fields?.length || 0) + 1}`,
            type: 'text',
            description: ''
          };
          return {
            ...field,
            fields: [...(field.fields || []), newField]
          };
        }
        if (field.fields) {
          return {
            ...field,
            fields: updateInFields(field.fields)
          };
        }
        return field;
      });
    };

    const newSchema = updateInFields(localSchema);
    setLocalSchema(newSchema);
    onChange(newSchema);
  };

  const handleSaveSchema = () => {
    try {
      const schemaName = window.prompt('Enter a name for this schema:');
      if (!schemaName) return;

      const savedSchemas = JSON.parse(localStorage.getItem('savedSchemas') || '{}');
      savedSchemas[schemaName] = localSchema;
      localStorage.setItem('savedSchemas', JSON.stringify(savedSchemas));
      toast.success(`Schema "${schemaName}" saved successfully`);
    } catch (error) {
      console.error('Error saving schema:', error);
      toast.error('Failed to save schema');
    }
  };

  const handleLoadSchema = () => {
    try {
      const savedSchemas = JSON.parse(localStorage.getItem('savedSchemas') || '{}');
      const schemaNames = Object.keys(savedSchemas);
      
      if (schemaNames.length === 0) {
        toast.error('No saved schemas found');
        return;
      }

      const schemaName = window.prompt(
        `Enter the name of the schema to load (${schemaNames.join(', ')}):`,
        schemaNames[0]
      );

      if (!schemaName) return;

      const loadedSchema = savedSchemas[schemaName];
      if (!loadedSchema) {
        toast.error(`Schema "${schemaName}" not found`);
        return;
      }

      setLocalSchema(loadedSchema);
      onChange(loadedSchema);
      toast.success(`Schema "${schemaName}" loaded successfully`);
    } catch (error) {
      console.error('Error loading schema:', error);
      toast.error('Failed to load schema');
    }
  };

  const handleLoadTemplate = (templateName: keyof typeof templateSchemas) => {
    const template = templateSchemas[templateName];
    setLocalSchema(template);
    onChange(template);
    toast.success(`Template "${templateName}" loaded successfully`);
    setShowTemplateDropdown(false);
  };

  const renderField = (field: Field, depth = 0) => {
    const indentClass = depth > 0 ? `ml-${depth * 6}` : '';

    return (
      <div key={field.id} className={`${indentClass} mb-6 last:mb-0`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={field.name}
            onChange={e => updateFieldInSchema(field.id, { name: e.target.value })}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                     transition-colors text-gray-800 text-sm w-full sm:w-48"
            placeholder="Field name"
          />
          <select
            value={field.type}
            onChange={e => {
              const newType = e.target.value as Field['type'];
              updateFieldInSchema(field.id, {
                type: newType,
                fields: newType === 'group' ? [] : undefined
              });
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                     transition-colors text-gray-800 text-sm w-full sm:w-36 bg-white"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="group">Group</option>
          </select>
          <input
            type="text"
            value={field.description}
            onChange={e => updateFieldInSchema(field.id, { description: e.target.value })}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                     transition-colors text-gray-800 text-sm flex-1"
            placeholder="Description"
          />
        </div>
        
        {field.type === 'group' && (
          <div className="mt-4 pl-6 border-l-2 border-indigo-100">
            {field.fields?.map(subField => renderField(subField, depth + 1))}
            <button
              onClick={() => addSubField(field.id)}
              className="mt-4 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 
                       rounded-lg transition-colors inline-flex items-center gap-2"
            >
              + Add Sub-field
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Data Extraction Schema</h2>
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 
                       rounded-lg transition-colors inline-flex items-center gap-2"
            >
              Load Template
            </button>
            {showTemplateDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                <div className="py-1">
                  {Object.keys(templateSchemas).map((templateName) => (
                    <button
                      key={templateName}
                      onClick={() => handleLoadTemplate(templateName as keyof typeof templateSchemas)}
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      {templateName.charAt(0).toUpperCase() + templateName.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleSaveSchema}
            className="px-4 py-2 text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 
                     rounded-lg transition-colors inline-flex items-center gap-2"
          >
            Save Schema
          </button>
          <button
            onClick={handleLoadSchema}
            className="px-4 py-2 text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 
                     rounded-lg transition-colors inline-flex items-center gap-2"
          >
            Load Schema
          </button>
          <button
            onClick={() => {
              const newField: Field = {
                id: generateId(),
                name: `field_${localSchema.length + 1}`,
                type: 'text',
                description: ''
              };
              const newSchema = [...localSchema, newField];
              setLocalSchema(newSchema);
              onChange(newSchema);
            }}
            className="px-4 py-2 text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 
                     rounded-lg transition-colors inline-flex items-center gap-2"
          >
            + Add Field
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {localSchema.map(field => renderField(field))}
      </div>
    </div>
  );
}
