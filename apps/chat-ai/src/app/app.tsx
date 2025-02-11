import { useState } from 'react';
import { MainLayout } from './components/layout';
import { LoaderCircle } from 'lucide-react';

interface IQuestion {
  message: string;
  answer: string;
}

export function App() {
  const [question, setQuestion] = useState(
    'в чем смысл жизни, напиши минимум 20 предложений'
  );

  const [items, setItems] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(false);

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

        // Функция для чтения порций данных
        function read() {
          reader
            .read()
            .then(({ done, value }) => {
              if (done) {
                console.log('Поток завершён');
                setLoading(false);
                return;
              }
              // Декодируем полученный фрагмент и выводим его в консоль
              const chunk = decoder.decode(value, { stream: true });
              const d = [...items];
              console.log(index);
              console.log(d);
              d[index].answer += chunk;
              setItems(d);
              console.log('Полученные данные:', chunk);
              // Рекурсивно считываем следующий фрагмент
              read();
            })
            .catch((error) => {
              console.error('Ошибка при чтении потока:', error);
            });
        }

        read();
      })
      .catch((error) => {
        console.error('Ошибка запроса:', error);
      });
  };

  const Send = async () => {
    setItems((prev) => {
      const newItems = [...prev, { message: question, answer: '' }];
      setData(newItems, newItems.length - 1, question);
      return newItems;
    });

    setQuestion('');
    setLoading(true);
  };

  return (
    <MainLayout>
      <div className="shadow-2xl p-4 flex flex-col justify-between w-full lg:w-2/3 bg-slate-300 text-slate-800 rounded-xl max-h-[calc(100vh-120px)] min-h-[calc(100vh-120px)]">
        <div className="h-full max-h-full overflow-y-auto">
          {items.map((item, index) => (
            <div key={index}>
              <div className="text-right p-2">{item.message}</div>
              <div className="text-left p-2">{item.answer}</div>
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
            disabled={loading}
            onClick={Send}
          >
            {loading ? (
              <div className="flex justify-center ">
                <LoaderCircle size={48} className="animate-spin" />
              </div>
            ) : (
              'Отправить'
            )}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default App;
