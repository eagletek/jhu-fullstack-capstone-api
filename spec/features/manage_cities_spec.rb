require 'rails_helper'
require 'support/city_ui_helper.rb'

RSpec.feature "ManageCities", type: :feature, :js=>true do
  include_context "db_cleanup_each"
  include CityUiHelper
  CITY_FORM_XPATH=CityUiHelper::CITY_FORM_XPATH
  CITY_LIST_XPATH=CityUiHelper::CITY_LIST_XPATH
  let(:city_state) { FactoryGirl.attributes_for(:city) }

  feature "view existing Cities" do
    let(:cities) { (1..5).map{ FactoryGirl.create(:city) }.sort_by {|v| v["name"]} }

    scenario "when no instances exist" do
      visit root_path
      within(:xpath,CITY_LIST_XPATH) do     #<== waits for a tag
        expect(page).to have_no_css("a.list-group-item")  #<== waits for div a.list-group-item tag
        expect(page).to have_css("a.list-group-item", count:0) #<== waits for div a.list-group-item tag
        expect(all("a.list-group-item").size).to eq(0) #<== no wait
      end
    end

    scenario "when instances exist" do
      visit root_path  if cities   #need to touch collection before hitting page
      within(:xpath,CITY_LIST_XPATH) do
        expect(page).to have_css("a.list-group-item:nth-child(#{cities.count})") #<== waits for a.list-group-item(5)
        expect(page).to have_css("a.list-group-item", count:cities.count)        #<== waits for div a.list-group-item tag
        expect(all("a.list-group-item").size).to eq(cities.count)                #<== no wait
        cities.each_with_index do |city, idx|
          expect(page).to have_css("a.list-group-item:nth-child(#{idx+1})", :text=>city.name)
        end
      end
    end
  end

  feature "add new City" do
    background(:each) do
      visit root_path
      expect(page).to have_css("h3", text:"Cities") #on the Cities page
      expect(page).to have_css("a.list-group-item", count:0)      #nothing listed
    end

    scenario "has input form" do
      expect(page).to have_css("label", :text=>"Name:")
      expect(page).to have_css("input[name='name'][ng-model*='city.name']")
      expect(page).to have_css("button[ng-click*='create()']", :text=>"Add City")
      expect(page).to have_button("Add City")
    end

    scenario "complete form" do
      within(:xpath,CITY_FORM_XPATH) do
        fill_in("name", :with=>city_state[:name])
        click_button("Add City")
      end
      within(:xpath,CITY_LIST_XPATH) do
        using_wait_time 5 do
          expect(page).to have_css("a.list-group-item", count:1)
          expect(page).to have_content(city_state[:name])
        end
      end
    end

    scenario "complete form with XPath" do
      #find(:xpath, "//input[@ng-model='citiesVM.city.name']").set(city_state[:name])
      #find(:xpath, "//button[@ng-click='citiesVM.create()']").click
      find(:xpath, "//input[contains(@ng-model,'city.name')]").set(city_state[:name])
      find(:xpath, "//button[contains(@ng-click,'create()')]").click
      within(:xpath,CITY_LIST_XPATH) do
        using_wait_time 5 do
          expect(page).to have_xpath("//a[contains(@class,'list-group-item')]", count:1)
          #expect(page).to have_xpath("//*[text()='#{city_state[:name]}']")
          expect(page).to have_content(city_state[:name])
        end
      end
    end

    scenario "complete form with helper" do
      create_city city_state

      within(:xpath,CITY_LIST_XPATH) do
        expect(page).to have_css("a.list-group-item", count:1)
      end
    end
  end

  feature "with existing City" do
    background(:each) do
      create_city city_state
    end

    scenario "can be updated" do
      existing_name=city_state[:name]
      new_name=FactoryGirl.attributes_for(:city)[:name]

      expect(page).to have_css("a.list-group-item", :count=>1)
      expect(page).to have_css("a.list-group-item", :text=>existing_name)
      expect(page).to have_no_css("a.list-group-item", :text=>new_name)

      update_city(existing_name, new_name)

      expect(page).to have_css("a.list-group-item", :count=>1)
      expect(page).to have_no_css("a.list-group-item", :text=>existing_name)
      expect(page).to have_css("a.list-group-item", :text=>new_name)
    end

    scenario "can be deleted" do
      within(:xpath,CITY_LIST_XPATH) do
        expect(page).to have_css("a.list-group-item",text:city_state[:name])
      end

      delete_city city_state[:name]

      within(:xpath,CITY_LIST_XPATH) do
        expect(page).to have_no_css("a.list-group-item",text:city_state[:name])
      end
    end

  end
end
