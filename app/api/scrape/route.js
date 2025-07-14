import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(req) {
  try {
    const { url } = await req.json();
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0 Safari/537.36',
      },
    });

    const $ = cheerio.load(data);

    // Try to find main article text
    const articleText =
      $('article').text() ||
      $('[class*=content]').text() ||
      $('[class*=article]').text() ||
      $('body').text();

    const cleanedText = articleText.replace(/\s+/g, ' ').trim();

    return Response.json({ text: cleanedText });
  } catch (error) {
    console.error('Scrape Error:', error.message);
    return Response.json({ error: 'Failed to scrape' }, { status: 500 });
  }
}
