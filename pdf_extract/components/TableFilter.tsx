import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Field } from "../lib/types";

interface TableFilterProps {
  schema: Field[];
  onFilterChange: (field: string, value: string) => void;
  selectedField: string;
}

export function TableFilter({
  schema,
  onFilterChange,
  selectedField,
}: TableFilterProps) {
  const [filterValue, setFilterValue] = useState("");
  const [currentField, setCurrentField] = useState(selectedField);

  useEffect(() => {
    setCurrentField(selectedField);
  }, [selectedField]);

  const handleFieldChange = (value: string) => {
    setCurrentField(value);
    setFilterValue("");
    onFilterChange(value, "");
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setFilterValue(newValue);
    onFilterChange(currentField, newValue);
  };

  return (
    <div className="flex items-center space-x-2">
      <Select value={currentField} onValueChange={handleFieldChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select field to filter">
            {schema.find(f => f.name === currentField)?.name || "Select field"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {schema.map((field) => (
            <SelectItem key={field.id} value={field.name}>
              {field.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder={`Filter by ${currentField}...`}
        className="max-w-sm"
        value={filterValue}
        onChange={handleValueChange}
      />
    </div>
  );
}
