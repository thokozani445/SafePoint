// src/config/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for database operations

/**
 * Get all active SafePoint locations
 */
export async function getSafepoints(city = null) {
  let query = supabase
    .from('safepoints')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (city) {
    query = query.eq('city', city);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching safepoints:', error);
    throw error;
  }
  
  return data;
}

/**
 * Find nearest SafePoints to given coordinates
 */
export async function getNearestSafepoints(latitude, longitude, limit = 3) {
  const { data, error } = await supabase
    .from('safepoints')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching safepoints:', error);
    throw error;
  }

  // Calculate distances and sort
  const safepointsWithDistance = data.map(sp => ({
    ...sp,
    distance: calculateDistance(latitude, longitude, sp.latitude, sp.longitude)
  }));

  return safepointsWithDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

/**
 * Create a new incident
 */
export async function createIncident(incidentData) {
  const { data, error } = await supabase
    .from('incidents')
    .insert([{
      safepoint_id: incidentData.safepoint_id,
      staff_pin: incidentData.staff_pin,
      status: 'active',
      actions_taken: [],
      notes: incidentData.notes || '',
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating incident:', error);
    throw error;
  }

  return data;
}

/**
 * Update incident with actions taken
 */
export async function updateIncident(incidentId, updates) {
  const { data, error } = await supabase
    .from('incidents')
    .update(updates)
    .eq('id', incidentId)
    .select()
    .single();

  if (error) {
    console.error('Error updating incident:', error);
    throw error;
  }

  return data;
}

/**
 * Add action to incident
 */
export async function addIncidentAction(incidentId, action) {
  // First get current actions
  const { data: incident, error: fetchError } = await supabase
    .from('incidents')
    .select('actions_taken')
    .eq('id', incidentId)
    .single();

  if (fetchError) {
    console.error('Error fetching incident:', fetchError);
    throw fetchError;
  }

  // Add new action
  const actions = [...(incident.actions_taken || []), {
    action: action,
    timestamp: new Date().toISOString()
  }];

  // Update incident
  return await updateIncident(incidentId, { actions_taken: actions });
}

/**
 * Close an incident
 */
export async function closeIncident(incidentId, responseTimeSeconds) {
  return await updateIncident(incidentId, {
    status: 'closed',
    closed_at: new Date().toISOString(),
    response_time_seconds: responseTimeSeconds
  });
}

/**
 * Get recent incidents
 */
export async function getRecentIncidents(limit = 10) {
  const { data, error } = await supabase
    .from('incidents')
    .select(`
      *,
      safepoints (
        name,
        type,
        city
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching incidents:', error);
    throw error;
  }

  return data;
}

/**
 * Get incident statistics
 */
export async function getIncidentStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Total incidents today
  const { count: todayCount, error: todayError } = await supabase
    .from('incidents')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());

  if (todayError) {
    console.error('Error fetching today stats:', todayError);
  }

  // Average response time
  const { data: avgData, error: avgError } = await supabase
    .from('incidents')
    .select('response_time_seconds')
    .not('response_time_seconds', 'is', null);

  if (avgError) {
    console.error('Error fetching avg response time:', avgError);
  }

  const avgResponseTime = avgData && avgData.length > 0
    ? Math.round(avgData.reduce((sum, i) => sum + i.response_time_seconds, 0) / avgData.length)
    : 0;

  // Active incidents
  const { count: activeCount, error: activeError } = await supabase
    .from('incidents')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  if (activeError) {
    console.error('Error fetching active incidents:', activeError);
  }

  return {
    todayCount: todayCount || 0,
    avgResponseTime,
    activeCount: activeCount || 0
  };
}

/**
 * Get current code phrase
 */
export async function getCurrentCodePhrase() {
  const { data, error } = await supabase
    .from('system_config')
    .select('value')
    .eq('key', 'current_code_phrase')
    .single();

  if (error) {
    console.error('Error fetching code phrase:', error);
    return 'Is Angela on shift?'; // Fallback
  }

  return data.value;
}

/**
 * Subscribe to real-time incident updates
 */
export function subscribeToIncidents(callback) {
  const subscription = supabase
    .channel('incidents')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'incidents' },
      callback
    )
    .subscribe();

  return subscription;
}

// Utility: Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}