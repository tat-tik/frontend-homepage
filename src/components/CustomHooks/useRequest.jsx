
function useRequest() {
  const request = async (method, url, data = null, csrftoken = null) => {
    
    const baseUrl = import.meta.env.VITE_SERVER_HOST || 'http://localhost:8000';
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    
    console.log('Request URL:', fullUrl);
    console.log('Request Method:', method);
    console.log('Request Data:', data);
         
    const opt = {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: method,
    }
    
    if(data) {
      opt['body'] = JSON.stringify(data)
    }
    
    if(csrftoken) {
      opt.headers['X-CSRFToken'] = csrftoken
    }
    
    try {
      const response = await fetch(fullUrl, opt)
     
      let responseData;
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json()
      } else {
        responseData = await response.text()
      }
      
      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`)
        error.status = response.status
        error.data = responseData 
        throw error
      }
      
      return responseData
      
    } catch (error) {
      console.error('Request failed:', error)
      if (error.data) {
        console.error('Server error details:', error.data)
      }
      throw error
    }
  }

  return { request }
}

export default useRequest
