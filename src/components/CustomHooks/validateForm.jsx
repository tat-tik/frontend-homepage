function validateForm (form, errors, stateForm, setStateForm, setTooltip, patternsInput = false) { 
  const stateF = {};
  for (let name in stateForm) {
    stateF[name] = String(stateForm[name]).trim();
    
  }
  setStateForm(stateF);
  setTooltip({error: '', element: ''});

  const elements = form.elements;
  [...elements].some(element => {
    element.setCustomValidity('');
    const error = getError(element, patternsInput, errors, stateF);
    if (error) {
      setTooltip({error, element});
      return true;
    } 
  });
  return form.checkValidity();
}

function getError(el, patternsInput, errors, stateForm) {
  if (!el.name) return;
  const errorKey = Object.keys(ValidityState.prototype).find((key) => {
      if (key === 'valid') return;
      return el.validity[key];
  });
  if(!errorKey) {
    if(patternsInput && !patternsInput[el.name].test(stateForm[el.name])){
      el.setCustomValidity(errors[el.name]['customError']);
      return errors[el.name]['customError'];
    }
    return;
  }
  return errors[el.name][errorKey];
};

export default validateForm;