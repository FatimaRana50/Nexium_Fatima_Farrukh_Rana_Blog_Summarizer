'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import jsPDF from 'jspdf'; // 📄 Import jsPDF



export default function Home() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [summaryUrdu, setSummaryUrdu] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!url) return;
    setLoading(true);
    setSummary('');
    setSummaryUrdu('');

    try {
      const scrapeRes = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const { text } = await scrapeRes.json();

      const processRes = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, text }),
      });
      const { summary, summaryUrdu } = await processRes.json();

      setSummary(summary);
      setSummaryUrdu(summaryUrdu);
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    }

    setLoading(false);
  };

  const handleSavePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('🔹 English Summary', 10, 10);
    doc.text(summary, 10, 20, { maxWidth: 180 });

    

    doc.save('summary.pdf');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 to-rose-100 flex flex-col items-center px-4 py-10">
     <Card className="w-full max-w-xl border-purple-300 border-2 shadow-2xl bg-purple-50"> {/* Added bg-pink-50 */}
        <CardContent className="p-6 flex flex-col gap-4">
          <h1 className="text-4xl font-extrabold text-purple-800 text-center bg-pink/30 p-4 rounded-xl shadow-lg">
  📝 Blog Summarizer
</h1>
<p className="text-center text-gray-600 mt-2">
  Enter a blog URL to generate a summary in English and Urdu
</p>

          <Input
            placeholder="Paste blog URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="text-base"
          />

          <Button onClick={handleSummarize} disabled={loading}>
            {loading ? 'Summarizing...' : 'Summarize Blog'}
          </Button>

          {summary && (
            <>
              <div>
                <h2 className="text-xl font-semibold text-purple-600 mb-1">
                  🔹 English Summary
                </h2>
                <p className="text-gray-800 whitespace-pre-line">{summary}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-purple-600 mb-1">
                  🔸 اردو خلاصہ
                </h2>
                <p className="text-gray-800 font-serif whitespace-pre-line">{summaryUrdu}</p>
              </div>

              {/* 📄 Save to PDF Button */}
              <Button className="mt-4" onClick={handleSavePDF}>
                📄 Save Summary as PDF
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
