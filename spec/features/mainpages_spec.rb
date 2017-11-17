require 'rails_helper'

RSpec.xfeature "Mainpages", type: :feature, :js=>true do

  context "when the main page is accessed" do
    before(:each) do
      visit "/"
    end
    it "displays the index.html launch page" do
      #save_and_open_screenshot
      #expect(page).to have_content("Hello (from app/views/ui/index.html.erb)")
      expect(page).to have_content(/Hello \(from .+index.html.*\)/)
    end
    it "index page has bootstrap styling" do
      expect(page).to have_css("div.container")
    end
    it "displays the main application page" do
      expect(page).to have_content("Sample App (from photo-tourist/pages/main.html)")
    end
    it "displays the cities tile" do
      expect(page).to have_content("Cities (from photo-tourist/cities/cities.html)")
    end
  end
end
