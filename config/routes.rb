Rails.application.routes.draw do
  get 'book' => 'home#book'
  root 'home#index'
end
