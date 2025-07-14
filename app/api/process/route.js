import { summarizeText } from '../../../lib/summarizer'; // ✅ relative path (3 folders up from /app/api/process)

import { translateToUrdu } from '@/lib/translator';
import { getMongoCollection } from '@/lib/mongodb';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    console.log('🔵 /api/process called');

    const body = await req.json();
    const { url, text } = body;
    console.log('📩 Received URL:', url);
    if (!text || typeof text !== 'string') {
  console.error('❌ Invalid or missing text from scraper.');
  return Response.json({ error: 'No text content found for the given URL.' }, { status: 400 });
}
console.log('📝 Text length:', text.length);

    const summary = summarizeText(text);
    const summaryUrdu = translateToUrdu(summary);
    console.log('✅ Summarization done');

    const blogs = await getMongoCollection();
    const result = await blogs.insertOne({ url, fullText: text });
    console.log('✅ Inserted into MongoDB:', result.insertedId);

    const { error } = await supabase.from('summaries').insert([
      { url, summary, summaryUrdu }
    ]);
    if (error) {
      console.error('❌ Supabase insert error:', error.message);
    } else {
      console.log('✅ Supabase insert successful');
    }

    return Response.json({ summary, summaryUrdu });
  } catch (error) {
    console.error('❌ /api/process Error:', error.message);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
