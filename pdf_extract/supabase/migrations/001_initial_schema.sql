-- Create custom types
CREATE TYPE document_status AS ENUM ('pending', 'processed', 'error');

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create pdf_documents table
CREATE TABLE public.pdf_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status document_status DEFAULT 'pending' NOT NULL,
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    CONSTRAINT valid_file_size CHECK (file_size > 0)
);

-- Create user_settings table
CREATE TABLE public.user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    theme TEXT DEFAULT 'light' NOT NULL,
    notifications_enabled BOOLEAN DEFAULT true NOT NULL,
    settings JSONB DEFAULT '{}'::jsonb NOT NULL,
    CONSTRAINT unique_user_settings UNIQUE (user_id)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_pdf_documents_updated_at
    BEFORE UPDATE ON pdf_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE public.pdf_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- PDF documents policies
CREATE POLICY "Users can view their own documents"
    ON public.pdf_documents
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own documents"
    ON public.pdf_documents
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
    ON public.pdf_documents
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
    ON public.pdf_documents
    FOR DELETE
    USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can view their own settings"
    ON public.user_settings
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings"
    ON public.user_settings
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
    ON public.user_settings
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings"
    ON public.user_settings
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_pdf_documents_user_id ON public.pdf_documents(user_id);
CREATE INDEX idx_pdf_documents_status ON public.pdf_documents(status);
CREATE INDEX idx_pdf_documents_created_at ON public.pdf_documents(created_at);
CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);
