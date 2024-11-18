"use client";
import React, { Component, ReactNode, ErrorInfo } from "react";

interface Props {
   children: ReactNode;
}

interface State {
   hasError: boolean;
   error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
   constructor(props: Props) {
      super(props);
      this.state = { hasError: false, error: null };
   }

   static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
   }

   componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error("ErrorBoundary caught an error", error, errorInfo);
   }

   resetErrorBoundary = () => {
      this.setState({ hasError: false, error: null });
   };

   render() {
      if (this.state.hasError) {
         return (
            <div role="alert">
               <p>Something went wrong:</p>
               <pre>{this.state.error?.message}</pre>
               <button onClick={this.resetErrorBoundary}>Try again</button>
            </div>
         );
      }

      return this.props.children;
   }
}

export default ErrorBoundary;
