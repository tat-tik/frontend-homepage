import './FieldInputEditor.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function FieldInputEditor({ statusField, setStatusField, object, setObject }) {
  const [state, setState] = useState({input: object[statusField.field_edit] || ''});
  const [typeField, setTypeField] = useState(
    statusField.field_edit === 'password' ? 'password' : 
    statusField.field_edit === 'email' ? 'email' : 'text'
  );
  const [passViewIcon, setPassViewIcon] = useState(<FontAwesomeIcon icon="eye" />);

  const handleState = (e) => {
    const { value } = e.target;
    setState({input: value});
  }

  const handlePassView = (e) => {
    e.stopPropagation();
    if(typeField === 'password') {
      setTypeField('text');
      setPassViewIcon(<FontAwesomeIcon icon="eye-slash" />);
    } else {
      setTypeField('password');
      setPassViewIcon(<FontAwesomeIcon icon="eye" />);
    }
  }

  // Временно сохраняем значение в локальном состоянии, но НЕ обновляем object
  const handleSave = (e) => {
    e.stopPropagation();
    const name = statusField.field_edit;
    console.log('FieldInputEditor saving temporary:', name, state.input);
    
    // Просто обновляем объект через setObject, но НЕ закрываем редактор
    if (name.includes('comment')) {
      const fieldName = name.includes('_') ? name.split('_')[0] : name;
      setObject({...object, [fieldName]: state.input});
    } else if (name.includes('file_name')) {
      setObject({...object, file_name: state.input});
    } else {
      setObject({...object, [name]: state.input});
    }
    
    // НЕ закрываем редактор! Оставляем statusField как есть
    // setStatusField({...statusField, status_edit: false, field_edit: ''});
  }

  const handleClose = (e) => {
    e.stopPropagation();
    setStatusField({...statusField, status_edit: false, field_edit: ''});
  }
  
  return (
    <div className="field-input__box">
      <input 
        className='field-input-text' 
        type={typeField} 
        value={state.input} 
        id="input" 
        name="input" 
        style={statusField.field_edit === 'password' ? {paddingRight: "3rem"} : {}} 
        onChange={handleState} 
        onClick={(e) => e.stopPropagation()} 
        autoFocus 
        required 
      />
      {statusField.field_edit === 'password' && (
        <span className='field-input-pass-view' onClick={handlePassView}>
          {passViewIcon}
        </span>
      )}
      {/* Временно сохраняем, но не закрываем */}
      <span className='field-input-save' onClick={handleSave} title="Применить">✓</span>
      <span className='field-input-close' onClick={handleClose} title="Отмена">✖</span>
    </div>
  )
}

export default FieldInputEditor;