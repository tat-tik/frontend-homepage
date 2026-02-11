function useRequest() {
  const request = async (method, url, data = false, csrftoken = false) => {
    
    const baseUrl = import.meta.env.VITE_SERVER_HOST || 'http://localhost:8000'
    
   
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
    
    console.log('Request URL:', fullUrl) // Для отладки
    console.log('Base URL:', baseUrl) // Для отладки
    
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
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
    
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        return await response.text()
      }
      
    } catch (error) {
      console.error('Request failed:', error)
      throw error
    }
  }

  return { request }
}

export default useRequest