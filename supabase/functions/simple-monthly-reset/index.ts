// @ts-nocheck
// Simple Monthly Reset Edge Function
// Deletes all user progress without keeping history - perfect for monthly challenges
// Can be called manually or via GitHub Actions automation

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-simple-reset-secret',
}

interface ResetResult {
  success: boolean;
  deleted_records: number;
  reset_timestamp: string;
  message: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check authorization using custom header to avoid Supabase JWT validation
    const customSecret = req.headers.get('x-simple-reset-secret')
    const authHeader = req.headers.get('Authorization')
    const resetSecret = Deno.env.get('SIMPLE_RESET_SECRET') || 'change-this-secret'
    
    // Verify either custom secret header or valid user token
    let isAuthorized = false
    
    if (customSecret && customSecret === resetSecret) {
      isAuthorized = true
      console.log('🔐 Authorized via custom reset secret (automated)')
    } else if (authHeader?.startsWith('Bearer ') && authHeader !== 'Bearer dummy') {
      // Allow authenticated users (for manual admin reset)
      const token = authHeader.replace('Bearer ', '')
      const { data: user, error } = await supabase.auth.getUser(token)
      
      if (user && !error) {
        isAuthorized = true
        console.log('🔐 Authorized via user token (manual)')
      }
    }

    if (!isAuthorized) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid secret or token' }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('🔄 Starting simple monthly progress reset...')

    // Get preview of what will be reset (optional logging)
    const { data: previewData } = await supabase.rpc('get_reset_preview')
    if (previewData) {
      console.log('📊 Reset preview:', previewData)
    }

    // Execute the simple reset (deletes all progress)
    const { data, error } = await supabase.rpc('simple_monthly_reset')

    if (error) {
      console.error('❌ Reset function error:', error)
      throw error
    }

    const result = data as ResetResult

    console.log('✅ Simple monthly reset completed successfully!')
    console.log(`   🗑️ Deleted: ${result.deleted_records} progress records`)
    console.log(`   ⏰ Timestamp: ${result.reset_timestamp}`)
    console.log(`   🎯 Result: Fresh start for all users!`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Simple monthly reset completed - fresh start for everyone! 🎯',
        details: result,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('❌ Simple monthly reset failed:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
