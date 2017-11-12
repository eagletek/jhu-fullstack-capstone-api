require 'rails_helper'

RSpec.describe "Authentication Api", type: :request do

  context 'signup' do
    context 'with valid registration' do
      it "successfully creates account"
    end

    context 'with invalid registration' do
      context 'missing content' do
        it "reports error with messages"
      end

      context 'non-unique information' do
        it "reports non-unique email"
      end
    end
  end

  context 'anonymous user' do
    it "accesses unprotected resources"
    it "fails to access protected resources"
  end

  context 'login' do
    context 'with valid credentials' do
      it "generates access token"
      it "grants access to resource"
      it "grants access to resource multiple times"
      it "can logout"
    end

    context 'with invalid credentials' do
      it "rejects credentials"
    end
  end

end
