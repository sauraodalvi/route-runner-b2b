import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials
const supabaseUrl = 'https://wnvonjgjusywqewejeho.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indudm9uamdqdXN5d3Fld2VqZWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTU3NzIsImV4cCI6MjA2MDQ3MTc3Mn0.8jNkNE3XKs11e_EIfkeoRtZd53GVNDIja0_X-uxOQ6g';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key provided:', !!supabaseKey);

// Create Supabase client with minimal options to avoid issues
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Log the client initialization
console.log('Supabase client initialized with URL:', supabaseUrl);

// Test the connection immediately
(async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('routes').select('count').limit(1);

    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('Supabase connection test successful:', data);
    }
  } catch (err) {
    console.error('Exception during Supabase connection test:', err);
  }
})();

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

// Define database types
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          address: string;
          city: string;
          state: string;
          zip: string;
          contact_name: string;
          contact_phone: string;
          payment_type: 'walkin' | 'prepaid' | 'postpaid';
          created_at: string;
          updated_at: string;
        };
      };
      routes: {
        Row: {
          id: string;
          name: string;
          trip_id: string;
          date: string;
          status: 'active' | 'upcoming' | 'completed' | 'cancelled';
          assigned_team: string;
          partner_id: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      stops: {
        Row: {
          id: string;
          route_id: string;
          sequence: number;
          name: string;
          address: string;
          type: 'pickup' | 'dropoff';
          status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
          time: string | null;
          contact_name: string | null;
          contact_phone: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      samples: {
        Row: {
          id: string;
          stop_id: string;
          type: string;
          status: 'registered' | 'unregistered';
          quantity: number;
          collected_by: string | null;
          collection_time: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      attachments: {
        Row: {
          id: string;
          stop_id: string;
          name: string;
          type: string;
          url: string;
          size: number;
          created_at: string;
          updated_at: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
      };
      partners: {
        Row: {
          id: string;
          name: string;
          contact: string;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}
