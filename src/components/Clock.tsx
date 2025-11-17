import { useEffect, useState } from "react";

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center space-y-1">
      <div className="text-5xl font-bold tracking-tight text-foreground" style={{ letterSpacing: '-0.06em' }}>
        {time.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        })}
      </div>
      <div className="text-sm text-muted-foreground">
        {time.toLocaleDateString('pt-BR', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long',
          year: 'numeric'
        })}
      </div>
    </div>
  );
}
