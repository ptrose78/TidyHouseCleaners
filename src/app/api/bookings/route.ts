import { NextResponse } from 'next/server';
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    // Fetch all bookings, ordered by most recent first
    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ bookings });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}