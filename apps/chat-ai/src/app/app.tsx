import { useState } from 'react';
import { MainLayout } from './components/layout';
import { LoaderCircle } from 'lucide-react';

type QuestionStatus = 'error' | 'loading' | 'loaded';
interface IQuestion {
  message: string;
  answer: string;
  status: QuestionStatus;
  errorMessage?: string;
}

export function App() {
  const [question, setQuestion] = useState(
    'в чем смысл жизни, напиши минимум 4 предложения'
  );

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<IQuestion[]>([]);

  const setData = async (
    items: IQuestion[],
    index: number,
    question: string
  ) => {
    fetch('http://localhost:3000/api/chat/question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ question }),
    })
      .then((response) => {
        // Получаем reader для обработки потока
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        function read() {
          const d = [...items];
          reader
            .read()
            .then(({ done, value }) => {
              if (done) {
                d[index].status = 'loaded';
                console.log('Поток завершён', d[index].status);
                setItems(d);
                setLoading(false);
                return;
              }
              const chunk = decoder.decode(value, { stream: true });
              d[index].answer += chunk;
              setItems(d);
              read();
            })
            .catch((error) => {
              d[index].status = 'error';
              d[index].errorMessage = error.message;
              setLoading(false);
            });
        }

        read();
      })
      .catch((error) => {
        items[index].status = 'error';
        items[index].errorMessage = error.message;
        setItems(items);
        setLoading(false);
      });
  };

  const Send = async () => {
    setLoading(true);
    setItems((prev) => {
      const newItems = [
        ...prev,
        { message: question, answer: '', status: 'loading' as QuestionStatus },
      ];
      setData(newItems, newItems.length - 1, question);
      return newItems;
    });
    setQuestion('');
  };

  return (
    <MainLayout>
      <div className="shadow-2xl p-4 flex flex-col justify-between w-full lg:w-2/3 bg-slate-300 text-slate-800 rounded-xl max-h-[calc(100vh-120px)] min-h-[calc(100vh-120px)]">
        <div className="h-full max-h-full overflow-y-auto pr-3">
          {items.map((item, index) => (
            <div key={index} className="h-full flex flex-col overflow-hidden">
              <div className="text-right p-2">{item.message}</div>
              <div className="text-left p-2">{item.answer}</div>
              {item.status === 'loading' && (
                <div>
                  <LoaderCircle size={48} className="animate-spin" />
                </div>
              )}
              {item.status === 'error' && (
                <div>{item?.errorMessage ?? 'Ошибка'}</div>
              )}
            </div>
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
            disabled={loading}
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
