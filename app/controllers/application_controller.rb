class ApplicationController < ActionController::Base
    skip_before_action :verify_authenticity_token
    helper_method :current_user
    helper_method :logged_in?

    def current_user
        return nil if session[:session_token].nil?
        @current_user ||= User.find_by_session_token(session[:session_token])
    end

    def login(user)
        @current_user = user
        session[:session_token] = user.reset_session_token
    end

    def logout
        current_user.reset_session_token
        session[:session_token] = nil
    end

    def logged_in?
        !!current_user
    end

    def require_current_user
        render json: ["Invalid Credentials"] if current_user.nil?
    end
end
