const findFormError = (errors, form, setTooltip) => {
  [...form.elements].some(element => {
    if(element.name === Object.keys(errors)[0]){
      setTooltip({error: Object.values(errors)[0], element: element});
      return true;
    } 
  });
}

export default findFormError;