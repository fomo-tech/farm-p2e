import { useEffect, useState } from "react";

interface FloatingItem {
  id: number;
  amount: number;
}

export default function useFloatingMoney(income: number) {
  const [items, setItems] = useState<FloatingItem[]>([]);

  const addMoney = (amount: number) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, amount }]);

    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 1000);
  };

  useEffect(() => {
    if (!income) return;

    const interval = setInterval(() => {
      addMoney(income);
    }, 1000);

    return () => clearInterval(interval);
  }, [income]);

  return { items, addMoney };
}
