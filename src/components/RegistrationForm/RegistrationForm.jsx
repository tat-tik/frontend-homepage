import './RegistrationForm.css';
import { useState, useRef } from 'react';
import Tooltip from '../Tooltip/Tooltip';
import validateForm from '../CustomHooks/validateForm';
import useRequest from "../CustomHooks/useRequest"
import useDispatching from "../CustomHooks/useDispatching";
import getCookie  from "../CustomHooks/getCookie";
import findFormError  from "../CustomHooks/findFormError";

function RegistrationForm() {
  const form = useRef(null);
  const { request }= useRequest();
  const { dispatching }= useDispatching();
  const[tooltip, setTooltip]=useState({error: '', element: ''});
  const[stateForm, setStateForm]=useState({username: '', first_name: '', email: '', password: ''});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const patternsInput = {
    username: /^(?=.{4,20}$)[A-Za-z]+[A-Za-z0-9]*$/, 
    first_name: /^(?=.{2,20}$)[A-Za-zА-Яа-я]+$/, 
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()\-_+=;:,.\/?\\|`~[\]{}]{8,}$/, 
  }
  const errors = {
    username: {
      customError: 'Логин не удовлетворяет требованиям',
      tooShort: 'Логин слишком короткий',
      valueMissing: 'Введите логин',
    },
    first_name: {
      customError: 'Имя не удовлетворяет требованиям',
      tooShort: 'Имя слишком короткое',
      valueMissing: 'Представьтесь, пожалуйста!',
    },
    email: {
      customError: 'E-mail не удовлетворяет требованиям',
      valueMissing: 'Введите Ваш e-mail',
      typeMismatch: 'Проверьте правильность e-mail',
    },
    password: {
      customError: 'Пароль не удовлетворяет требованиям',
      tooShort: 'Пароль слишком короткий',
      valueMissing: 'Введите пароль',
      patternMismatch: 'Пароль не соответствует требованиям безопасности',
    },
  }

  const handleState = (e) => {
    let {name, value} = e.target;
    switch (name) {
      case 'username':
      case 'first_name':
        if (value.length <= 20) {
          setStateForm((prevForm) => ({...prevForm, [name]: value}));
        }
        break;
    default:
        setStateForm((prevForm) => ({...prevForm, [name]: value}));       
    }
  }

    const handleSubmit = async(e) => {
    e.preventDefault();
    
    if(validateForm(form.current, errors, stateForm, setStateForm, setTooltip, patternsInput)) {
      let formData = new FormData(e.target);
      setLoading(true);
      setServerError('');
      setTooltip({error: '', element: ''});
      
      try {
        const result = await request(
          'POST', 
          '/api/user/reg/', 
          Object.fromEntries(formData), 
          getCookie('csrftoken')
        );
        
        if(result['errors']) {
          findFormError(result['errors'], form.current, setTooltip);
          return;
        }
        
        if(result['status login']) {
          dispatching(
            result['status login'], 
            result['admin'], 
            result['user'], 
            result['storage'], 
            getCookie('csrftoken')
          );
        }
        
      } catch (error) {
        console.error('Ошибка подключения:', error);
        setTooltip({
        error: 'Ошибка сервера. Проверьте подключение.',
        element: form.current
      });
      
        
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="registration">
      <div className='form'>
        <form onSubmit={handleSubmit} noValidate ref={form}>
          <div className="input__box reg">
            <label className='label-input reg' htmlFor="username">
              <div className='label-title'>Логин:</div>
              <div className='label-hint'>(Латинские буквы и цифры, первый символ — буква, длина от 4 до 20 символов)</div>
            </label>
            <input className='input-text' type="text" value={stateForm.username}  id="username" name="username" placeholder="Введите имя пользователя" minLength="4" maxLength="20" onInput={handleState} required />
          </div>
          <div className="input__box reg">
            <label className='label-input reg' htmlFor="first_name">
              <div className='label-title'>Имя:</div>
              <div className='label-hint'>(Только латинские или русские буквы, длина от 2 до 20 символов)</div>
            </label>
            <input className='input-text' type="text" value={stateForm.first_name} id="first_name" name="first_name" placeholder="Введите полное имя" minLength="2" maxLength="20" onInput={handleState} required />
          </div>
          <div className="input__box reg">
            <label className='label-input reg' htmlFor="email">
              <div className='label-title'>E-mail:</div>
            </label>
            <input className='input-text' type="email" value={stateForm.email} id="email" name="email" placeholder="Введите E-mail" onInput={handleState} required />
          </div>
          <div className="input__box reg">
            <label className='label-input reg' htmlFor="password">
              <div className='label-title'>Пароль:</div>
              <div className='label-hint'>(Не менее 6 символов: как минимум одна заглавная буква, одна цифра и один специальный символ)</div>
            </label>
            <input className='input-text' type="password" value={stateForm.password} id="password" name="password" placeholder="Введите пароль"  onInput={handleState}  />
          </div>
          <div className='submit'>
            <input className='btn-submit' type="submit" value='СОХРАНИТЬ' />
          </div>
        </form>
        </div>

        {tooltip.error !== '' ? <Tooltip message={tooltip.error} element={tooltip.element} /> : ''}
    </div>
  )
}

export default RegistrationForm;