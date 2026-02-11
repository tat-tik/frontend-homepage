import './Tooltip.css';
import { useEffect, useState, useRef } from 'react';

function Tooltip({message, element}) {
  const ref = useRef();
  const [styles, setStyles] = useState({left: '', top: '', visibility: 'hidden'});
  const { right, top } = element.getBoundingClientRect();
  useEffect(() => {
    setStyles((styles) => ({...styles, left: right + 5 + 'px', top: top + element.offsetHeight / 2 - ref.current.offsetHeight / 2 + 'px', visibility: 'visible'}));
  }, [message, element]);

  return (
    <div className='tooltip' style={styles} ref={ref}>
      {message}
    </div>
  )
}

export default Tooltip;