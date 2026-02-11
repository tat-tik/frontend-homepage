import React from 'react'
import './ErrorBoundary.css'

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Что-то пошло не так</h2>
          <p>Пожалуйста перезагрузите страницу</p>
          <button onClick={this.handleReload}>
            Перезагрузить страницу
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary