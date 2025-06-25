/*
  Migration: Add User-Scoped Data to Messages Table
  
  Date: 2025-06-25
  Author: Recalibration App Development
  
  Purpose:
    - Implement proper user data separation for messages
    - Ensure each user can only access their own messages
    - Add database-level security through Row Level Security (RLS)
  
  Changes Made:
    1. Add user_id column with foreign key relationship to auth.users
    2. Create performance index on user_id column  
    3. Enable Row Level Security on messages table
    4. Create security policies for SELECT, INSERT, UPDATE, DELETE operations
  
  Post-Migration Steps:
    - Existing messages will have user_id = NULL (invisible due to RLS)
    - New messages will automatically include user_id from authenticated user
    - To assign existing messages: UPDATE messages SET user_id = 'user-id' WHERE user_id IS NULL;
  
  Security:
    - Users can only see/modify messages where user_id matches their auth.uid()
    - Foreign key constraint ensures data integrity
    - ON DELETE CASCADE removes user messages when user account is deleted
*/

-- Step 1: Add user_id column with foreign key constraint
-- This creates the relationship between messages and users
-- ON DELETE CASCADE ensures user messages are deleted when user account is deleted
ALTER TABLE messages ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Create index for query performance optimization
-- This dramatically speeds up queries filtering by user_id (which every query will do due to RLS)
-- Index allows O(log n) lookups instead of O(n) table scans
CREATE INDEX messages_user_id_idx ON messages(user_id);

-- Step 3: Enable Row Level Security
-- This activates the security policies defined below
-- Without this, policies would be ignored and all data would be accessible
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Step 4: Security Policies
-- These policies automatically filter data based on the authenticated user
-- auth.uid() returns the current user's ID from the JWT token

-- Policy 1: SELECT - Users can only read their own messages
CREATE POLICY "Users can only see their own messages" ON messages
  FOR SELECT USING (auth.uid() = user_id);

-- Policy 2: INSERT - Users can only create messages assigned to themselves  
CREATE POLICY "Users can only insert their own messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy 3: UPDATE - Users can only modify their own messages
CREATE POLICY "Users can only update their own messages" ON messages
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy 4: DELETE - Users can only remove their own messages
CREATE POLICY "Users can only delete their own messages" ON messages
  FOR DELETE USING (auth.uid() = user_id); 