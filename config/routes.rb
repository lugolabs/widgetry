Rails.application.routes.draw do
  get 'gumroad' => 'home#gumroad'
  root 'home#index'
end
