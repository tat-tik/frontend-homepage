import './ProgressBar.css';

function ProgressBar({ progress }) {
  const percent = typeof progress === 'number' && !isNaN(progress) ? progress : 0;
  
  return (
    <div className='progress-bar'>
      <div 
        className='progress' 
        style={{ width: percent + '%' }}
      >
        {percent > 0 && <span>{percent}%</span>}
      </div>
    </div>
  );
}

export default ProgressBar;