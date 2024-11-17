import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

interface Field {
  id: string;
  name: string;
  type: 'text' | 'number' | 'group';
  description: string;
  fields?: Field[];
}

function transformDataToRows(data: any): any[] {
  // Get the first field that is an array to determine number of rows
  const arrayField = Object.entries(data).find(([_, value]) => Array.isArray(value));
  if (!arrayField) return [data];

  const [_, firstArray] = arrayField;
  const numRows = (firstArray as any[]).length;
  const rows = [];

  // Create a row for each index
  for (let i = 0; i < numRows; i++) {
    const row: any = {};

    // For each field in the data
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        row[key] = value[i];
      } else {
        row[key] = value;
      }
    });

    rows.push(row);
  }

  return rows;
}

export async function POST(request: NextRequest) {
  console.log('Starting Excel file generation...');
  
  try {
    const { data, schema } = await request.json();

    if (!Array.isArray(data) || data.length === 0 || !schema) {
      console.error('No data or schema provided for Excel generation');
      return NextResponse.json(
        { error: 'No data or schema provided' },
        { status: 400 }
      );
    }

    // Transform each document's data into rows
    const allRows: any[] = [];
    data.forEach((docData) => {
      const rows = transformDataToRows(docData);
      allRows.push(...rows);
    });

    console.log('First two rows:', JSON.stringify(allRows.slice(0, 2), null, 2));

    if (allRows.length === 0) {
      console.error('No rows generated after transformation');
      return NextResponse.json(
        { error: 'No data generated for Excel file' },
        { status: 400 }
      );
    }

    // Get all unique headers from the schema
    const headers = schema.map(field => field.name);
    console.log('Headers:', headers);

    // Create workbook with headers
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(allRows, { 
      header: headers,
      skipHeader: false
    });

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Extracted Data');

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      bookSST: false
    });

    // Return the Excel file
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="extracted_data.xlsx"'
      }
    });

  } catch (error) {
    console.error('Error generating Excel file:', error);
    return NextResponse.json(
      { error: 'Error generating Excel file' },
      { status: 500 }
    );
  }
}
