import React, { useState } from 'react';
import { Bot as Lotus, Loader2 } from 'lucide-react';

const DEFAULT_QUOTE = {
  text: "Karmanye vadhikaraste Ma Phaleshu Kadachana, Ma Karma Phala Hetur Bhurmatey Sangostva Akarmani (You have the right to work only but never to its fruits. Let not the fruits of action be your motive, nor let your attachment be to inaction)",
  chapter: "2",
  verse: "47"
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
  const [quote, setQuote] = useState({
    text: "Start your spiritual journey with a quote from the Bhagavad Gita",
    chapter: "",
    verse: ""
  });
  const [loading, setLoading] = useState(false);

  const fetchQuoteWithRetry = async (retries = 3): Promise<any> => {
    try {
      const response = await fetch('https://bhagavadgitaapi.in/slok/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying... ${retries} attempts remaining`);
        await sleep(1000); // Wait 1 second before retrying
        return fetchQuoteWithRetry(retries - 1);
      }
      throw error;
    }
  };

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const data = await fetchQuoteWithRetry();
      setQuote({
        text: data.slok,
        chapter: data.chapter,
        verse: data.verse
      });
    } catch (error) {
      console.error('Error fetching quote:', error);
      setQuote(DEFAULT_QUOTE);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <Lotus className="w-12 h-12 text-orange-600" />
        </div>
        
        <h1 className="text-3xl font-serif text-orange-800 mb-8">
          Bhagavad Gita Wisdom
        </h1>

        <div className="bg-orange-50 rounded-lg p-6 mb-8 min-h-[200px] flex items-center justify-center">
          <div>
            <p className="text-xl text-gray-700 font-serif leading-relaxed mb-4">
              "{quote.text}"
            </p>
            {quote.chapter && quote.verse && (
              <p className="text-sm text-orange-600">
                Chapter {quote.chapter}, Verse {quote.verse}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={fetchQuote}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-8 py-3 rounded-full transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            "Receive Wisdom"
          )}
        </button>
      </div>
    </div>
  );
}

export default App;