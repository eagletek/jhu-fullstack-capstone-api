require 'rails_helper'

RSpec.describe "Authentication Api", type: :request do
  include_context "db_cleanup_each", :transaction
  let(:user_props) { FactoryGirl.attributes_for(:user) }

  context 'signup' do
    context 'with valid registration' do
      it "successfully creates account" do
        signup user_props

        payload=parsed_body
        expect(payload).to include("status"=>"success")
        expect(payload).to include("data")
        expect(payload['data']).to include("id")
        expect(payload['data']).to include("provider"=>"email")
        expect(payload['data']).to include("uid"=>user_props[:email])
        expect(payload['data']).to include("name"=>user_props[:name])
        expect(payload['data']).to include("email"=>user_props[:email])
        expect(payload['data']).to include("created_at", "updated_at")
      end
    end

    context 'with invalid registration' do
      context 'missing content' do
        it "reports error with messages" do
          signup user_props.except(:email), :unprocessable_entity

          payload = parsed_body
          expect(payload).to include("status"=>"error")
          expect(payload).to include("data")
          expect(payload['data']).to include("email"=>nil)
          expect(payload['errors']).to include("email")
          expect(payload['errors']).to include("full_messages")
          expect(payload['errors']['full_messages']).to include(/Email/i)
        end
      end

      context 'non-unique information' do
        it "reports non-unique email" do
          signup user_props
          signup user_props, :unprocessable_entity

          payload = parsed_body
          expect(payload).to include("status"=>"error")
          expect(payload).to include("data")
          expect(payload['data']).to include("created_at"=>nil)
          expect(payload['errors']).to include("email")
          expect(payload['errors']).to include("full_messages")
          expect(payload['errors']['full_messages']).to include(/taken/i)
        end
      end
    end
  end

  context 'anonymous user' do
    it "accesses unprotected resources" do
      get authn_whoami_path
      expect(response).to have_http_status(:ok)
      expect(parsed_body).to eq({})
    end

    it "fails to access protected resources" do
      get authn_checkme_path
      expect(response).to have_http_status(:unauthorized)
      expect(parsed_body).to include("errors"=>["You need to sign in or sign up before continuing."])
    end
  end

  context 'login' do
    context 'with valid credentials' do
      let(:account) { signup user_props, :ok }
      let!(:user) { login account, :ok }

      it "generates access token" do
        expect(response.headers).to include("uid"=>account[:uid])
        expect(response.headers).to include("access-token")
        expect(response.headers).to include("client")
        expect(response.headers).to include("token-type"=>"Bearer")
      end

      it "extracts access headers" do
        expect(access_tokens?).to be true
        expect(access_tokens).to include("uid"=>account[:uid])
        expect(access_tokens).to include("access-token")
        expect(access_tokens).to include("client")
        expect(access_tokens).to include("token-type"=>"Bearer")
      end

      it "grants access to resource" do
        jget authn_checkme_path
        expect(response).to have_http_status(:ok)

        payload=parsed_body
        expect(payload).to include("id"=>account[:id])
        expect(payload).to include("uid"=>account[:uid])
      end

      it "grants access to resource multiple times" do
        (1..10).each do |idx|
          jget authn_checkme_path
          expect(response).to have_http_status(:ok)
        end
      end

      it "can logout" do
        logout :ok
        expect(access_tokens?).to be false

        jget authn_checkme_path
        expect(response).to have_http_status(:unauthorized)
      end

    end

    context 'with invalid credentials' do
      let(:account) { signup user_props, :ok }

      it "rejects credentials" do
        account[:password] = "password"
        payload = login account, :unauthorized
        expect(payload).to include("errors")
        expect(payload["errors"]).to include(/Invalid login credentials/)
      end
    end
  end

end
