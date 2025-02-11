import { useCallback, useState } from "react";
import { IMessage, MessageStatus } from "../types/types";

export const useChat = () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<IMessage[]>([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
  
    const setData = useCallback(async (items: IMessage[], index: number, question: string) => {
      try {
        const response = await fetch(`${backendUrl}/api/chat/question`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json;charset=utf-8' },
          body: JSON.stringify({ question }),
        });
  
        if (!response.body) throw new Error('No response body');
  
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
  
        const read = async () => {
          const { done, value } = await reader.read();
          const newItems = [...items];
  
          if (done) {
            newItems[index].status = 'loaded';
            setItems(newItems);
            setLoading(false);
            return;
          }
  
          const chunk = decoder.decode(value, { stream: true });
          newItems[index].answer += chunk;
          setItems(newItems);
          read();
        };
  
        read();
      } catch (error) {
        const newItems = [...items];
        newItems[index].status = 'error';
        newItems[index].errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setItems(newItems);
        setLoading(false);
      }
    }, []);
  
    const sendMessage = useCallback(async (question: string) => {
      setLoading(true);
      setItems((prev) => {
        const newItems = [
          ...prev,
          { message: question, answer: '', status: 'loading' as MessageStatus },
        ];
        setData(newItems, newItems.length - 1, question);
        return newItems;
      });
    }, [setData]);
  
    return { loading, items, sendMessage };
  };