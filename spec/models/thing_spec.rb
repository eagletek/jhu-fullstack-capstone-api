require 'rails_helper'

RSpec.describe Thing, type: :model do
  include_context "db_cleanup_each"

  context "build valid thing" do
    it "default thing created with random data" do
      thing = FactoryGirl.build(:thing)
      expect(thing.name).to_not be_nil
      expect(thing.save).to be true
    end

    it "thing with non-nil description" do
      thing = FactoryGirl.build(:thing, :with_description, :with_notes)
      expect(thing.name).to_not be_nil
      expect(thing.description).to_not be_nil
      expect(thing.notes).to_not be_nil
      expect(thing.save).to be true
    end

    it "thing with explicit nil data" do
      thing = FactoryGirl.build(:thing, description:nil, notes:nil)
      expect(thing.name).to_not be_nil
      expect(thing.save).to be true
    end
  end

  context "valid thing" do
    let(:thing) { FactoryGirl.create(:thing) }

    it "creates new instance" do
      db_thing=Thing.find(thing.id)
      expect(db_thing.name).to eq(thing.name)
    end
  end

  context "invalid thing" do
    let(:thing) { FactoryGirl.build(:thing, :name=>nil) }

    it "provides error messages" do
      expect(thing.validate).to be false
      pp thing.errors.messages
      expect(thing.errors.messages).to include(:name=>["can't be blank"])
    end
  end

end
