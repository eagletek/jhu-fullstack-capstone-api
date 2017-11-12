Rails.application.routes.draw do
  get 'authn/whoami'

  get 'authn/checkme'

  mount_devise_token_auth_for 'User', at: 'auth'
  root 'ui#index'
  get '/ui' => 'ui#index'
  get '/ui#' => 'ui#index'

  scope :api, defaults: {format: :json} do
    resources :cities, except: [:new, :edit]
    resources :states, except: [:new, :edit]
  end
end
