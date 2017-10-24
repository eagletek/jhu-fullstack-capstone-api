Rails.application.routes.draw do
  root 'ui#index'
  get '/ui' => 'ui#index'
  get '/ui#' => 'ui#index'

end
