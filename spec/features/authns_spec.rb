require 'rails_helper'

RSpec.feature "Authns", type: :feature, js: true do
  include_context "db_cleanup_each"
  let(:user_props) { FactoryGirl.attributes_for(:user) }

  feature "sign-up" do
    context "valid registration" do
      scenario "creates account and navigates away from sign-up page" do
        start_time = Time.now
        signup user_props

        expect(page).to have_no_css("#signup-form")
        user = User.where(:email=>user_props[:email]).first
        expect(user.created_at).to be > start_time
      end
    end
    context "rejected registration" do
      before(:each) do
        signup user_props
        expect(page).to have_no_css("#signup-form")
      end

      scenario "account not created and stays on page" do
        dup_user = FactoryGirl.attributes_for(:user, :email=>user_props[:email])
        signup dup_user, false # should get rejected by server

        expect(User.where(:email=>user_props[:email], :name=>user_props[:name])).to exist
        expect(User.where(:email=>dup_user[:email], :name=>dup_user[:name])).to_not exist

        expect(page).to have_css("#signup-form")
        expect(page).to have_button("Sign Up")
      end

      scenario "displays error messages" do
        bad_props = FactoryGirl.attributes_for(:user,
                                               :email=>user_props[:email],
                                               :password=>"123")
                                        .merge(:password_confirmation=>"abc")
        signup bad_props, false

        #//*[@id="signup-form"]/div[1]/div/p[2]/span
        #signup-form > div.alert > div > p > span.invalid
        #displays error information
        expect(page).to have_xpath("//*[@id='signup-form']//span[contains(@class,'invalid')]",
                                 :text=>"Password confirmation doesn't match Password")
        expect(page).to have_xpath("//*[@id='signup-form']//span[contains(@class,'invalid')]",
                                 :text=>"Password is too short")
        expect(page).to have_xpath("//*[@id='signup-form']//span[contains(@class,'invalid')]",
                                 :text=>"Email has already been taken")

        expect(page).to have_xpath("//*[@id='signup-email']//span[contains(@class,'invalid')]",
                                 :text=>"has already been taken")
        expect(page).to have_xpath("//*[@id='signup-password']//span[contains(@class,'invalid')]",
                                 :text=>"too short")
        within("#signup-password_confirmation") do
          expect(page).to have_css("span.invalid",:text=>"doesn't match")
        end
      end
    end
    context "invalid field" do
      after(:each) do
        within("#signup-form") do
          expect(page).to have_button("Sign Up", disabled: true)
        end
      end

      scenario "bad email" do
        fillin_signup FactoryGirl.attributes_for(:user, email: "yadayadayada")
        expect(page).to have_css("input[name='signup-email'].ng-invalid-email")
      end
      scenario "missing password" do
        fillin_signup FactoryGirl.attributes_for(:user, password: nil)
        expect(page).to have_css("input[name='signup-password'].ng-invalid-required")
        expect(page).to have_css("input[name='signup-password_confirmation'].ng-invalid-required")
      end
    end
  end

  feature "anonymous user" do
    scenario "shown login form"
  end

  feature "login" do
    context "valid user login" do
      scenario "closes form and displays current user name"
      scenario "menu shows logout option"
      scenario "can access authenticated resources"
    end
    context "invalid login" do
      scenario "displays error message and leaves user unauthenticated"
    end
  end

  feature "logout" do
    scenario "closes form and removes user name"
    scenario "can no longer access authenticated resources"
  end
end
