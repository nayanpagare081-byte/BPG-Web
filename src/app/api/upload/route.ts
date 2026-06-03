import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase credentials missing.' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a safe, unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Remove original extension, clean name, then add unique suffix + original extension
    const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-]/g, "");
    const filename = `${cleanName}-${uniqueSuffix}${path.extname(file.name)}`;
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Supabase Storage Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filename);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}
