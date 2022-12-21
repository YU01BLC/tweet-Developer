import React, { Component, ErrorInfo, ReactNode } from 'react';
import sorryIcon from '../image/sorry.png';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public static componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    return { errorText: error, errorInfoText: errorInfo };
  }

  public render() {
    if (this.state.hasError) {
      const sorryIconUrl: string = sorryIcon;
      return (
        <div style={{ margin: '5%' }}>
          <h1>Sorry.. there was an error</h1>
          <p>Please check the console log.</p>
          <img src={sorryIconUrl} alt='謝罪画像' style={{ width: '50%' }} />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
