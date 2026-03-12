const findFormError = (errors, form, setTooltip) => {
    const fieldErrors = errors.errors || errors;
    for (let element of form.elements) {
      if (element.name && fieldErrors[element.name]) {
      let errorMessage = fieldErrors[element.name];
    
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage[0];
      }
      
      setTooltip({
        error: errorMessage,
        element: element
      });
      return; 
    }
  }
  
  setTooltip({
    error: 'Ошибка валидации. Проверьте все поля.',
    element: form
  });
};

export default findFormError;