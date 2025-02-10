import { PropsWithChildren } from 'react';

export const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="p-4 flex flex-col w-full h-full justify-center items-center">
      <div className="p-4 font-bold text-xl text-slate-800">Чат с AI</div>
      {children}
    </div>
  );
};
