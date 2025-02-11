import { LoaderCircle } from 'lucide-react';
import { IMessage } from '../types/types';

export const MessageItem = ({ item }: { item: IMessage }) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="text-right p-2">{item.message}</div>
      <div className="text-left p-2">{item.answer}</div>
      {item.status === 'loading' && (
        <div>
          <LoaderCircle size={48} className="animate-spin" />
        </div>
      )}
      {item.status === 'error' && <div>{item?.errorMessage ?? 'Ошибка'}</div>}
    </div>
  );
};
