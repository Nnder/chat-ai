import { useCallback, useState } from 'react';
import { MainLayout } from './components/layout';
import { LoaderCircle } from 'lucide-react';
import { MessageItem } from './components/MessageItem';
import { useChat } from './hooks/useChat';

export function App() {
  const [question, setQuestion] = useState(
    'в чем смысл жизни, напиши минимум 4 предложения'
  );

  const { items, loading, sendMessage } = useChat();

  const Send = useCallback(() => {
    if (question.trim()) {
      sendMessage(question);
      setQuestion('');
    }
  }, [question, sendMessage]);

  return (
    <MainLayout>
      <div className="shadow-2xl p-4 flex flex-col justify-between w-full lg:w-2/3 bg-slate-300 text-slate-800 rounded-xl max-h-[calc(100vh-120px)] min-h-[calc(100vh-120px)]">
        <div className="h-full max-h-full overflow-y-auto pr-3">
          {items.map((item, index) => (
            <MessageItem key={index} item={item} />
          ))}
        </div>
        <div className="flex gap-4 flex-col md:flex-row">
          <textarea
            className="w-full p-2 text-lg text-slate-800 rounded-xl"
            aria-multiline
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          ></textarea>
          <button
            className="bg-slate-500 p-4 text-white font-bold rounded-xl w-full md:w-36 h-20"
            onClick={Send}
          >
            {loading ? (
              <div className="flex justify-center">
                <LoaderCircle size={48} className="animate-spin" />
              </div>
            ) : (
              ' Отправить'
            )}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default App;
