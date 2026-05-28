import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an unhandled fatal crash:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="max-w-md bg-slate-800 border-2 border-rose-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-rose-500 to-pink-500" />
            
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500 animate-pulse">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="text-xl font-extrabold tracking-tight text-white mb-2">
              Đã Xảy Ra Sự Cố Bất Ngờ
            </h1>
            
            <p className="text-sm text-slate-400 font-semibold mb-6">
              Ứng dụng gặp lỗi và không thể tiếp tục kết xuất. Hãy nhấn vào nút tải lại bên dưới để làm mới tài nguyên kết nối.
            </p>

            {this.state.error && (
              <div className="bg-slate-950 border border-slate-700/50 rounded-2xl p-4 mb-6 text-left overflow-auto max-h-36">
                <code className="text-xs text-rose-400 font-mono leading-relaxed block break-all whitespace-pre-wrap">
                  {this.state.error.stack || this.state.error.message}
                </code>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90 active:scale-98 text-white font-black text-sm px-5 py-3 rounded-2xl transition cursor-pointer shadow-lg shadow-pink-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Khởi động lại ứng dụng</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
