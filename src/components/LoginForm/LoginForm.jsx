import './LoginForm.css';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router'; 
import Tooltip from '../Tooltip/Tooltip';
import validateForm from '../CustomHooks/validateForm';
import useRequest from "../CustomHooks/useRequest"
import useDispatching from "../CustomHooks/useDispatching";
import getCookie  from "../CustomHooks/getCookie";
import findFormError  from "../CustomHooks/findFormError";

function LoginForm() {
  const form = useRef(null);
  const navigate = useNavigate(); 
  const { request } = useRequest();
  const { dispatching } = useDispatching();
  const [stateForm, setStateForm] = useState({username: '', password: ''});
  const [tooltip, setTooltip] = useState({error: '', element: ''});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const patternsInput = {
    username: /^(?=.{4,20}$)[A-Za-z]+[A-Za-z0-9]*$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()\-_+=;:,.\/?\\|`~[\]{}]{8,}$/
  }

  const errors = {
    username: {
      customError: 'Логин не удовлетворяет требованиям',
      valueMissing: 'Введите логин',
    },
    password: {
      customError: 'Пароль не удовлетворяет требованиям',
      valueMissing: 'Введите пароль',
    },
  }

  const handleState = (e) => {
    const {name, value} = e.target;
    switch (name) {
      case 'username':
        if (value.length <= 20) {
          setStateForm((prevForm) => ({...prevForm, [name]: value}));
        }
        break;
      default:
        setStateForm((prevForm) => ({...prevForm, [name]: value}));       
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTooltip({error: '', element: ''});
     
    if(validateForm(form.current, errors, stateForm, setStateForm, setTooltip, patternsInput)) {
      let formData = new FormData(e.target);
      setLoading(true);
      
      try {
        const result = await request(
          'POST', 
          '/api/users/login/', 
          Object.fromEntries(formData), 
          getCookie('csrftoken')
        );
                
        if(result && result.errors) {
          findFormError(result.errors, form.current, setTooltip);
          return;
        }
        
        if(result && result['status login']) {
          dispatching(
            true,                          
            result['admin'],                
            result['user'],                
            result['storage'],               
            getCookie('csrftoken')           
          );

          navigate('/panel');
          
        } else {
          setError('Неизвестная ошибка сервера');
        }
        
      } catch (error) {
        console.error('Login error:', error);
        
        if (error.data && error.data.errors) {
          findFormError(error.data.errors, form.current, setTooltip);
        } else {
          setTooltip({
            error: 'Ошибка сервера. Проверьте подключение.',
            element: form.current
          });
        }
        
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="login">
      <div className='form'>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} noValidate ref={form}>
          <div className="input__box">
            <label className='label-input' htmlFor="username">
              <div className='label-title'>Логин:</div>
            </label>
            <input 
              className='input-text' 
              type="text" 
              value={stateForm.username}  
              id="username" 
              name="username" 
              placeholder="Введите имя пользователя" 
              minLength="1" 
              onInput={handleState} 
              required 
              disabled={loading}
            />
          </div>
          <div className="input__box">
            <label className='label-input' htmlFor="password">
              <div className='label-title'>Пароль:</div>
            </label>
            <input 
              className='input-text' 
              type="password" 
              value={stateForm.password} 
              id="password" 
              name="password" 
              placeholder="Введите пароль" 
              minLength="1" 
              onInput={handleState} 
              required 
              disabled={loading}
            />
          </div>
          <div className='submit'>
            <input 
              className='btn-submit' 
              type="submit" 
              value={loading ? 'Вход...' : 'OK'} 
              disabled={loading}
            />
          </div>
        </form>
      </div> 
      {tooltip.error !== '' && <Tooltip message={tooltip.error} element={tooltip.element} />}
    </div>
  )
}

export default LoginForm;