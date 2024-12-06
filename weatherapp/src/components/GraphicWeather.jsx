import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Alert } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './GraphicWeather.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function GraphicWeather({ lat, lon }) {
  const [tempData, setTempData] = useState(null);
  const [advice, setAdvice] = useState('');

  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=91bd6826b018c209080e0d7dab93d4e3&units=metric&lang=it`
        );
        const data = await response.json();
        
        // Filtra solo i dati di oggi
        const today = new Date().toISOString().split('T')[0];
        const todayData = data.list.filter(item => 
          item.dt_txt.split(' ')[0] === today
        );

        setTempData(todayData);
        
        // Calcola la temperatura media
        const avgTemp = todayData.reduce((acc, curr) => 
          acc + curr.main.temp, 0) / todayData.length;
        
        // Genera consigli in base alla temperatura media
        if (avgTemp >= 25) {
          setAdvice('🌊 È ora di andare al mare! Prepara l\'ombrellone, la crema solare e tanta acqua fresca. Non dimenticare di idratati frequentemente!');
        } else if (avgTemp >= 15 && avgTemp < 25) {
          setAdvice('🌸 Temperatura primaverile perfetta! Togli la giacca, è il momento ideale per una passeggiata al parco o un pic-nic all\'aria aperta.');
        } else {
          setAdvice('☕ Torna a casa! Con queste temperature è il momento perfetto per una cioccolata calda con panna e un bel letargo sotto il plaid.');
        }
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
      }
    };

    fetchDailyData();
  }, [lat, lon]);

  if (!tempData) {
    return <div>Caricamento...</div>;
  }

  const chartData = {
    labels: tempData.map(item => item.dt_txt.split(' ')[1].slice(0, 5)),
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: tempData.map(item => item.main.temp),
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#000',
        titleFont: {
          size: 16,
          weight: 'bold'
        },
        bodyFont: {
          size: 14
        },
        padding: 12,
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          title: (items) => {
            return `Ore ${items[0].label}`;
          },
          label: (item) => {
            return `${item.formattedValue}°C`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12
          },
          callback: (value) => `${value}°`
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        fill: 'start',
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      },
      point: {
        radius: 6,
        hitRadius: 6,
        borderWidth: 3,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderColor: 'rgba(255, 255, 255, 0.8)',
        hoverRadius: 8,
        hoverBorderWidth: 4
      }
    }
  };

  return (
    <div className="graphic-weather">
      <h3>Andamento Temperatura</h3>
      <div className="chart-container">
        <Line data={chartData} options={options} />
      </div>
      <Alert variant="info">
        <strong>Consiglio del giorno</strong> {advice}
      </Alert>
    </div>
  );
}

export default GraphicWeather;
