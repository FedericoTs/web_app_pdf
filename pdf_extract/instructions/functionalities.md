# Overview
The web application has the goal of enabling users to extract data from PDF files and visualize it in a user-friendly interface. It will allow user to save the data on a Supabase Database and view it in a table format. The PDFs could have different formats or structures and the application will be able to handle them.

# Core Functionalities
## Landing Page ('/')
- Make sure the landing page can manage the user authentication process.

## Authentication Pages ('/auth')
Use Supabase for authentication
- Login page:
    - Email/password login form.
    - "Forgot password" link.
    - "Sign up" redirect link.
    - Error handling display.
    - Loading states.
- Sign up page:
    - Email/password sign up form.
    - Error handling display.
    - Loading states.

## Upload Page ('/dashboard/upload')
- Allows user to upload one or more PDF invoices.
- File list with preview buttons.
- Upload progress indicators.
- File size and type validation.
- Immediate file processing status.
- The application must allow users to upload one or more PDF invoices.
- User should be able to define data points they want to extract:
    - Individual fields (single value extraction)
    - Multiple fields (array of object with consistent structure)
- For eachgroup, users can define multiple fields inside, or even other groups.
- There should be a button "Start extraction".
- Set default schema to showcase how does this work
    - company: company name
    - address: address of the company
    - billing id: billing id
    - billing date: billing date
    - total sum: total amount we purcheased
    - items (group):
        - item: name of item
        - unit price: unit price of item
        - quantity: quantity of item
        - sum: total amount purcheased
- Server-side processing.

### 1.Extracting data from the PDF
- Use LLamaParser for PDF text extraction (server-side).
- For each file, combine all document chunks for complete text, make sure return full text of all documents, not just the first one document[0].
- The llamaparse text extraction should happen immidiately after user upload files to UI, and not wait for a button click.
- Strictly following ## 1. LlamaParser Documentation as code implementation example
- After each file uploaded, it should be displayed as an item on the page, displaying the file name with a button to click to preview the full text extracted.
- User can keep adding new files to the list, previously uploaded files should be displayed.
- Server-side processing only.

### 2. Data Storage
- The uploaded PDF should immidiately stored in a Supabase database.
- For each extract and schema definition, the data extracted should be stored in a Supabase database in a dedicated table.
- The user can view and filter the data or download it as a CSV or Excel file.

### 3. Data Processing
- After clicking on the "Start extraction" button, the data should be sent to OpenAI for processing across all files.
- Use OpenAI structured output for information extraction.
- Strictly following ## 2. OpenAI Documentation as code implementation example

## Results Page ('/results')
- Extracted data table view.
- Filtering capabilities.
- Pagination.
- Export data to CSV.

## Dashboard page ('/dashboard')
- User should be able to have an overview of their data fatching from Supabase Database.
- User should be able to visualize the data in the different charts and cards.

## Settings page ('/dashboard/settings')
- User should be able to change their password.
- User should be able to change their email address.
- User should be able to delete their account.
- User should be able to choose their colour palette.

# Supabase Integration

## Setup
The project uses Supabase for authentication and data storage. Here's what's been set up:

1. **Environment Variables** (.env.local)
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

2. **Database Tables**
   - pdf_documents: Stores PDF document information and processing status
   - user_settings: Stores user preferences and settings

3. **Authentication**
   - Middleware for protected routes
   - Auto-redirect to login page
   - Session management

## File Structure
```
lib/supabase/
├── client.ts     # Client-side Supabase instance
├── server.ts     # Server-side Supabase instance
└── types.ts      # TypeScript types for database schema
```

## Next Steps
1. Create a Supabase project at https://app.supabase.com
2. Create the database tables using the schema defined in types.ts
3. Copy the project URL and keys from Supabase dashboard to .env.local
4. Implement authentication UI components
5. Add data fetching and mutation functions

# Documentation
## 1. LlamaParser Documentation
- https://llamaparser.readthedocs.io/en/latest/
- https://github.com/llm-parser/LlamaParser

## 2. OpenAI Documentation
Code snippets from OpenAI. Make sure to use the model GPT-4o.
'''
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI();

const CalendarEvent = z.object({
  name: z.string(),
  date: z.string(),
  participants: z.array(z.string()),
});

const completion = await openai.beta.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [
    { role: "system", content: "Extract the event information." },
    { role: "user", content: "Alice and Bob are going to a science fair on Friday." },
  ],
  response_format: zodResponseFormat(CalendarEvent, "event"),
});

const event = completion.choices[0].message.parsed;